"use client";

/**
 * AuthProvider Component
 * Manages authentication state and token refresh throughout the application
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useRefreshTokenMutation } from '../../store/api/authApi';
import { 
  selectAuthToken, 
  loginSuccess, 
  logout 
} from '../../store/slices/authSlice';
import { 
  getAuthToken, 
  getRefreshToken, 
  parseJwt,
  isTokenExpired, 
  needsRefresh,
  refreshAuthToken,
  clearAuthData
} from '../../utils/authUtils';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const [refreshToken] = useRefreshTokenMutation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize authentication state from storage
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getAuthToken();
      const storedRefreshToken = getRefreshToken();
      
      if (storedToken && !isTokenExpired(storedToken)) {
        // If we have a valid token, restore the auth state
        const user = parseJwt(storedToken)?.user;
        if (user) {
          dispatch(loginSuccess({
            token: storedToken,
            refreshToken: storedRefreshToken,
            user
          }));
        }
      } else if (storedRefreshToken) {
        // If token is expired but we have a refresh token, try to refresh
        refreshAuthToken(refreshToken)
          .catch(() => {
            // If refresh fails, log out
            dispatch(logout());
          });
      }
      
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch, refreshToken]);

  // Set up token refresh interval
  useEffect(() => {
    if (!token) return;

    // Check token every minute
    const intervalId = setInterval(async () => {
      if (needsRefresh(token)) {
        try {
          const success = await refreshAuthToken(refreshToken);
          if (!success) {
            dispatch(logout());
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          dispatch(logout());
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [token, refreshToken, dispatch]);

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
