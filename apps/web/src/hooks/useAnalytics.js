/**
 * useAnalytics Hook
 * Custom React hook for tracking analytics events in the application
 */

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsService } from '../utils/analyticsService';

/**
 * Hook for tracking analytics events
 * @param {Object} options - Configuration options
 * @returns {Object} Analytics tracking methods
 */
export const useAnalytics = (options = {}) => {
  const pathname = usePathname();
  const initialized = useRef(false);
  const componentName = options.componentName || 'UnnamedComponent';

  // Initialize analytics service
  useEffect(() => {
    if (!initialized.current) {
      analyticsService.initAnalytics({
        googleAnalytics: {
          enabled: process.env.NEXT_PUBLIC_GA_ENABLED === 'true',
          measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        },
      });
      initialized.current = true;
    }
  }, []);

  // Track page views when pathname changes
  useEffect(() => {
    if (pathname) {
      analyticsService.trackPageView(pathname, { component: componentName });
    }
  }, [pathname, componentName]);

  // Track user actions
  const trackAction = useCallback((action, label, data = {}) => {
    analyticsService.trackUserAction(action, label, {
      component: componentName,
      ...data,
    });
  }, [componentName]);

  // Track form interactions
  const trackForm = useCallback((action, formName, data = {}) => {
    analyticsService.trackFormInteraction(action, formName, {
      component: componentName,
      ...data,
    });
  }, [componentName]);

  // Track navigation events
  const trackNavigation = useCallback((action, destination, data = {}) => {
    analyticsService.trackNavigation(action, destination, {
      component: componentName,
      ...data,
    });
  }, [componentName]);

  // Track errors
  const trackError = useCallback((action, message, data = {}) => {
    analyticsService.trackError(action, message, {
      component: componentName,
      ...data,
    });
  }, [componentName]);

  // Track performance metrics
  const trackPerformance = useCallback((metricName, value, data = {}) => {
    analyticsService.trackPerformance(metricName, value, {
      component: componentName,
      ...data,
    });
  }, [componentName]);

  // Track feature usage
  const trackFeature = useCallback((action, featureName, data = {}) => {
    analyticsService.trackFeatureUsage(action, featureName, {
      component: componentName,
      ...data,
    });
  }, [componentName]);

  // Track business processes
  const trackBusinessProcess = useCallback((action, processName, data = {}) => {
    analyticsService.trackBusinessProcess(action, processName, {
      component: componentName,
      ...data,
    });
  }, [componentName]);

  // Identify user
  const identifyUser = useCallback((userId, traits = {}) => {
    analyticsService.identifyUser(userId, traits);
  }, []);

  // Create event tracking functions with predefined actions
  const trackClick = useCallback((label, data = {}) => {
    trackAction(analyticsService.EVENT_ACTIONS.CLICK, label, data);
  }, [trackAction]);

  const trackSearch = useCallback((query, data = {}) => {
    trackAction(analyticsService.EVENT_ACTIONS.SEARCH, query, data);
  }, [trackAction]);

  const trackFilter = useCallback((filter, data = {}) => {
    trackAction(analyticsService.EVENT_ACTIONS.FILTER, filter, data);
  }, [trackAction]);

  const trackSort = useCallback((sortBy, data = {}) => {
    trackAction(analyticsService.EVENT_ACTIONS.SORT, sortBy, data);
  }, [trackAction]);

  const trackFormSubmit = useCallback((formName, data = {}) => {
    trackForm(analyticsService.EVENT_ACTIONS.SUBMIT, formName, data);
  }, [trackForm]);

  const trackFormChange = useCallback((formName, fieldName, data = {}) => {
    trackForm(analyticsService.EVENT_ACTIONS.CHANGE, formName, {
      field: fieldName,
      ...data,
    });
  }, [trackForm]);

  const trackModalOpen = useCallback((modalName, data = {}) => {
    trackNavigation(analyticsService.EVENT_ACTIONS.OPEN_MODAL, modalName, data);
  }, [trackNavigation]);

  const trackModalClose = useCallback((modalName, data = {}) => {
    trackNavigation(analyticsService.EVENT_ACTIONS.CLOSE_MODAL, modalName, data);
  }, [trackNavigation]);

  // Measure function execution time and report as performance metric
  const measureExecution = useCallback((fn, metricName) => {
    return (...args) => {
      const startTime = performance.now();
      const result = fn(...args);
      
      // Handle promises
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - startTime;
          trackPerformance(metricName, duration);
        });
      }
      
      // Handle synchronous functions
      const duration = performance.now() - startTime;
      trackPerformance(metricName, duration);
      return result;
    };
  }, [trackPerformance]);

  return {
    trackAction,
    trackForm,
    trackNavigation,
    trackError,
    trackPerformance,
    trackFeature,
    trackBusinessProcess,
    identifyUser,
    trackClick,
    trackSearch,
    trackFilter,
    trackSort,
    trackFormSubmit,
    trackFormChange,
    trackModalOpen,
    trackModalClose,
    measureExecution,
    // Export event categories and actions for convenience
    EVENT_CATEGORIES: analyticsService.EVENT_CATEGORIES,
    EVENT_ACTIONS: analyticsService.EVENT_ACTIONS,
  };
};

export default useAnalytics;
