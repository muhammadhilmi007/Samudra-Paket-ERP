/**
 * Custom hook for using performance monitoring in components
 */

'use client';

import { useEffect, useRef } from 'react';
import { performanceMonitoring } from '../utils/performanceMonitoring';

/**
 * Hook for measuring component performance
 * @param {string} componentName - Name of the component
 * @param {Object} options - Additional options
 * @returns {Object} - Performance measurement utilities
 */
export const usePerformance = (componentName, options = {}) => {
  const { trackRender = true, trackMemory = false } = options;
  const renderCount = useRef(0);
  
  // Measure render time
  useEffect(() => {
    if (trackRender) {
      const endMeasure = performanceMonitoring.measureRenderTime(
        `${componentName}-render-${renderCount.current}`
      );
      renderCount.current += 1;
      
      return () => {
        endMeasure();
      };
    }
  }, [componentName, trackRender]);
  
  // Track memory usage if enabled
  useEffect(() => {
    if (trackMemory && window.performance && window.performance.memory) {
      const memoryUsage = window.performance.memory;
      performanceMonitoring.reportMetric('memory-usage', memoryUsage.usedJSHeapSize, {
        component: componentName,
        totalHeap: memoryUsage.totalJSHeapSize,
        heapLimit: memoryUsage.jsHeapSizeLimit,
      });
    }
  }, [componentName, trackMemory]);
  
  /**
   * Measure execution time of a function
   * @param {string} functionName - Name of the function
   * @param {Function} fn - Function to measure
   * @param {Array} args - Arguments to pass to the function
   * @returns {any} - Result of the function
   */
  const measureFunction = (functionName, fn, ...args) => {
    return performanceMonitoring.measureExecutionTime(
      `${componentName}-${functionName}`,
      fn,
      ...args
    );
  };
  
  /**
   * Measure API call time
   * @param {string} endpoint - API endpoint
   * @returns {Object} - Object with start and end methods
   */
  const measureApiCall = (endpoint) => {
    return performanceMonitoring.measureApiTime(`${componentName}-${endpoint}`);
  };
  
  /**
   * Report a custom metric
   * @param {string} metricName - Name of the metric
   * @param {number} value - Value of the metric
   * @param {Object} tags - Additional tags
   */
  const reportMetric = (metricName, value, tags = {}) => {
    performanceMonitoring.reportMetric(`${componentName}-${metricName}`, value, {
      component: componentName,
      ...tags,
    });
  };
  
  return {
    measureFunction,
    measureApiCall,
    reportMetric,
    renderCount: renderCount.current,
  };
};

export default usePerformance;
