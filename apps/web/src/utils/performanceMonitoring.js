/**
 * Performance Monitoring Utility
 * Tracks and reports key performance metrics for the Samudra Paket ERP application
 */

// Core Web Vitals metrics
const CORE_WEB_VITALS = {
  LCP: 'largest-contentful-paint', // Largest Contentful Paint
  FID: 'first-input-delay',        // First Input Delay
  CLS: 'cumulative-layout-shift',  // Cumulative Layout Shift
  FCP: 'first-contentful-paint',   // First Contentful Paint
  TTI: 'time-to-interactive',      // Time to Interactive
  TBT: 'total-blocking-time',      // Total Blocking Time
};

// Custom performance metrics
const CUSTOM_METRICS = {
  API_RESPONSE_TIME: 'api-response-time',
  RENDER_TIME: 'component-render-time',
  RESOURCE_LOAD_TIME: 'resource-load-time',
  JS_EXECUTION_TIME: 'js-execution-time',
  MEMORY_USAGE: 'memory-usage',
};

/**
 * Initialize performance monitoring
 * @returns {void}
 */
const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Register performance observers
  registerWebVitalsObserver();
  registerResourceObserver();
  registerLongTaskObserver();

  // Report initial metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      reportInitialMetrics();
    }, 1000);
  });
};

/**
 * Register observer for Core Web Vitals
 * @returns {void}
 */
const registerWebVitalsObserver = () => {
  if (!window.PerformanceObserver) return;

  try {
    // LCP observer
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      reportMetric(CORE_WEB_VITALS.LCP, lastEntry.startTime);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // FID observer
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        reportMetric(CORE_WEB_VITALS.FID, entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // CLS observer
    let clsValue = 0;
    let clsEntries = [];
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        // Only count layout shifts without recent user input
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
          reportMetric(CORE_WEB_VITALS.CLS, clsValue);
        }
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // FCP observer
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        reportMetric(CORE_WEB_VITALS.FCP, entry.startTime);
      });
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.error('Error setting up performance observers:', error);
  }
};

/**
 * Register observer for resource loading
 * @returns {void}
 */
const registerResourceObserver = () => {
  if (!window.PerformanceObserver) return;

  try {
    const resourceObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        // Skip monitoring resources
        if (entry.name.includes('analytics') || entry.name.includes('monitoring')) {
          return;
        }

        const duration = entry.duration;
        const size = entry.transferSize || 0;
        const initiatorType = entry.initiatorType;

        reportResourceMetric(initiatorType, entry.name, duration, size);
      });
    });
    resourceObserver.observe({ type: 'resource', buffered: true });
  } catch (error) {
    console.error('Error setting up resource observer:', error);
  }
};

/**
 * Register observer for long tasks
 * @returns {void}
 */
const registerLongTaskObserver = () => {
  if (!window.PerformanceObserver) return;

  try {
    const longTaskObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        // Report long tasks (tasks that block the main thread for more than 50ms)
        reportMetric('long-task', entry.duration);
      });
    });
    longTaskObserver.observe({ type: 'longtask', buffered: true });
  } catch (error) {
    // Long task observation not supported in this browser
  }
};

/**
 * Report initial performance metrics
 * @returns {void}
 */
const reportInitialMetrics = () => {
  if (!window.performance || !window.performance.timing) return;

  const timing = window.performance.timing;
  
  // Calculate key timing metrics
  const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;
  const tcpTime = timing.connectEnd - timing.connectStart;
  const ttfb = timing.responseStart - timing.requestStart;
  const domLoadTime = timing.domComplete - timing.domLoading;
  const loadTime = timing.loadEventEnd - timing.navigationStart;
  
  // Report metrics
  reportMetric('dns-time', dnsTime);
  reportMetric('tcp-time', tcpTime);
  reportMetric('ttfb', ttfb);
  reportMetric('dom-load-time', domLoadTime);
  reportMetric('page-load-time', loadTime);
  
  // Report memory usage if available
  if (window.performance.memory) {
    reportMetric(CUSTOM_METRICS.MEMORY_USAGE, window.performance.memory.usedJSHeapSize);
  }
};

/**
 * Report a performance metric
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @param {Object} [tags] - Additional tags
 * @returns {void}
 */
const reportMetric = (name, value, tags = {}) => {
  // Add to local storage for debugging
  const metrics = JSON.parse(localStorage.getItem('performance_metrics') || '{}');
  metrics[name] = value;
  localStorage.setItem('performance_metrics', JSON.stringify(metrics));
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Performance Metric - ${name}: ${value}`, tags);
  }
  
  // Send to analytics service if available
  if (window.analyticsService) {
    window.analyticsService.trackPerformance(name, value, tags);
  }
};

/**
 * Report a resource loading metric
 * @param {string} type - Resource type
 * @param {string} url - Resource URL
 * @param {number} duration - Loading duration
 * @param {number} size - Resource size
 * @returns {void}
 */
const reportResourceMetric = (type, url, duration, size) => {
  reportMetric(CUSTOM_METRICS.RESOURCE_LOAD_TIME, duration, {
    type,
    url: url.split('?')[0], // Remove query params
    size,
  });
};

/**
 * Measure component render time
 * @param {string} componentName - Name of the component
 * @returns {Function} Function to call when render is complete
 */
const measureRenderTime = (componentName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    reportMetric(CUSTOM_METRICS.RENDER_TIME, duration, {
      component: componentName,
    });
    
    return duration;
  };
};

/**
 * Measure API response time
 * @param {string} endpoint - API endpoint
 * @returns {Object} Object with start and end methods
 */
const measureApiTime = (endpoint) => {
  let startTime;
  
  return {
    start: () => {
      startTime = performance.now();
    },
    end: (success = true, statusCode = 200) => {
      if (!startTime) return 0;
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      reportMetric(CUSTOM_METRICS.API_RESPONSE_TIME, duration, {
        endpoint,
        success,
        statusCode,
      });
      
      return duration;
    },
  };
};

/**
 * Measure JavaScript execution time
 * @param {string} functionName - Name of the function
 * @param {Function} fn - Function to measure
 * @param {Array} args - Arguments to pass to the function
 * @returns {any} Result of the function
 */
const measureExecutionTime = (functionName, fn, ...args) => {
  const startTime = performance.now();
  
  try {
    const result = fn(...args);
    
    // Handle promises
    if (result instanceof Promise) {
      return result.then((value) => {
        const endTime = performance.now();
        reportMetric(CUSTOM_METRICS.JS_EXECUTION_TIME, endTime - startTime, {
          function: functionName,
          async: true,
        });
        return value;
      }).catch((error) => {
        const endTime = performance.now();
        reportMetric(CUSTOM_METRICS.JS_EXECUTION_TIME, endTime - startTime, {
          function: functionName,
          async: true,
          error: true,
        });
        throw error;
      });
    }
    
    // Synchronous function
    const endTime = performance.now();
    reportMetric(CUSTOM_METRICS.JS_EXECUTION_TIME, endTime - startTime, {
      function: functionName,
      async: false,
    });
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    reportMetric(CUSTOM_METRICS.JS_EXECUTION_TIME, endTime - startTime, {
      function: functionName,
      async: false,
      error: true,
    });
    throw error;
  }
};

/**
 * Get all collected performance metrics
 * @returns {Object} Collected metrics
 */
const getCollectedMetrics = () => {
  return JSON.parse(localStorage.getItem('performance_metrics') || '{}');
};

/**
 * Clear collected performance metrics
 * @returns {void}
 */
const clearCollectedMetrics = () => {
  localStorage.removeItem('performance_metrics');
};

export const performanceMonitoring = {
  initPerformanceMonitoring,
  measureRenderTime,
  measureApiTime,
  measureExecutionTime,
  reportMetric,
  getCollectedMetrics,
  clearCollectedMetrics,
  CORE_WEB_VITALS,
  CUSTOM_METRICS,
};
