"use client";

import React from 'react';
import PropTypes from 'prop-types';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../atoms/Button';
import Form from '../../organisms/Form';
import Modal from '../../molecules/Modal';
import DatePicker from '../../molecules/DatePicker';
import { 
  useCreatePaymentMutation, 
  useUpdatePaymentMutation,
  useGetInvoicesQuery,
  useGetCustomersQuery
} from '../../../store/api/financeApi';

/**
 * PaymentForm Component
 * A form for creating and editing payment records
 * Integrated with Redux store and RTK Query
 */
const PaymentForm = ({
  payment = null,
  mode = 'create',
  onSubmit,
  onDelete,
  onClose,
}) => {
  // RTK Query mutations
  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();
  
  // Get invoices and customers for dropdown
  const { data: invoicesData, isLoading: isLoadingInvoices } = useGetInvoicesQuery({ status: 'unpaid', limit: 100 });
  const { data: customersData, isLoading: isLoadingCustomers } = useGetCustomersQuery({ limit: 100 });
  
  const invoices = invoicesData?.data || [];
  const customers = customersData?.data || [];
  
  // Combined loading state
  const loading = isCreating || isUpdating || isLoadingInvoices || isLoadingCustomers;
  // Define form validation schema
  const paymentSchema = z.object({
    customerId: z.string().min(1, 'Customer is required'),
    invoiceId: z.string().optional(),
    date: z.date(),
    method: z.string().min(1, 'Payment method is required'),
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    reference: z.string().optional(),
    notes: z.string().optional(),
    attachments: z.array(z.any()).optional(),
  });

  // Default form values
  const defaultValues = {
    customerId: '',
    invoiceId: '',
    date: new Date(),
    method: 'bank_transfer',
    amount: 0,
    reference: '',
    notes: '',
    attachments: [],
  };

  // Get form values from payment if in edit mode
  const getFormValues = () => {
    if (!payment) return defaultValues;

    return {
      customerId: payment.customerId || '',
      invoiceId: payment.invoiceId || '',
      date: payment.date ? new Date(payment.date) : new Date(),
      method: payment.method || 'bank_transfer',
      amount: payment.amount || 0,
      reference: payment.reference || '',
      notes: payment.notes || '',
      attachments: payment.attachments || [],
    };
  };

  // Handle form submission
  const handleSubmit = async (data) => {
    try {
      if (mode === 'create') {
        await createPayment(data).unwrap();
      } else if (mode === 'edit' && payment?.id) {
        await updatePayment({ id: payment.id, ...data }).unwrap();
      }
      
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  // Handle payment deletion
  const handleDelete = () => {
    if (onDelete && payment) {
      onDelete(payment);
    }
  };

  // Render form
  const renderForm = (form) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <Form.Field
              name="customerId"
              label="Customer"
              render={({ field }) => (
                <div>
                  <select
                    {...field}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    disabled={mode === 'view' || isLoadingCustomers}
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
          <div className="mb-4">
            <Form.Field
              name="invoiceId"
              label="Invoice (Optional)"
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  disabled={mode === 'view' || isLoadingInvoices}
                >
                  <option value="">Select an invoice</option>
                  {invoices.map(invoice => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} - Rp {invoice.amount.toLocaleString()}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
          <Form.Field
            name="date"
            label="Payment Date"
            required
            control={form.control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                disabled={mode === 'view'}
                maxDate={new Date()}
              />
            )}
          />
          <Form.Field
            name="method"
            label="Payment Method"
            required
            control={form.control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                disabled={mode === 'view'}
              >
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="e_wallet">E-Wallet</option>
                <option value="check">Check</option>
              </select>
            )}
          />
          <Form.Field
            name="amount"
            label="Amount (Rp)"
            required
            control={form.control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="0.01"
                step="0.01"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                disabled={mode === 'view'}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
              />
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
              {mode === 'create' ? 'Record Payment' : 'Update Payment'}
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
              Delete Payment
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
        return 'Record New Payment';
      case 'edit':
        return 'Edit Payment';
      case 'view':
        return 'Payment Details';
      default:
        return 'Payment Form';
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={modalTitle()}
      size="md"
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
          schema={paymentSchema}
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

PaymentForm.propTypes = {
  /**
   * Payment data for edit mode
   */
  payment: PropTypes.shape({
    id: PropTypes.string,
    customerId: PropTypes.string,
    invoiceId: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    method: PropTypes.string,
    amount: PropTypes.number,
    reference: PropTypes.string,
    notes: PropTypes.string,
    attachments: PropTypes.array,
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
   * Callback when payment is deleted
   */
  onDelete: PropTypes.func,
  /**
   * Callback when form is closed
   */
  onClose: PropTypes.func.isRequired,
};

export default PaymentForm;
