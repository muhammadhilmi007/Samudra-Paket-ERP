"use client";

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormField } from '../../organisms/Form';
import Button from '../../atoms/Button';
import { z } from 'zod';
import { useCreateCustomerMutation, useUpdateCustomerMutation } from '../../../store/api/customerApi';

/**
 * CustomerForm Component
 * A form for creating, editing, and viewing customer details
 * Integrated with Redux store and RTK Query
 */
const CustomerForm = ({
  customer = null,
  mode = 'create', // 'create', 'edit', or 'view'
  onSubmit,
  onDelete,
  onClose,
}) => {
  // State for confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // RTK Query mutations
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  
  // Combined loading state
  const loading = isCreating || isUpdating;

  // Validation schema
  const customerSchema = z.object({
    name: z.string().min(1, 'Customer name is required'),
    code: z.string().min(1, 'Customer code is required'),
    type: z.enum(['corporate', 'individual']),
    status: z.enum(['active', 'inactive']),
    contactPerson: z.string().optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    taxId: z.string().optional(),
    notes: z.string().optional(),
  });

  // Handle form submission
  const handleSubmit = async (data) => {
    try {
      if (mode === 'create') {
        await createCustomer(data).unwrap();
      } else if (mode === 'edit' && customer?.id) {
        await updateCustomer({ id: customer.id, ...data }).unwrap();
      }
      
      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  // Handle customer deletion
  const handleDelete = async () => {
    if (onDelete && customer) {
      await onDelete(customer);
    }
  };

  // Default values for the form
  const defaultValues = customer
    ? {
        name: customer.name || '',
        code: customer.code || '',
        type: customer.type || 'corporate',
        status: customer.status || 'active',
        contactPerson: customer.contactPerson || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zipCode: customer.zipCode || '',
        country: customer.country || '',
        taxId: customer.taxId || '',
        notes: customer.notes || '',
      }
    : {
        name: '',
        code: '',
        type: 'corporate',
        status: 'active',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Indonesia',
        taxId: '',
        notes: '',
      };

  // Render delete confirmation dialog
  const renderDeleteConfirmation = () => {
    if (!showDeleteConfirm) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Customer
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this customer? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                className="w-full sm:w-auto sm:ml-3"
                loading={loading}
              >
                Delete
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="mt-3 w-full sm:mt-0 sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {mode === 'create' 
                    ? 'Create New Customer' 
                    : mode === 'edit' 
                      ? 'Edit Customer' 
                      : 'Customer Details'}
                </h3>
                <div className="mt-4">
                  <Form
                    defaultValues={defaultValues}
                    schema={customerSchema}
                    onSubmit={handleSubmit}
                    loading={loading}
                    className="space-y-6"
                    submitButtonText={mode === 'create' ? 'Create Customer' : 'Update Customer'}
                    showResetButton={mode !== 'view'}
                    resetButtonText="Cancel"
                    disabled={mode === 'view'}
                  >
                    {({ control }) => (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="name"
                            label="Customer Name"
                            type="text"
                            required
                            control={control}
                            disabled={mode === 'view'}
                          />
                          
                          <FormField
                            name="code"
                            label="Customer Code"
                            type="text"
                            required
                            control={control}
                            disabled={mode === 'view'}
                            helperText="Unique identifier for this customer"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="type"
                            label="Customer Type"
                            type="select"
                            required
                            control={control}
                            options={[
                              { value: 'corporate', label: 'Corporate' },
                              { value: 'individual', label: 'Individual' },
                            ]}
                            disabled={mode === 'view'}
                          />
                          
                          <FormField
                            name="status"
                            label="Status"
                            type="select"
                            required
                            control={control}
                            options={[
                              { value: 'active', label: 'Active' },
                              { value: 'inactive', label: 'Inactive' },
                            ]}
                            disabled={mode === 'view'}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="contactPerson"
                            label="Contact Person"
                            type="text"
                            control={control}
                            disabled={mode === 'view'}
                          />
                          
                          <FormField
                            name="taxId"
                            label="Tax ID / NPWP"
                            type="text"
                            control={control}
                            disabled={mode === 'view'}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="email"
                            label="Email"
                            type="email"
                            control={control}
                            disabled={mode === 'view'}
                          />
                          
                          <FormField
                            name="phone"
                            label="Phone"
                            type="tel"
                            control={control}
                            disabled={mode === 'view'}
                          />
                        </div>
                        
                        <FormField
                          name="address"
                          label="Address"
                          type="text"
                          control={control}
                          disabled={mode === 'view'}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            name="city"
                            label="City"
                            type="text"
                            control={control}
                            disabled={mode === 'view'}
                          />
                          
                          <FormField
                            name="state"
                            label="State/Province"
                            type="text"
                            control={control}
                            disabled={mode === 'view'}
                          />
                          
                          <FormField
                            name="zipCode"
                            label="ZIP/Postal Code"
                            type="text"
                            control={control}
                            disabled={mode === 'view'}
                          />
                        </div>
                        
                        <FormField
                          name="country"
                          label="Country"
                          type="select"
                          control={control}
                          options={[
                            { value: 'Indonesia', label: 'Indonesia' },
                            { value: 'Malaysia', label: 'Malaysia' },
                            { value: 'Singapore', label: 'Singapore' },
                            { value: 'Thailand', label: 'Thailand' },
                            { value: 'Vietnam', label: 'Vietnam' },
                          ]}
                          disabled={mode === 'view'}
                        />
                        
                        <FormField
                          name="notes"
                          label="Notes"
                          type="textarea"
                          control={control}
                          rows={3}
                          disabled={mode === 'view'}
                        />
                      </>
                    )}
                  </Form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {mode === 'create' && (
              <Button
                type="submit"
                form="form"
                variant="primary"
                className="w-full sm:w-auto sm:ml-3"
                loading={loading}
              >
                Create Customer
              </Button>
            )}
            
            {mode === 'edit' && (
              <>
                <Button
                  type="submit"
                  form="form"
                  variant="primary"
                  className="w-full sm:w-auto sm:ml-3"
                  loading={loading}
                >
                  Update Customer
                </Button>
                
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
                >
                  Delete
                </Button>
              </>
            )}
            
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </div>
      </div>
      
      {renderDeleteConfirmation()}
    </div>
  );
};

CustomerForm.propTypes = {
  /**
   * Customer data (null for create mode)
   */
  customer: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    code: PropTypes.string,
    type: PropTypes.oneOf(['corporate', 'individual']),
    status: PropTypes.oneOf(['active', 'inactive']),
    contactPerson: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipCode: PropTypes.string,
    country: PropTypes.string,
    taxId: PropTypes.string,
    notes: PropTypes.string,
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
   * Callback when customer is deleted
   */
  onDelete: PropTypes.func,
  /**
   * Callback when form is closed
   */
  onClose: PropTypes.func,
};

export default CustomerForm;
