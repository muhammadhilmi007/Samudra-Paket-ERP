"use client";

/**
 * PersonalInfoForm Component
 * First step in the employee form wizard for collecting personal information
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import FormField from '../../molecules/FormField';

const PersonalInfoForm = ({ data, updateData, mode }) => {
  const [formData, setFormData] = useState({
    name: data.name || '',
    employeeId: data.employeeId || '',
    dateOfBirth: data.dateOfBirth || '',
    gender: data.gender || 'MALE',
    nationality: data.nationality || 'Indonesian',
    identityNumber: data.identityNumber || '',
    taxNumber: data.taxNumber || '',
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
        Personal Information
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          id="name"
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter full name"
        />
        
        <FormField
          id="employeeId"
          label="Employee ID"
          type="text"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          required
          placeholder="e.g., EMP-2023-001"
          disabled={mode === 'edit'}
          helperText={mode === 'edit' ? "Employee ID cannot be changed" : ""}
        />
        
        <FormField
          id="dateOfBirth"
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
        
        <FormField
          id="gender"
          label="Gender"
          type="select"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          options={[
            { value: 'MALE', label: 'Male' },
            { value: 'FEMALE', label: 'Female' },
            { value: 'OTHER', label: 'Other' },
          ]}
        />
        
        <FormField
          id="nationality"
          label="Nationality"
          type="text"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          required
          placeholder="Enter nationality"
        />
        
        <FormField
          id="identityNumber"
          label="Identity Number (KTP)"
          type="text"
          name="identityNumber"
          value={formData.identityNumber}
          onChange={handleChange}
          required
          placeholder="Enter 16-digit KTP number"
        />
        
        <FormField
          id="taxNumber"
          label="Tax Number (NPWP)"
          type="text"
          name="taxNumber"
          value={formData.taxNumber}
          onChange={handleChange}
          placeholder="Enter NPWP number"
          helperText="Format: 00.000.000.0-000.000"
        />
      </div>
    </div>
  );
};

PersonalInfoForm.propTypes = {
  data: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['add', 'edit']).isRequired,
};

export default PersonalInfoForm;
