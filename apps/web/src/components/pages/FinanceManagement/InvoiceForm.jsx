"use client";

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { z } from 'zod';
import { PlusIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../atoms/Button';
import Form from '../../organisms/Form';
import Modal from '../../molecules/Modal';
import DatePicker from '../../molecules/DatePicker';
import { useCreateInvoiceMutation, useUpdateInvoiceMutation, useGetCustomersQuery } from '../../../store/api/financeApi';

/**
 * InvoiceForm Component
 * A form for creating and editing invoices
 * Integrated with Redux store and RTK Query
 */
const InvoiceForm = ({
  invoice = null,
  mode = 'create',
  onSubmit,
  onDelete,
  onClose,
}) => {
  // RTK Query mutations
  const [createInvoice, { isLoading: isCreating }] = useCreateInvoiceMutation();
  const [updateInvoice, { isLoading: isUpdating }] = useUpdateInvoiceMutation();
  
  // Get customers for dropdown
  const { data: customersData } = useGetCustomersQuery({ limit: 100 });
  const customers = customersData?.data || [];
  
  // Combined loading state
  const loading = isCreating || isUpdating;
  // Define form validation schema
  const invoiceItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().min(0, 'Unit price must be 0 or greater'),
    amount: z.number().min(0, 'Amount must be 0 or greater'),
  });

  const invoiceSchema = z.object({
    customerName: z.string().min(1, 'Customer name is required'),
    customerCode: z.string().min(1, 'Customer code is required'),
    date: z.date(),
    dueDate: z.date(),
    status: z.string().min(1, 'Status is required'),
    paymentTerms: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
    subtotal: z.number().min(0, 'Subtotal must be 0 or greater'),
    tax: z.number().min(0, 'Tax must be 0 or greater'),
    discount: z.number().min(0, 'Discount must be 0 or greater'),
    amount: z.number().min(0, 'Total amount must be 0 or greater'),
  });

  // Default form values
  const defaultValues = {
    customerName: '',
    customerCode: '',
    date: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'pending',
    paymentTerms: 'net_30',
    notes: '',
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ],
    subtotal: 0,
    tax: 0,
    discount: 0,
    amount: 0,
  };

  // Get form values from invoice if in edit mode
  const getFormValues = () => {
    if (!invoice) return defaultValues;
    
    return {
      ...defaultValues,
      ...invoice,
      date: invoice.date ? new Date(invoice.date) : defaultValues.date,
      dueDate: invoice.dueDate ? new Date(invoice.dueDate) : defaultValues.dueDate,
      items: invoice.items && invoice.items.length > 0 
        ? invoice.items 
        : defaultValues.items,
    };
  };

  // Calculate item amount
  const calculateItemAmount = (quantity, unitPrice) => {
    return quantity * unitPrice;
  };

  // Calculate invoice totals
  const calculateTotals = (items, tax = 0, discount = 0) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * tax) / 100;
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal + taxAmount - discountAmount;
    
    return {
      subtotal,
      tax: taxAmount,
      discount: discountAmount,
      amount: total,
    };
  };

  // Handle form submission
  const handleSubmit = async (data) => {
    try {
      // Calculate final totals
      const calculatedData = {
        ...data,
        subtotal: calculateSubtotal(data.items),
        tax: calculateTax(data.items),
        amount: calculateTotal(data.items, data.tax, data.discount),
      };
      
      if (mode === 'create') {
        await createInvoice(calculatedData).unwrap();
      } else if (mode === 'edit' && invoice?.id) {
        await updateInvoice({ id: invoice.id, ...calculatedData }).unwrap();
      }
      
      if (onSubmit) {
        onSubmit(calculatedData);
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  // Handle deletion
  const handleDelete = () => {
    if (onDelete && invoice) {
      onDelete(invoice);
    }
  };

  // Render form
  const renderForm = (form) => {
    const { fields, append, remove } = form.useFieldArray({
      name: 'items',
    });

    // Watch for changes to calculate totals
    const items = form.watch('items') || [];
    const taxRate = form.watch('tax') || 0;
    const discountRate = form.watch('discount') || 0;
    
    // Calculate totals
    const totals = calculateTotals(items, taxRate, discountRate);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Details</h3>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <Form.Field
              name="customerId"
              render={({ field }) => (
                <div>
                  <select
                    {...field}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    disabled={mode === 'view'}
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />
          </div>
          
          <Form.Field
            name="date"
            label="Invoice Date"
            required
            control={form.control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                disabled={mode === 'view'}
              />
            )}
          />
          
          <Form.Field
            name="dueDate"
            label="Due Date"
            required
            control={form.control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                disabled={mode === 'view'}
                minDate={form.watch('date')}
              />
            )}
          />
          
          <Form.Field
            name="status"
            label="Status"
            required
            control={form.control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                disabled={mode === 'view'}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}
          />
          
          <Form.Field
            name="paymentTerms"
            label="Payment Terms"
            control={form.control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                disabled={mode === 'view'}
              >
                <option value="net_15">Net 15 Days</option>
                <option value="net_30">Net 30 Days</option>
                <option value="net_45">Net 45 Days</option>
                <option value="net_60">Net 60 Days</option>
                <option value="due_on_receipt">Due on Receipt</option>
              </select>
            )}
          />
          
          <div className="md:col-span-2">
            <Form.Field
              name="notes"
              label="Notes"
              control={form.control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  disabled={mode === 'view'}
                />
              )}
            />
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
            {mode !== 'view' && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({
                  description: '',
                  quantity: 1,
                  unitPrice: 0,
                  amount: 0,
                })}
                className="flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  {mode !== 'view' && (
                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="px-3 py-2">
                      <Form.Field
                        name={`items.${index}.description`}
                        control={form.control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            disabled={mode === 'view'}
                          />
                        )}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Form.Field
                        name={`items.${index}.quantity`}
                        control={form.control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            min="1"
                            className="w-full text-right border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            disabled={mode === 'view'}
                            onChange={(e) => {
                              const quantity = parseInt(e.target.value, 10) || 0;
                              field.onChange(quantity);
                              
                              // Update amount
                              const unitPrice = form.getValues(`items.${index}.unitPrice`) || 0;
                              const amount = calculateItemAmount(quantity, unitPrice);
                              form.setValue(`items.${index}.amount`, amount);
                            }}
                          />
                        )}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Form.Field
                        name={`items.${index}.unitPrice`}
                        control={form.control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            min="0"
                            className="w-full text-right border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            disabled={mode === 'view'}
                            onChange={(e) => {
                              const unitPrice = parseFloat(e.target.value) || 0;
                              field.onChange(unitPrice);
                              
                              // Update amount
                              const quantity = form.getValues(`items.${index}.quantity`) || 0;
                              const amount = calculateItemAmount(quantity, unitPrice);
                              form.setValue(`items.${index}.amount`, amount);
                            }}
                          />
                        )}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Form.Field
                        name={`items.${index}.amount`}
                        control={form.control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="number"
                            className="w-full text-right border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            disabled={true}
                            value={field.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          />
                        )}
                      />
                    </td>
                    {mode !== 'view' && (
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-800"
                          disabled={fields.length <= 1}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col items-end space-y-2">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Subtotal:</span>
                <span className="text-sm font-medium text-gray-900">
                  Rp {totals.subtotal.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between py-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Tax (%):</span>
                  {mode !== 'view' ? (
                    <Form.Field
                      name="tax"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="0"
                          max="100"
                          className="w-16 text-right border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      )}
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900">
                      {taxRate}%
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Rp {totals.tax.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between py-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Discount (%):</span>
                  {mode !== 'view' ? (
                    <Form.Field
                      name="discount"
                      control={form.control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="0"
                          max="100"
                          className="w-16 text-right border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      )}
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900">
                      {discountRate}%
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Rp {totals.discount.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-t border-gray-200 font-medium">
                <span className="text-base text-gray-900">Total:</span>
                <span className="text-base text-gray-900">
                  Rp {totals.amount.toLocaleString()}
                </span>
              </div>
              
              <Form.Field
                name="amount"
                control={form.control}
                render={({ field }) => (
                  <input
                    type="hidden"
                    {...field}
                    value={totals.amount}
                  />
                )}
              />
              
              <Form.Field
                name="subtotal"
                control={form.control}
                render={({ field }) => (
                  <input
                    type="hidden"
                    {...field}
                    value={totals.subtotal}
                  />
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          
          {mode === 'view' ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onClose();
              }}
            >
              Close
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {mode === 'create' ? 'Create Invoice' : 'Update Invoice'}
            </Button>
          )}
        </div>
        
        {mode === 'edit' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={loading}
              className="w-full"
            >
              Delete Invoice
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Modal title based on mode
  const modalTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New Invoice';
      case 'edit':
        return 'Edit Invoice';
      case 'view':
        return 'Invoice Details';
      default:
        return 'Invoice Form';
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={modalTitle()}
      size="xl"
    >
      <div className="relative">
        <button
          type="button"
          className="absolute top-0 right-0 text-gray-400 hover:text-gray-500"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <Form
          schema={invoiceSchema}
          defaultValues={getFormValues()}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {(form) => renderForm(form)}
        </Form>
      </div>
    </Modal>
  );
};

InvoiceForm.propTypes = {
  /**
   * Invoice data for edit mode
   */
  invoice: PropTypes.shape({
    id: PropTypes.string,
    invoiceNumber: PropTypes.string,
    customerId: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    status: PropTypes.string,
    paymentTerms: PropTypes.string,
    notes: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        quantity: PropTypes.number,
        unitPrice: PropTypes.number,
        amount: PropTypes.number,
      })
    ),
    subtotal: PropTypes.number,
    tax: PropTypes.number,
    discount: PropTypes.number,
    amount: PropTypes.number,
  }),
  /**
   * Form mode: 'create', 'edit', or 'view'
   */
  mode: PropTypes.oneOf(['create', 'edit', 'view']),
  /**
   * Callback when form is submitted
   */
  onSubmit: PropTypes.func,
  /**
   * Callback when invoice is deleted
   */
  onDelete: PropTypes.func,
  /**
   * Callback when form is closed
   */
  onClose: PropTypes.func,
};

export default InvoiceForm;
