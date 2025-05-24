"use client";

/**
 * ResetPasswordPage Component
 * Page for resetting password with a valid token
 * Includes password strength indicator
 */

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../templates/AuthLayout';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import Typography from '../atoms/Typography';
import { useResetPasswordMutation } from '../../store/api/authApi';

// Password strength regex patterns
const containsLowercase = /[a-z]/;
const containsUppercase = /[A-Z]/;
const containsNumber = /[0-9]/;
const containsSpecialChar = /[^A-Za-z0-9]/;

// Password strength validation schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine(val => containsLowercase.test(val), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine(val => containsUppercase.test(val), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine(val => containsNumber.test(val), {
        message: 'Password must contain at least one number',
      })
      .refine(val => containsSpecialChar.test(val), {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Calculate password strength score (0-4)
const calculatePasswordStrength = (password) => {
  if (!password) return 0;
  
  let score = 0;
  if (password.length >= 8) score++;
  if (containsLowercase.test(password)) score++;
  if (containsUppercase.test(password)) score++;
  if (containsNumber.test(password)) score++;
  if (containsSpecialChar.test(password)) score++;
  
  return Math.min(score, 4);
};

// Get strength label and color based on score
const getStrengthInfo = (score) => {
  switch (score) {
    case 0:
      return { label: 'Very Weak', color: 'bg-red-500' };
    case 1:
      return { label: 'Weak', color: 'bg-red-400' };
    case 2:
      return { label: 'Fair', color: 'bg-yellow-500' };
    case 3:
      return { label: 'Good', color: 'bg-green-400' };
    case 4:
      return { label: 'Strong', color: 'bg-green-600' };
    default:
      return { label: 'Very Weak', color: 'bg-red-500' };
  }
};

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // RTK Query reset password mutation
  const [resetPassword, { isLoading, isError, error }] = useResetPasswordMutation();
  
  // Get token from URL
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      // Redirect to forgot password if no token
      router.push('/auth/forgot-password');
    }
  }, [searchParams, router]);
  
  const methods = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });
  
  const { handleSubmit, watch, formState: { errors } } = methods;
  const password = watch('password');
  
  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);
  
  const strengthInfo = getStrengthInfo(passwordStrength);
  
  const onSubmit = async (data) => {
    if (!token) return;
    
    try {
      await resetPassword({
        token,
        password: data.password,
      }).unwrap();
      setIsSuccess(true);
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };
  
  // Show success message after submission
  if (isSuccess) {
    return (
      <AuthLayout 
        title="Password reset successful" 
        subtitle="Your password has been reset successfully"
      >
        <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <Typography variant="h1" className="mt-3 text-xl font-medium text-gray-900">
              Password reset successful
            </Typography>
            <Typography variant="p" className="mt-2 text-sm text-gray-600">
              Your password has been reset successfully. You can now log in with your new password.
            </Typography>
          </div>
          
          <div className="mt-6">
            <Link href="/auth/login">
              <Button variant="primary" className="w-full">
                Go to login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }
  
  return (
    <AuthLayout 
      title="Reset your password" 
      subtitle="Create a new secure password"
    >
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <Typography variant="h1" className="text-2xl font-bold text-gray-900">
            Reset your password
          </Typography>
          <Typography variant="p" className="mt-2 text-sm text-gray-600">
            Create a new secure password for your account
          </Typography>
        </div>
        
        {/* Display error */}
        {isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <Typography variant="p" className="text-sm text-red-600">
              {error?.data?.message || 'Invalid or expired token. Please request a new password reset.'}
            </Typography>
          </div>
        )}
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="password"
              label="New password"
              type="password"
              required
              placeholder="Enter your new password"
            />
            
            {/* Password strength indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Typography variant="body2" className="text-xs text-gray-500">
                    Password strength:
                  </Typography>
                  <Typography variant="body2" className="text-xs font-medium">
                    {strengthInfo.label}
                  </Typography>
                </div>
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strengthInfo.color} transition-all duration-300`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li className={`flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className={`h-3 w-3 mr-2 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      {password.length >= 8 ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      )}
                    </svg>
                    At least 8 characters
                  </li>
                  <li className={`flex items-center ${containsLowercase.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className={`h-3 w-3 mr-2 ${containsLowercase.test(password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      {containsLowercase.test(password) ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      )}
                    </svg>
                    At least one lowercase letter
                  </li>
                  <li className={`flex items-center ${containsUppercase.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className={`h-3 w-3 mr-2 ${containsUppercase.test(password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      {containsUppercase.test(password) ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      )}
                    </svg>
                    At least one uppercase letter
                  </li>
                  <li className={`flex items-center ${containsNumber.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className={`h-3 w-3 mr-2 ${containsNumber.test(password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      {containsNumber.test(password) ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      )}
                    </svg>
                    At least one number
                  </li>
                  <li className={`flex items-center ${containsSpecialChar.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <svg className={`h-3 w-3 mr-2 ${containsSpecialChar.test(password) ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      {containsSpecialChar.test(password) ? (
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      )}
                    </svg>
                    At least one special character
                  </li>
                </ul>
              </div>
            )}
            
            <FormField
              name="confirmPassword"
              label="Confirm password"
              type="password"
              required
              placeholder="Confirm your new password"
            />
            
            <div>
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full" 
                disabled={isLoading || passwordStrength < 3}
              >
                {isLoading ? 'Resetting password...' : 'Reset password'}
              </Button>
            </div>
            
            <div className="text-center">
              <Link href="/auth/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                Back to login
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
