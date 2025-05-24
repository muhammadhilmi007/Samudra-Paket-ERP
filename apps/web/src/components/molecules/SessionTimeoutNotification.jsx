"use client";

/**
 * SessionTimeoutNotification Component
 * Displays a notification when the user's session is about to expire
 * and provides options to extend the session or logout
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import { useLogoutMutation, useRefreshTokenMutation } from '../../store/api/authApi';
import { selectIsAuthenticated, selectAuthToken } from '../../store/slices/authSlice';

// Session timeout configuration
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // Show warning 5 minutes before timeout

const SessionTimeoutNotification = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectAuthToken);
  
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [warningTimer, setWarningTimer] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);
  
  // RTK Query hooks
  const [logout] = useLogoutMutation();
  const [refreshToken] = useRefreshTokenMutation();
  
  // Format remaining time as mm:ss
  const formatTimeRemaining = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Reset the session timers
  const resetTimers = useCallback(() => {
    if (warningTimer) clearTimeout(warningTimer);
    if (logoutTimer) clearTimeout(logoutTimer);
    
    // Set new timers if authenticated
    if (isAuthenticated && token) {
      // Set timer to show warning before timeout
      const newWarningTimer = setTimeout(() => {
        setShowWarning(true);
        setTimeRemaining(WARNING_BEFORE_TIMEOUT);
        
        // Start countdown
        const countdownInterval = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1000) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1000;
          });
        }, 1000);
      }, SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT);
      
      // Set timer for automatic logout
      const newLogoutTimer = setTimeout(() => {
        handleLogout();
      }, SESSION_TIMEOUT);
      
      setWarningTimer(newWarningTimer);
      setLogoutTimer(newLogoutTimer);
    }
  }, [isAuthenticated, token]);
  
  // Initialize timers when component mounts or auth state changes
  useEffect(() => {
    resetTimers();
    
    // Cleanup timers on unmount
    return () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [isAuthenticated, token, resetTimers]);
  
  // Reset timers on user activity
  useEffect(() => {
    const handleUserActivity = () => {
      if (isAuthenticated && !showWarning) {
        resetTimers();
      }
    };
    
    // Add event listeners for user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [isAuthenticated, showWarning, resetTimers]);
  
  // Handle session extension
  const handleExtendSession = async () => {
    try {
      await refreshToken().unwrap();
      setShowWarning(false);
      resetTimers();
    } catch (error) {
      console.error('Failed to extend session:', error);
      handleLogout();
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      setShowWarning(false);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force client-side logout even if API call fails
      router.push('/auth/login');
    }
  };
  
  if (!showWarning || !isAuthenticated) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <Typography variant="h2" className="text-xl font-semibold text-gray-900">
            Session Timeout Warning
          </Typography>
          <Typography variant="body1" className="mt-2 text-gray-600">
            Your session will expire in {formatTimeRemaining(timeRemaining)} due to inactivity.
          </Typography>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleExtendSession}
          >
            Stay Logged In
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleLogout}
          >
            Logout Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutNotification;
