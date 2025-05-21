/**
 * Performance Provider Component
 * Provides performance monitoring capabilities to the application
 */

'use client';

import React, { useEffect } from 'react';
import { performanceMonitoring } from '../utils/performanceMonitoring';

/**
 * Performance Provider component
 * Initializes performance monitoring for the application
 */
const PerformanceProvider = ({ children }) => {
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitoring.initPerformanceMonitoring();

    // Report navigation performance on route changes
    const handleRouteChange = (url) => {
      performanceMonitoring.reportMetric('navigation', performance.now(), {
        url,
        type: 'route-change',
      });
    };

    // Clean up on unmount
    return () => {
      // Nothing to clean up currently
    };
  }, []);

  return <>{children}</>;
};

export default PerformanceProvider;
