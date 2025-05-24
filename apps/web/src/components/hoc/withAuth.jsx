/**
 * withAuth Higher-Order Component
 * Protects routes that require authentication
 * Updated to use Redux authentication system
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { createNotificationHandler } from '../../utils/notificationUtils';
import { 
  selectIsAuthenticated, 
  selectAuthLoading, 
  selectCurrentUser 
} from '../../store/slices/authSlice';
import { hasRole } from '../../utils/authUtils';

/**
 * Higher-order component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 * 
 * @param {React.ComponentType} Component - Component to wrap
 * @param {Object} options - Configuration options
 * @param {string|string[]} options.requiredRoles - Required role(s) for accessing the component
 * @param {string} options.redirectUrl - URL to redirect to if authentication fails
 * @returns {React.ComponentType} Protected component
 */
const withAuth = (
  Component,
  requiredRoles = null,
  redirectUrl = '/auth/login'
) => {
  const ProtectedRoute = (props) => {
    // Use Redux selectors instead of useAuth hook
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectAuthLoading);
    const user = useSelector(selectCurrentUser);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const notifications = createNotificationHandler(dispatch);

    useEffect(() => {
      // If not loading and not authenticated, redirect to login
      if (!isLoading && !isAuthenticated) {
        notifications.warning('Please log in to access this page');
        router.push(`${redirectUrl}?redirect=${encodeURIComponent(pathname)}`);
      }
      
      // If authenticated but doesn't have required role, redirect to dashboard
      if (
        !isLoading &&
        isAuthenticated &&
        requiredRoles &&
        user &&
        !hasRole(user, requiredRoles)
      ) {
        notifications.error('You do not have permission to access this page');
        router.push('/dashboard');
      }
    }, [isLoading, isAuthenticated, user, pathname, router]);

    // Show loading state while checking authentication
    if (isLoading || !isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      );
    }

    // If role check is required and user doesn't have the required role, show permission denied
    if (requiredRoles && !hasRole(user, requiredRoles)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <svg
            className="h-16 w-16 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Permission Denied</h1>
          <p className="text-gray-600 text-center mb-6">
            You do not have the required permissions to access this page.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    // Render the protected component
    return <Component {...props} />;
  };

  // Set display name for debugging
  const componentName = Component.displayName || Component.name || 'Component';
  ProtectedRoute.displayName = `withAuth(${componentName})`;

  return ProtectedRoute;
};

export { withAuth };
export default withAuth;
