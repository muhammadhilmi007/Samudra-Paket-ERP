"use client";

/**
 * BankInfoForm Component
 * Fifth step in the employee form wizard for collecting bank account information
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import FormField from '../../molecules/FormField';

// List of banks in Indonesia
const BANKS = [
  'BCA', 'BNI', 'BRI', 'Mandiri', 'CIMB Niaga', 'Danamon',
  'Permata', 'Maybank', 'OCBC NISP', 'BTN', 'BTPN', 'Panin',
  'UOB', 'HSBC', 'Standard Chartered', 'Citibank', 'Other'
];

const BankInfoForm = ({ data, updateData }) => {
  const [formData, setFormData] = useState({
    bankAccount: {
      bank: data.bankAccount?.bank || '',
      accountNumber: data.bankAccount?.accountNumber || '',
      accountName: data.bankAccount?.accountName || '',
      branch: data.bankAccount?.branch || '',
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
      bankAccount: {
        ...prevData.bankAccount,
        [name]: value
      }
    }));
  };
  
  return (
    <div className="space-y-6">
      <Typography variant="h2" className="text-xl font-semibold">
        Bank Account Information
      </Typography>
      
      <Typography variant="body1" className="text-gray-600">
        This information will be used for salary payments and expense reimbursements.
      </Typography>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          id="bank"
          label="Bank Name"
          type="select"
          name="bank"
          value={formData.bankAccount.bank}
          onChange={handleChange}
          required
          options={[
            { value: '', label: 'Select Bank' },
            ...BANKS.map(bank => ({ value: bank, label: bank }))
          ]}
        />
        
        <FormField
          id="accountNumber"
          label="Account Number"
          type="text"
          name="accountNumber"
          value={formData.bankAccount.accountNumber}
          onChange={handleChange}
          required
          placeholder="Enter account number"
        />
        
        <FormField
          id="accountName"
          label="Account Holder Name"
          type="text"
          name="accountName"
          value={formData.bankAccount.accountName}
          onChange={handleChange}
          required
          placeholder="Enter account holder name"
          helperText="Name as it appears on the bank account"
        />
        
        <FormField
          id="branch"
          label="Branch"
          type="text"
          name="branch"
          value={formData.bankAccount.branch}
          onChange={handleChange}
          placeholder="Enter bank branch (optional)"
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md mt-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <Typography variant="body2" className="text-sm text-blue-800">
              Please ensure that the account information is accurate. Incorrect bank details may result in delayed payments.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

BankInfoForm.propTypes = {
  data: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default BankInfoForm;
