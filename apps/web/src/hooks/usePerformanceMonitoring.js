/**
 * usePerformanceMonitoring Hook
 * React hook for using performance monitoring functionality
 */

import { useEffect, useCallback, useRef } from 'react';
import { performanceMonitoring } from '../utils/performanceMonitoring';

/**
 * Hook for monitoring component performance
 * @param {string} componentName - Name of the component
 * @returns {Object} Performance monitoring methods
 */
export const usePerformanceMonitoring = (componentName) => {
  const renderCount = useRef(0);
  const mountTime = useRef(null);

  // Initialize performance monitoring on mount
  useEffect(() => {
    // Only initialize once
    if (typeof window !== 'undefined' && !window.__performanceInitialized) {
      performanceMonitoring.initPerformanceMonitoring();
      window.__performanceInitialized = true;
    }

    // Track component mount time
    mountTime.current = performance.now();
    const endMeasure = performanceMonitoring.measureRenderTime(`${componentName}:mount`);

    // Report mount time when component is fully rendered
    setTimeout(() => {
      endMeasure();
    }, 0);

    // Track component unmount
    return () => {
      if (mountTime.current) {
        const unmountTime = performance.now();
        const lifetimeDuration = unmountTime - mountTime.current;
        
        performanceMonitoring.reportMetric('component-lifetime', lifetimeDuration, {
          component: componentName,
          renderCount: renderCount.current,
        });
      }
    };
  }, [componentName]);

  // Track component renders
  useEffect(() => {
    renderCount.current += 1;
    
    if (renderCount.current > 1) {
      const endMeasure = performanceMonitoring.measureRenderTime(`${componentName}:rerender`);
      
      // Report render time when component is fully rendered
      setTimeout(() => {
        endMeasure();
        
        performanceMonitoring.reportMetric('component-render-count', renderCount.current, {
          component: componentName,
        });
      }, 0);
    }
  });

  /**
   * Measure API call time
   * @param {string} endpoint - API endpoint
   * @returns {Object} Object with start and end methods
   */
  const measureApiCall = useCallback((endpoint) => {
    return performanceMonitoring.measureApiTime(`${componentName}:${endpoint}`);
  }, [componentName]);

  /**
   * Measure function execution time
   * @param {string} functionName - Name of the function
   * @param {Function} fn - Function to measure
   * @param {...any} args - Arguments to pass to the function
   * @returns {any} Result of the function
   */
  const measureFunction = useCallback((functionName, fn, ...args) => {
    return performanceMonitoring.measureExecutionTime(`${componentName}:${functionName}`, fn, ...args);
  }, [componentName]);

  /**
   * Report a custom metric
   * @param {string} metricName - Name of the metric
   * @param {number} value - Metric value
   * @param {Object} [tags] - Additional tags
   */
  const reportMetric = useCallback((metricName, value, tags = {}) => {
    performanceMonitoring.reportMetric(metricName, value, {
      component: componentName,
      ...tags,
    });
  }, [componentName]);

  return {
    measureApiCall,
    measureFunction,
    reportMetric,
    renderCount: renderCount.current,
  };
};
