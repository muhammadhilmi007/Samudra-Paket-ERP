"use client";

/**
 * EmploymentInfoForm Component
 * Second step in the employee form wizard for collecting employment information
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import FormField from '../../molecules/FormField';

const EmploymentInfoForm = ({ data, updateData }) => {
  const [formData, setFormData] = useState({
    position: data.position || '',
    department: data.department || '',
    branch: data.branch || '',
    joinDate: data.joinDate || '',
    status: data.status || 'ACTIVE',
    contractType: data.contractType || 'PERMANENT',
    contractEnd: data.contractEnd || '',
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
        Employment Information
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          id="position"
          label="Position"
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
          placeholder="Enter job position"
        />
        
        <FormField
          id="department"
          label="Department"
          type="select"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          options={[
            { value: '', label: 'Select Department' },
            { value: 'Management', label: 'Management' },
            { value: 'Operations', label: 'Operations' },
            { value: 'Finance', label: 'Finance' },
            { value: 'Human Resources', label: 'Human Resources' },
            { value: 'Customer Service', label: 'Customer Service' },
            { value: 'Warehouse', label: 'Warehouse' },
            { value: 'Delivery', label: 'Delivery' },
            { value: 'IT', label: 'IT' },
          ]}
        />
        
        <FormField
          id="branch"
          label="Branch"
          type="select"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          required
          options={[
            { value: '', label: 'Select Branch' },
            { value: 'Jakarta Branch', label: 'Jakarta Branch' },
            { value: 'Bandung Branch', label: 'Bandung Branch' },
            { value: 'Surabaya Branch', label: 'Surabaya Branch' },
            { value: 'Medan Branch', label: 'Medan Branch' },
            { value: 'Makassar Branch', label: 'Makassar Branch' },
          ]}
        />
        
        <FormField
          id="joinDate"
          label="Join Date"
          type="date"
          name="joinDate"
          value={formData.joinDate}
          onChange={handleChange}
          required
        />
        
        <FormField
          id="status"
          label="Employment Status"
          type="select"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          options={[
            { value: 'ACTIVE', label: 'Active' },
            { value: 'INACTIVE', label: 'Inactive' },
            { value: 'ON_LEAVE', label: 'On Leave' },
            { value: 'SUSPENDED', label: 'Suspended' },
            { value: 'TERMINATED', label: 'Terminated' },
          ]}
        />
        
        <FormField
          id="contractType"
          label="Contract Type"
          type="select"
          name="contractType"
          value={formData.contractType}
          onChange={handleChange}
          required
          options={[
            { value: 'PERMANENT', label: 'Permanent' },
            { value: 'CONTRACT', label: 'Contract' },
            { value: 'PROBATION', label: 'Probation' },
            { value: 'INTERNSHIP', label: 'Internship' },
            { value: 'PART_TIME', label: 'Part Time' },
          ]}
        />
        
        {formData.contractType !== 'PERMANENT' && (
          <FormField
            id="contractEnd"
            label="Contract End Date"
            type="date"
            name="contractEnd"
            value={formData.contractEnd}
            onChange={handleChange}
            required={formData.contractType !== 'PERMANENT'}
          />
        )}
      </div>
    </div>
  );
};

EmploymentInfoForm.propTypes = {
  data: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default EmploymentInfoForm;
