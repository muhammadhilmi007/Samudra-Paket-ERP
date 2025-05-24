"use client";

/**
 * ContactInfoForm Component
 * Third step in the employee form wizard for collecting contact information
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import FormField from '../../molecules/FormField';

const ContactInfoForm = ({ data, updateData }) => {
  const [formData, setFormData] = useState({
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    city: data.city || '',
    province: data.province || '',
    postalCode: data.postalCode || '',
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
      [name]: value
    }));
  };
  
  return (
    <div className="space-y-6">
      <Typography variant="h2" className="text-xl font-semibold">
        Contact Information
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          id="email"
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter email address"
        />
        
        <FormField
          id="phone"
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="Enter phone number"
        />
        
        <div className="md:col-span-2">
          <FormField
            id="address"
            label="Address"
            type="textarea"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Enter full address"
            rows={3}
          />
        </div>
        
        <FormField
          id="city"
          label="City"
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          placeholder="Enter city"
        />
        
        <FormField
          id="province"
          label="Province"
          type="select"
          name="province"
          value={formData.province}
          onChange={handleChange}
          required
          options={[
            { value: '', label: 'Select Province' },
            { value: 'DKI Jakarta', label: 'DKI Jakarta' },
            { value: 'Jawa Barat', label: 'Jawa Barat' },
            { value: 'Jawa Tengah', label: 'Jawa Tengah' },
            { value: 'Jawa Timur', label: 'Jawa Timur' },
            { value: 'Banten', label: 'Banten' },
            { value: 'Bali', label: 'Bali' },
            { value: 'Sumatera Utara', label: 'Sumatera Utara' },
            { value: 'Sumatera Selatan', label: 'Sumatera Selatan' },
            { value: 'Sulawesi Selatan', label: 'Sulawesi Selatan' },
            { value: 'Kalimantan Timur', label: 'Kalimantan Timur' },
            // Add more provinces as needed
          ]}
        />
        
        <FormField
          id="postalCode"
          label="Postal Code"
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          required
          placeholder="Enter postal code"
        />
      </div>
    </div>
  );
};

ContactInfoForm.propTypes = {
  data: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default ContactInfoForm;
