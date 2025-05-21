"use client";

/**
 * LogoutButton Component
 * Button for logging out of the application
 */

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useLogoutMutation } from '../../store/api/authApi';
import { logout } from '../../store/slices/authSlice';
import Button from '../atoms/Button';
import { createNotificationHandler } from '../../utils/notificationUtils';
import { memoWithName } from '../../utils/memoization';

const LogoutButton = ({ 
  variant = 'ghost', 
  size = 'sm', 
  className = '',
  showIcon = true,
  showText = true,
  redirectTo = '/login'
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutMutation, { isLoading }] = useLogoutMutation();
  const notifications = createNotificationHandler(dispatch);

  // Memoize the logout handler to prevent unnecessary re-creation on renders
  const handleLogout = useCallback(async () => {
    try {
      // Call the logout API
      await logoutMutation().unwrap();
      
      // Dispatch logout action to clear auth state
      dispatch(logout());
      
      // Show success notification
      notifications.success('You have been successfully logged out');
      
      // Redirect to login page
      router.push(redirectTo);
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Still dispatch logout to clear local state
      dispatch(logout());
      
      // Show error notification
      notifications.error('There was an issue logging out, but your session has been cleared');
      
      // Redirect to login page
      router.push(redirectTo);
    }
  }, [logoutMutation, dispatch, notifications, router, redirectTo]);

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {showIcon && (
        <ArrowRightOnRectangleIcon className={`h-5 w-5 ${showText ? 'mr-2' : ''}`} />
      )}
      {showText && (isLoading ? 'Logging out...' : 'Logout')}
    </Button>
  );
};

LogoutButton.propTypes = {
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  showIcon: PropTypes.bool,
  showText: PropTypes.bool,
  redirectTo: PropTypes.string,
};

// Memoize the component to prevent unnecessary re-renders
export default memoWithName(LogoutButton, (prevProps, nextProps) => {
  // Only re-render if any of these props change
  return (
    prevProps.variant === nextProps.variant &&
    prevProps.size === nextProps.size &&
    prevProps.className === nextProps.className &&
    prevProps.showIcon === nextProps.showIcon &&
    prevProps.showText === nextProps.showText &&
    prevProps.redirectTo === nextProps.redirectTo
  );
});
