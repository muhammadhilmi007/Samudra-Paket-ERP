/**
 * LoadingSpinner Component
 * Displays a loading spinner for async operations
 */

import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-block ${spinnerSize} animate-spin rounded-full border-solid border-primary-500 border-t-transparent ${className}`} role="status" aria-label="loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
