/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child component tree and displays fallback UI
 */

'use client';

import React, { Component } from 'react';
import Button from '../atoms/Button';
import Typography from '../atoms/Typography';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Here you could also send the error to your error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset() {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <svg
                className="mx-auto h-16 w-16 text-red-500"
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
              <Typography variant="h4" className="mt-4 text-red-600">
                Something went wrong
              </Typography>
              <Typography variant="body1" className="mt-2 text-gray-600">
                We're sorry, but an error occurred while rendering this page.
              </Typography>
              
              {process.env.NODE_ENV !== 'production' && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md text-left overflow-auto">
                  <Typography variant="subtitle2" className="text-gray-800">
                    {this.state.error && this.state.error.toString()}
                  </Typography>
                  <Typography variant="body2" className="mt-2 text-gray-600 whitespace-pre-wrap">
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </Typography>
                </div>
              )}
              
              <div className="mt-6 flex justify-center gap-4">
                <Button onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                >
                  Go to Home Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
