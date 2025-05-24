"use client";

/**
 * TwoFactorAuthPage Component
 * Page for verifying two-factor authentication during login
 */

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import AuthLayout from '../templates/AuthLayout';
import TwoFactorAuthForm from '../molecules/TwoFactorAuthForm';
import { selectIsAuthenticated } from '../../store/slices/authSlice';

const TwoFactorAuthPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Get redirect URL from query parameters
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);
  
  // Handle successful verification
  const handleSuccess = () => {
    router.push(redirectTo);
  };
  
  // Handle cancellation
  const handleCancel = () => {
    router.push('/auth/login');
  };
  
  return (
    <AuthLayout 
      title="Two-Factor Authentication" 
      subtitle="Verify your identity to continue"
    >
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-md">
        <TwoFactorAuthForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          redirectTo={redirectTo}
        />
      </div>
    </AuthLayout>
  );
};

export default TwoFactorAuthPage;
