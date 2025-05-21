"use client";

/**
 * Dynamic Import Utility
 * Provides utilities for dynamic imports with loading states
 */

import { lazy, Suspense } from 'react';

/**
 * Creates a dynamically imported component with a loading fallback
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} options - Options for the dynamic import
 * @param {React.Component} options.Loading - Loading component to show while the component is loading
 * @returns {React.Component} - Dynamically imported component with loading fallback
 */
export function dynamicImport(importFunc, { Loading = DefaultLoading } = {}) {
  const LazyComponent = lazy(importFunc);

  return (props) => (
    <Suspense fallback={<Loading />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Default loading component
 * @returns {JSX.Element} - Default loading component
 */
function DefaultLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  );
}
