"use client";

/**
 * TwoFactorAuthForm Component
 * Form for two-factor authentication verification
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import { useVerifyTwoFactorMutation } from '../../store/api/authApi';
import { createNotificationHandler } from '../../utils/notificationUtils';

const TwoFactorAuthForm = ({ onSuccess, onCancel, redirectTo = '/dashboard' }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = Array(6).fill(0).map(() => React.createRef());
  
  // RTK Query hook
  const [verifyTwoFactor, { isLoading }] = useVerifyTwoFactorMutation();
  
  // Handle input change
  const handleChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;
    
    // Update code array
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };
  
  // Handle key down
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  
  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted data is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      
      // Focus last input
      inputRefs[5].current.focus();
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    
    // Validate code
    if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
      notifications.error('Please enter a valid 6-digit code');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await verifyTwoFactor(verificationCode).unwrap();
      
      notifications.success('Two-factor authentication verified successfully');
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (error) {
      console.error('Failed to verify two-factor authentication:', error);
      notifications.error(error?.data?.message || 'Invalid verification code');
      
      // Clear code on error
      setCode(['', '', '', '', '', '']);
      inputRefs[0].current.focus();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <Typography variant="h2" className="text-xl font-semibold">
          Two-Factor Authentication
        </Typography>
        <Typography variant="body1" className="mt-2 text-gray-600">
          Enter the 6-digit code from your authenticator app
        </Typography>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center space-x-2 mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          ))}
        </div>
        
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={code.join('').length !== 6 || isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <Typography variant="body2" className="text-gray-600">
          Didn't receive the code? Check your authenticator app
        </Typography>
      </div>
    </div>
  );
};

export default TwoFactorAuthForm;
