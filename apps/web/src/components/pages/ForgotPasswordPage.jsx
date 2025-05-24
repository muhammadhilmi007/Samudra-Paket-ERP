"use client";

/**
 * ForgotPasswordPage Component
 * Page for requesting password reset via email
 */

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import AuthLayout from '../templates/AuthLayout';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import Typography from '../atoms/Typography';
import { useForgotPasswordMutation } from '../../store/api/authApi';

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  
  // RTK Query forgot password mutation
  const [forgotPassword, { isLoading, isError, error }] = useForgotPasswordMutation();
  
  const methods = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const { handleSubmit, formState: { errors } } = methods;
  
  const onSubmit = async (data) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset request failed:', error);
    }
  };
  
  // Show success message after submission
  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Check your email" 
        subtitle="We've sent you a password reset link"
      >
        <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <Typography variant="h1" className="mt-3 text-xl font-medium text-gray-900">
              Check your email
            </Typography>
            <Typography variant="p" className="mt-2 text-sm text-gray-600">
              We've sent a password reset link to <span className="font-medium">{submittedEmail}</span>
            </Typography>
          </div>
          
          <div className="mt-5">
            <Typography variant="p" className="text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or
            </Typography>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none"
            >
              try another email address
            </button>
          </div>
          
          <div className="mt-6">
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }
  
  return (
    <AuthLayout 
      title="Forgot your password?" 
      subtitle="No worries, we'll send you reset instructions"
    >
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <Typography variant="h1" className="text-2xl font-bold text-gray-900">
            Forgot your password?
          </Typography>
          <Typography variant="p" className="mt-2 text-sm text-gray-600">
            No worries, we'll send you reset instructions
          </Typography>
        </div>
        
        {/* Display error */}
        {isError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <Typography variant="p" className="text-sm text-red-600">
              {error?.data?.message || 'Failed to send reset instructions. Please try again.'}
            </Typography>
          </div>
        )}
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              label="Email address"
              type="email"
              required
              placeholder="Enter your email address"
            />
            
            <div>
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send reset instructions'}
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

export default ForgotPasswordPage;
