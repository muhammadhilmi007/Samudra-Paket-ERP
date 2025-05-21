"use client";

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { z } from 'zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../atoms/Button';
import Form from '../../organisms/Form';
import Modal from '../../molecules/Modal';
import DatePicker from '../../molecules/DatePicker';
import FileUpload from '../../molecules/FileUpload';

/**
 * ShipmentForm Component
 * A form for creating and editing shipments
 */
const ShipmentForm = ({
  shipment = null,
  mode = 'create',
  onSubmit,
  onDelete,
  onClose,
  loading = false,
}) => {
  // State for current step in multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // State for uploaded files
  const [files, setFiles] = useState({
    packagePhotos: [],
    documents: [],
  });

  // Define form validation schema
  const shipmentSchema = z.object({
    // Step 1: Customer & Package Information
    customerName: z.string().min(1, 'Customer name is required'),
    customerCode: z.string().min(1, 'Customer code is required'),
    packageType: z.string().min(1, 'Package type is required'),
    packageWeight: z.number().min(0.1, 'Weight must be greater than 0'),
    packageLength: z.number().min(1, 'Length must be greater than 0'),
    packageWidth: z.number().min(1, 'Width must be greater than 0'),
    packageHeight: z.number().min(1, 'Height must be greater than 0'),
    packageValue: z.number().min(0, 'Value must be 0 or greater'),
    packageDescription: z.string().optional(),
    
    // Step 2: Origin & Destination
    origin: z.string().min(1, 'Origin is required'),
    originAddress: z.string().min(1, 'Origin address is required'),
    originCity: z.string().min(1, 'Origin city is required'),
    originZipCode: z.string().min(1, 'Origin zip code is required'),
    originContactName: z.string().min(1, 'Origin contact name is required'),
    originContactPhone: z.string().min(1, 'Origin contact phone is required'),
    
    destination: z.string().min(1, 'Destination is required'),
    destinationAddress: z.string().min(1, 'Destination address is required'),
    destinationCity: z.string().min(1, 'Destination city is required'),
    destinationZipCode: z.string().min(1, 'Destination zip code is required'),
    destinationContactName: z.string().min(1, 'Destination contact name is required'),
    destinationContactPhone: z.string().min(1, 'Destination contact phone is required'),
    
    // Step 3: Service & Payment
    service: z.string().min(1, 'Service is required'),
    estimatedDeliveryDate: z.date().optional(),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    paymentStatus: z.string().min(1, 'Payment status is required'),
    amount: z.number().min(0, 'Amount must be 0 or greater'),
    status: z.string().min(1, 'Status is required'),
    notes: z.string().optional(),
  });

  // Default form values
  const defaultValues = {
    customerName: '',
    customerCode: '',
    packageType: 'parcel',
    packageWeight: 1,
    packageLength: 10,
    packageWidth: 10,
    packageHeight: 10,
    packageValue: 0,
    packageDescription: '',
    
    origin: '',
    originAddress: '',
    originCity: '',
    originZipCode: '',
    originContactName: '',
    originContactPhone: '',
    
    destination: '',
    destinationAddress: '',
    destinationCity: '',
    destinationZipCode: '',
    destinationContactName: '',
    destinationContactPhone: '',
    
    service: 'regular',
    estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    amount: 0,
    status: 'pending',
    notes: '',
  };

  // Get form values from shipment if in edit mode
  const getFormValues = () => {
    if (!shipment) return defaultValues;
    
    return {
      ...defaultValues,
      ...shipment,
      estimatedDeliveryDate: shipment.estimatedDeliveryDate 
        ? new Date(shipment.estimatedDeliveryDate) 
        : defaultValues.estimatedDeliveryDate,
    };
  };

  // Handle form submission
  const handleSubmit = async (data) => {
    try {
      // Add files to data
      const formData = {
        ...data,
        packagePhotos: files.packagePhotos,
        documents: files.documents,
      };
      
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handle shipment deletion
  const handleDelete = async () => {
    if (onDelete && shipment) {
      await onDelete(shipment.id);
    }
  };

  // Handle file uploads
  const handleFileUpload = (type, uploadedFiles) => {
    setFiles({
      ...files,
      [type]: uploadedFiles,
    });
  };

  // Render form step 1: Customer & Package Information
  const renderStep1 = (form) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer & Package Information</h3>
      </div>
      
      <Form.Field
        name="customerName"
        label="Customer Name"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          />
        )}
      />
      
      <Form.Field
        name="customerCode"
        label="Customer Code"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          />
        )}
      />
      
      <Form.Field
        name="packageType"
        label="Package Type"
        required
        control={form.control}
        render={({ field }) => (
          <select
            {...field}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          >
            <option value="parcel">Parcel</option>
            <option value="document">Document</option>
            <option value="fragile">Fragile</option>
            <option value="heavy">Heavy</option>
            <option value="liquid">Liquid</option>
          </select>
        )}
      />
      
      <Form.Field
        name="packageWeight"
        label="Weight (kg)"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="number"
            step="0.1"
            min="0.1"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
            onChange={(e) => field.onChange(parseFloat(e.target.value))}
          />
        )}
      />
      
      <div className="md:col-span-2">
        <div className="grid grid-cols-3 gap-4">
          <Form.Field
            name="packageLength"
            label="Length (cm)"
            required
            control={form.control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="1"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                disabled={mode === 'view'}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          
          <Form.Field
            name="packageWidth"
            label="Width (cm)"
            required
            control={form.control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="1"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                disabled={mode === 'view'}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
          
          <Form.Field
            name="packageHeight"
            label="Height (cm)"
            required
            control={form.control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                min="1"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                disabled={mode === 'view'}
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
              />
            )}
          />
        </div>
      </div>
      
      <Form.Field
        name="packageValue"
        label="Declared Value (Rp)"
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="number"
            min="0"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
          />
        )}
      />
      
      <div className="md:col-span-2">
        <Form.Field
          name="packageDescription"
          label="Package Description"
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
      
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Package Photos
        </label>
        <FileUpload
          multiple
          accept="image/*"
          onChange={(files) => handleFileUpload('packagePhotos', files)}
          disabled={mode === 'view'}
          value={files.packagePhotos}
          maxFiles={5}
        />
      </div>
    </div>
  );

  // Render form step 2: Origin & Destination
  const renderStep2 = (form) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Origin & Destination</h3>
      </div>
      
      <div className="md:col-span-2">
        <h4 className="text-md font-medium text-gray-700 mb-2">Origin</h4>
      </div>
      
      <Form.Field
        name="origin"
        label="Origin Name"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          />
        )}
      />
      
      <Form.Field
        name="originContactName"
        label="Contact Name"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          />
        )}
      />
      
      <Form.Field
        name="originContactPhone"
        label="Contact Phone"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          />
        )}
      />
      
      <div className="md:col-span-2">
        <Form.Field
          name="originAddress"
          label="Address"
          required
          control={form.control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={2}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              disabled={mode === 'view'}
            />
          )}
        />
      </div>
      
      <Form.Field
        name="originCity"
        label="City"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          />
        )}
      />
      
      <Form.Field
        name="originZipCode"
        label="Zip Code"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          />
        )}
      />
      
      <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
        <h4 className="text-md font-medium text-gray-700 mb-2">Destination</h4>
      </div>
      
      <Form.Field
        name="destination"
        label="Destination Name"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          />
        )}
      />
      
      <Form.Field
        name="destinationContactName"
        label="Contact Name"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          />
        )}
      />
      
      <Form.Field
        name="destinationContactPhone"
        label="Contact Phone"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          />
        )}
      />
      
      <div className="md:col-span-2">
        <Form.Field
          name="destinationAddress"
          label="Address"
          required
          control={form.control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={2}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              disabled={mode === 'view'}
            />
          )}
        />
      </div>
      
      <Form.Field
        name="destinationCity"
        label="City"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          />
        )}
      />
      
      <Form.Field
        name="destinationZipCode"
        label="Zip Code"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          />
        )}
      />
    </div>
  );

  // Render form step 3: Service & Payment
  const renderStep3 = (form) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Service & Payment</h3>
      </div>
      
      <Form.Field
        name="service"
        label="Service Type"
        required
        control={form.control}
        render={({ field }) => (
          <select
            {...field}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          >
            <option value="regular">Regular</option>
            <option value="express">Express</option>
            <option value="same_day">Same Day</option>
            <option value="economy">Economy</option>
          </select>
        )}
      />
      
      <Form.Field
        name="estimatedDeliveryDate"
        label="Estimated Delivery Date"
        control={form.control}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={field.onChange}
            disabled={mode === 'view'}
            minDate={new Date()}
          />
        )}
      />
      
      <Form.Field
        name="status"
        label="Shipment Status"
        required
        control={form.control}
        render={({ field }) => (
          <select
            {...field}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
          >
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        )}
      />
      
      <Form.Field
        name="amount"
        label="Shipment Amount (Rp)"
        required
        control={form.control}
        render={({ field }) => (
          <input
            {...field}
            type="number"
            min="0"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={mode === 'view'}
            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
          />
        )}
      />
      
      <Form.Field
        name="paymentMethod"
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
            <option value="credit">Credit</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        )}
      />
      
      <Form.Field
        name="paymentStatus"
        label="Payment Status"
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
            <option value="cancelled">Cancelled</option>
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
      
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Documents
        </label>
        <FileUpload
          multiple
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={(files) => handleFileUpload('documents', files)}
          disabled={mode === 'view'}
          value={files.documents}
          maxFiles={5}
        />
      </div>
    </div>
  );

  // Render form step based on current step
  const renderFormStep = (form) => {
    switch (currentStep) {
      case 1:
        return renderStep1(form);
      case 2:
        return renderStep2(form);
      case 3:
        return renderStep3(form);
      default:
        return null;
    }
  };

  // Render form navigation buttons
  const renderFormNavigation = () => {
    return (
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1 || loading}
        >
          Previous
        </Button>
        
        {currentStep < totalSteps ? (
          <Button
            variant="primary"
            onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
            disabled={loading}
          >
            Next
          </Button>
        ) : (
          mode !== 'view' && (
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {mode === 'create' ? 'Create Shipment' : 'Update Shipment'}
            </Button>
          )
        )}
      </div>
    );
  };

  // Modal title based on mode
  const modalTitle = () => {
    switch (mode) {
      case 'create':
        return 'Create New Shipment';
      case 'edit':
        return 'Edit Shipment';
      case 'view':
        return 'Shipment Details';
      default:
        return 'Shipment Form';
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={modalTitle()}
      size="lg"
    >
      <div className="relative">
        <button
          type="button"
          className="absolute top-0 right-0 text-gray-400 hover:text-gray-500"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      currentStep > index
                        ? 'bg-primary-600 text-white'
                        : currentStep === index + 1
                        ? 'bg-primary-100 text-primary-600 border border-primary-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={`w-10 h-1 ${
                        currentStep > index + 1 ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          <div className="mt-2 text-sm font-medium text-gray-700">
            {currentStep === 1 && 'Customer & Package Information'}
            {currentStep === 2 && 'Origin & Destination'}
            {currentStep === 3 && 'Service & Payment'}
          </div>
        </div>
        
        <Form
          schema={shipmentSchema}
          defaultValues={getFormValues()}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {(form) => (
            <>
              {renderFormStep(form)}
              
              {mode === 'view' ? (
                <div className="flex justify-end mt-6">
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  {renderFormNavigation()}
                  
                  {mode === 'edit' && currentStep === totalSteps && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button
                        variant="danger"
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-full"
                      >
                        Delete Shipment
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </Form>
      </div>
    </Modal>
  );
};

ShipmentForm.propTypes = {
  /**
   * Shipment data for edit mode
   */
  shipment: PropTypes.object,
  /**
   * Form mode: 'create', 'edit', or 'view'
   */
  mode: PropTypes.oneOf(['create', 'edit', 'view']),
  /**
   * Callback when form is submitted
   */
  onSubmit: PropTypes.func,
  /**
   * Callback when shipment is deleted
   */
  onDelete: PropTypes.func,
  /**
   * Callback when form is closed
   */
  onClose: PropTypes.func.isRequired,
  /**
   * Whether the component is in a loading state
   */
  loading: PropTypes.bool,
};

export default ShipmentForm;
