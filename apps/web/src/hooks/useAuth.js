"use client";

/**
 * useAuth Hook
 * Custom hook for handling authentication state and operations
 */

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { authActions } from '../store/index';
import { 
  useLoginMutation, 
  useLogoutMutation, 
  useRefreshTokenMutation,
  useGetProfileQuery
} from '../store/api/authApi';

/**
 * Custom hook for handling authentication state and operations
 * Provides authentication status, user data, and authentication methods
 * 
 * @returns {Object} Authentication state and methods
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Auth selectors - using direct state access
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const token = useSelector(state => state.auth.token);
  const isLoading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  
  // Auth mutations
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const [refreshToken, { isLoading: isRefreshLoading }] = useRefreshTokenMutation();
  
  // Get user profile if authenticated
  const { refetch: refetchProfile } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  
  /**
   * Login handler
   * @param {Object} credentials - User credentials (email, password)
   * @param {Object} options - Additional options
   * @param {string} options.redirectTo - Path to redirect after successful login
   */
  const handleLogin = useCallback(
    async (credentials, { redirectTo = '/dashboard' } = {}) => {
      try {
        await login(credentials).unwrap();
        
        if (redirectTo) {
          router.push(redirectTo);
        }
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    [login, router]
  );
  
  /**
   * Logout handler
   * @param {Object} options - Additional options
   * @param {string} options.redirectTo - Path to redirect after logout
   */
  const handleLogout = useCallback(
    async ({ redirectTo = '/auth/login' } = {}) => {
      try {
        await logout().unwrap();
        
        if (redirectTo) {
          router.push(redirectTo);
        }
      } catch (error) {
        console.error('Logout failed:', error);
        // Even if API logout fails, redirect to login
        if (redirectTo) {
          router.push(redirectTo);
        }
      }
    },
    [logout, router]
  );
  
  /**
   * Refresh token handler
   */
  const handleRefreshToken = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      await refreshToken().unwrap();
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, redirect to login
      router.push('/auth/login');
    }
  }, [refreshToken, isAuthenticated, router]);
  
  /**
   * Check if user has required role
   * @param {string|string[]} requiredRoles - Required role(s)
   * @returns {boolean} Whether user has required role
   */
  const hasRole = useCallback(
    (requiredRoles) => {
      if (!user || !user.roles) return false;
      
      const userRoles = user.roles;
      
      if (Array.isArray(requiredRoles)) {
        return requiredRoles.some(role => userRoles.includes(role));
      }
      
      return userRoles.includes(requiredRoles);
    },
    [user]
  );
  
  return {
    user,
    isAuthenticated,
    token,
    isLoading: isLoading || isLoginLoading || isLogoutLoading || isRefreshLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    refreshToken: handleRefreshToken,
    refetchProfile,
    hasRole,
  };
};

export default useAuth;
