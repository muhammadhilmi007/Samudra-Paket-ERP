"use client";

/**
 * EmergencyContactForm Component
 * Sixth step in the employee form wizard for collecting emergency contact information
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import FormField from '../../molecules/FormField';

// Relationship options
const RELATIONSHIPS = [
  'Spouse', 'Parent', 'Child', 'Sibling', 'Relative', 'Friend', 'Other'
];

const EmergencyContactForm = ({ data, updateData }) => {
  const [formData, setFormData] = useState({
    emergencyContact: {
      name: data.emergencyContact?.name || '',
      relationship: data.emergencyContact?.relationship || '',
      phone: data.emergencyContact?.phone || '',
      alternatePhone: data.emergencyContact?.alternatePhone || '',
      email: data.emergencyContact?.email || '',
      address: data.emergencyContact?.address || '',
    }
  });
  
  // Update parent form data when local form data changes
  useEffect(() => {
    updateData(formData);
  }, [formData, updateData]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      emergencyContact: {
        ...prevData.emergencyContact,
        [name]: value
      }
    }));
  };
  
  return (
    <div className="space-y-6">
      <Typography variant="h2" className="text-xl font-semibold">
        Emergency Contact Information
      </Typography>
      
      <Typography variant="body1" className="text-gray-600">
        Please provide details of someone we can contact in case of an emergency.
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          id="name"
          label="Full Name"
          type="text"
          name="name"
          value={formData.emergencyContact.name}
          onChange={handleChange}
          required
          placeholder="Enter full name"
        />
        
        <FormField
          id="relationship"
          label="Relationship"
          type="select"
          name="relationship"
          value={formData.emergencyContact.relationship}
          onChange={handleChange}
          required
          options={[
            { value: '', label: 'Select Relationship' },
            ...RELATIONSHIPS.map(rel => ({ value: rel, label: rel }))
          ]}
        />
        
        <FormField
          id="phone"
          label="Primary Phone Number"
          type="tel"
          name="phone"
          value={formData.emergencyContact.phone}
          onChange={handleChange}
          required
          placeholder="Enter phone number"
        />
        
        <FormField
          id="alternatePhone"
          label="Alternate Phone Number"
          type="tel"
          name="alternatePhone"
          value={formData.emergencyContact.alternatePhone}
          onChange={handleChange}
          placeholder="Enter alternate phone number (optional)"
        />
        
        <FormField
          id="email"
          label="Email Address"
          type="email"
          name="email"
          value={formData.emergencyContact.email}
          onChange={handleChange}
          placeholder="Enter email address (optional)"
        />
        
        <div className="md:col-span-2">
          <FormField
            id="address"
            label="Address"
            type="textarea"
            name="address"
            value={formData.emergencyContact.address}
            onChange={handleChange}
            placeholder="Enter address (optional)"
            rows={3}
          />
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-md mt-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <Typography variant="body2" className="text-sm text-yellow-800">
              Please ensure that you have the consent of the person you are listing as an emergency contact. This information will only be used in case of emergencies.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

EmergencyContactForm.propTypes = {
  data: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default EmergencyContactForm;
