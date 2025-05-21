"use client";

/**
 * Analytics Provider Component
 * Initializes analytics service and provides context for analytics tracking
 */

import React, { createContext, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analyticsService } from '../../utils/analyticsService';

// Create context for analytics
export const AnalyticsContext = createContext(null);

/**
 * Analytics Provider Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
const AnalyticsProvider = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize analytics service
  useEffect(() => {
    if (!isInitialized) {
      analyticsService.initAnalytics({
        googleAnalytics: {
          enabled: process.env.NEXT_PUBLIC_GA_ENABLED === 'true',
          measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        },
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Track page views when pathname or search params change
  useEffect(() => {
    if (isInitialized && pathname) {
      const url = searchParams.size > 0 
        ? `${pathname}?${searchParams.toString()}` 
        : pathname;
        
      analyticsService.trackPageView(url, {
        page_title: document.title,
        page_path: pathname,
        search_params: searchParams.toString(),
      });
    }
  }, [isInitialized, pathname, searchParams]);

  // Provide analytics service to children
  return (
    <AnalyticsContext.Provider value={analyticsService}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
