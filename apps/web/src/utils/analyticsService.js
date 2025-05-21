/**
 * Analytics Service
 * Handles tracking user behavior and events in the Samudra Paket ERP application
 */

// Analytics event categories
const EVENT_CATEGORIES = {
  PAGE_VIEW: 'page_view',
  USER_ACTION: 'user_action',
  FORM_INTERACTION: 'form_interaction',
  NAVIGATION: 'navigation',
  ERROR: 'error',
  PERFORMANCE: 'performance',
  FEATURE_USAGE: 'feature_usage',
  BUSINESS_PROCESS: 'business_process',
};

// Analytics event actions
const EVENT_ACTIONS = {
  // Page views
  VIEW: 'view',
  
  // User actions
  CLICK: 'click',
  HOVER: 'hover',
  SCROLL: 'scroll',
  SEARCH: 'search',
  FILTER: 'filter',
  SORT: 'sort',
  DOWNLOAD: 'download',
  PRINT: 'print',
  
  // Form interactions
  SUBMIT: 'submit',
  VALIDATE: 'validate',
  CHANGE: 'change',
  FOCUS: 'focus',
  BLUR: 'blur',
  
  // Navigation
  NAVIGATE: 'navigate',
  OPEN_MODAL: 'open_modal',
  CLOSE_MODAL: 'close_modal',
  EXPAND: 'expand',
  COLLAPSE: 'collapse',
  
  // Errors
  CLIENT_ERROR: 'client_error',
  API_ERROR: 'api_error',
  VALIDATION_ERROR: 'validation_error',
  
  // Performance
  LOAD_TIME: 'load_time',
  RENDER_TIME: 'render_time',
  API_RESPONSE_TIME: 'api_response_time',
  
  // Feature usage
  ENABLE: 'enable',
  DISABLE: 'disable',
  TOGGLE: 'toggle',
  
  // Business processes
  CREATE_SHIPMENT: 'create_shipment',
  UPDATE_SHIPMENT: 'update_shipment',
  ASSIGN_PICKUP: 'assign_pickup',
  COMPLETE_DELIVERY: 'complete_delivery',
  PROCESS_PAYMENT: 'process_payment',
};

/**
 * Initializes the analytics service
 * @param {Object} options - Configuration options
 * @returns {void}
 */
const initAnalytics = (options = {}) => {
  if (typeof window === 'undefined') return;
  
  // Set up analytics in the window object for global access
  window.analyticsService = {
    trackEvent,
    trackPageView,
    trackUserAction,
    trackFormInteraction,
    trackNavigation,
    trackError,
    trackPerformance,
    trackFeatureUsage,
    trackBusinessProcess,
    identifyUser,
  };
  
  // Initialize Google Analytics if enabled
  if (options.googleAnalytics?.enabled) {
    initGoogleAnalytics(options.googleAnalytics.measurementId);
  }
  
  // Initialize custom analytics storage if no external service is used
  if (!options.googleAnalytics?.enabled) {
    initLocalAnalytics();
  }
  
  // Track initial page view
  trackPageView(window.location.pathname);
  
  // Add navigation tracking
  addNavigationTracking();
};

/**
 * Initializes Google Analytics
 * @param {string} measurementId - Google Analytics measurement ID
 * @returns {void}
 */
const initGoogleAnalytics = (measurementId) => {
  // Add Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  
  // Initialize Google Analytics
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false, // We'll handle page views manually
  });
};

/**
 * Initializes local analytics storage
 * @returns {void}
 */
const initLocalAnalytics = () => {
  // Create local storage for analytics if it doesn't exist
  if (!localStorage.getItem('analytics_events')) {
    localStorage.setItem('analytics_events', JSON.stringify([]));
  }
  
  // Create session storage for current session
  if (!sessionStorage.getItem('analytics_session')) {
    sessionStorage.setItem('analytics_session', JSON.stringify({
      sessionId: generateSessionId(),
      startTime: new Date().toISOString(),
      pageViews: 0,
      userActions: 0,
      errors: 0,
    }));
  }
};

/**
 * Adds navigation tracking
 * @returns {void}
 */
const addNavigationTracking = () => {
  // Track navigation events
  if (typeof window !== 'undefined') {
    // Track history changes for SPA navigation
    const originalPushState = window.history.pushState;
    window.history.pushState = function(state, title, url) {
      originalPushState.apply(this, [state, title, url]);
      if (url) {
        trackPageView(url);
      }
    };
    
    // Track browser back/forward navigation
    window.addEventListener('popstate', () => {
      trackPageView(window.location.pathname);
    });
  }
};

/**
 * Generates a unique session ID
 * @returns {string} Unique session ID
 */
const generateSessionId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Gets the current session data
 * @returns {Object} Session data
 */
const getSessionData = () => {
  if (typeof window === 'undefined') return {};
  
  const sessionData = JSON.parse(sessionStorage.getItem('analytics_session') || '{}');
  return {
    sessionId: sessionData.sessionId || generateSessionId(),
    startTime: sessionData.startTime || new Date().toISOString(),
    pageViews: sessionData.pageViews || 0,
    userActions: sessionData.userActions || 0,
    errors: sessionData.errors || 0,
  };
};

/**
 * Updates the current session data
 * @param {Object} updates - Updates to apply to the session data
 * @returns {void}
 */
const updateSessionData = (updates) => {
  if (typeof window === 'undefined') return;
  
  const sessionData = getSessionData();
  const updatedData = { ...sessionData, ...updates };
  sessionStorage.setItem('analytics_session', JSON.stringify(updatedData));
};

/**
 * Tracks an analytics event
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string} label - Event label
 * @param {Object} [data={}] - Additional event data
 * @returns {void}
 */
const trackEvent = (category, action, label, data = {}) => {
  if (typeof window === 'undefined') return;
  
  const event = {
    category,
    action,
    label,
    data,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    sessionId: getSessionData().sessionId,
    userId: getUserId(),
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event);
  }
  
  // Send to Google Analytics if available
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      ...data,
    });
  }
  
  // Store locally if no external service is used
  if (!window.gtag) {
    storeEventLocally(event);
  }
};

/**
 * Stores an event in local storage
 * @param {Object} event - Event data
 * @returns {void}
 */
const storeEventLocally = (event) => {
  if (typeof window === 'undefined') return;
  
  const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
  events.push(event);
  
  // Limit the number of stored events to prevent localStorage from filling up
  const maxEvents = 1000;
  if (events.length > maxEvents) {
    events.splice(0, events.length - maxEvents);
  }
  
  localStorage.setItem('analytics_events', JSON.stringify(events));
};

/**
 * Gets the current user ID
 * @returns {string|null} User ID or null if not available
 */
const getUserId = () => {
  if (typeof window === 'undefined') return null;
  
  // Try to get user ID from localStorage
  const userId = localStorage.getItem('analytics_user_id');
  if (userId) return userId;
  
  // Try to get user ID from Redux store
  if (window.store) {
    const state = window.store.getState();
    if (state.auth?.user?.id) {
      return state.auth.user.id;
    }
  }
  
  return null;
};

/**
 * Identifies a user for analytics
 * @param {string} userId - User ID
 * @param {Object} [traits={}] - User traits
 * @returns {void}
 */
const identifyUser = (userId, traits = {}) => {
  if (typeof window === 'undefined') return;
  
  // Store user ID in localStorage
  localStorage.setItem('analytics_user_id', userId);
  
  // Send to Google Analytics if available
  if (window.gtag) {
    window.gtag('set', 'user_properties', traits);
    window.gtag('set', 'user_id', userId);
  }
  
  // Store user traits locally
  localStorage.setItem('analytics_user_traits', JSON.stringify(traits));
};

/**
 * Tracks a page view
 * @param {string} path - Page path
 * @param {Object} [data={}] - Additional page data
 * @returns {void}
 */
const trackPageView = (path, data = {}) => {
  if (typeof window === 'undefined') return;
  
  // Update session data
  const sessionData = getSessionData();
  updateSessionData({
    pageViews: sessionData.pageViews + 1,
  });
  
  // Track the page view event
  trackEvent(EVENT_CATEGORIES.PAGE_VIEW, EVENT_ACTIONS.VIEW, path, {
    page_path: path,
    page_title: document.title,
    ...data,
  });
  
  // Send to Google Analytics if available
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
      ...data,
    });
  }
};

/**
 * Tracks a user action
 * @param {string} action - Action type
 * @param {string} label - Action label
 * @param {Object} [data={}] - Additional action data
 * @returns {void}
 */
const trackUserAction = (action, label, data = {}) => {
  if (typeof window === 'undefined') return;
  
  // Update session data
  const sessionData = getSessionData();
  updateSessionData({
    userActions: sessionData.userActions + 1,
  });
  
  // Track the user action event
  trackEvent(EVENT_CATEGORIES.USER_ACTION, action, label, data);
};

/**
 * Tracks a form interaction
 * @param {string} action - Form action
 * @param {string} formName - Form name
 * @param {Object} [data={}] - Additional form data
 * @returns {void}
 */
const trackFormInteraction = (action, formName, data = {}) => {
  trackEvent(EVENT_CATEGORIES.FORM_INTERACTION, action, formName, data);
};

/**
 * Tracks a navigation event
 * @param {string} action - Navigation action
 * @param {string} destination - Navigation destination
 * @param {Object} [data={}] - Additional navigation data
 * @returns {void}
 */
const trackNavigation = (action, destination, data = {}) => {
  trackEvent(EVENT_CATEGORIES.NAVIGATION, action, destination, data);
};

/**
 * Tracks an error
 * @param {string} action - Error action
 * @param {string} message - Error message
 * @param {Object} [data={}] - Additional error data
 * @returns {void}
 */
const trackError = (action, message, data = {}) => {
  if (typeof window === 'undefined') return;
  
  // Update session data
  const sessionData = getSessionData();
  updateSessionData({
    errors: sessionData.errors + 1,
  });
  
  // Track the error event
  trackEvent(EVENT_CATEGORIES.ERROR, action, message, {
    error_message: message,
    ...data,
  });
};

/**
 * Tracks a performance metric
 * @param {string} metricName - Metric name
 * @param {number} value - Metric value
 * @param {Object} [data={}] - Additional metric data
 * @returns {void}
 */
const trackPerformance = (metricName, value, data = {}) => {
  trackEvent(EVENT_CATEGORIES.PERFORMANCE, EVENT_ACTIONS.LOAD_TIME, metricName, {
    metric_name: metricName,
    metric_value: value,
    ...data,
  });
};

/**
 * Tracks feature usage
 * @param {string} action - Feature action
 * @param {string} featureName - Feature name
 * @param {Object} [data={}] - Additional feature data
 * @returns {void}
 */
const trackFeatureUsage = (action, featureName, data = {}) => {
  trackEvent(EVENT_CATEGORIES.FEATURE_USAGE, action, featureName, data);
};

/**
 * Tracks a business process
 * @param {string} action - Process action
 * @param {string} processName - Process name
 * @param {Object} [data={}] - Additional process data
 * @returns {void}
 */
const trackBusinessProcess = (action, processName, data = {}) => {
  trackEvent(EVENT_CATEGORIES.BUSINESS_PROCESS, action, processName, data);
};

/**
 * Gets all stored analytics events
 * @returns {Array} Stored events
 */
const getStoredEvents = () => {
  if (typeof window === 'undefined') return [];
  
  return JSON.parse(localStorage.getItem('analytics_events') || '[]');
};

/**
 * Clears all stored analytics events
 * @returns {void}
 */
const clearStoredEvents = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('analytics_events', JSON.stringify([]));
};

export const analyticsService = {
  initAnalytics,
  trackEvent,
  trackPageView,
  trackUserAction,
  trackFormInteraction,
  trackNavigation,
  trackError,
  trackPerformance,
  trackFeatureUsage,
  trackBusinessProcess,
  identifyUser,
  getStoredEvents,
  clearStoredEvents,
  EVENT_CATEGORIES,
  EVENT_ACTIONS,
};
