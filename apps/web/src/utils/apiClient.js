/**
 * API Client
 * Centralized client for making API requests to the backend services
 */

import axios from 'axios';
import { apiConfig } from './apiConfig';
import tokenManager from './tokenManager';

// Import analytics service if available, otherwise use a mock
let analyticsService;
try {
  analyticsService = require('./analyticsService').analyticsService;
} catch (error) {
  // Mock analytics service if not available
  analyticsService = {
    trackEvent: () => {},
    EVENT_CATEGORIES: { PERFORMANCE: 'performance' },
    EVENT_ACTIONS: { API_RESPONSE_TIME: 'api_response_time' }
  };
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: `${apiConfig.BASE_URL}/${apiConfig.VERSION}`,
  timeout: apiConfig.TIMEOUT.DEFAULT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request interceptor
 * - Add authorization header
 * - Track API request in analytics
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Start performance tracking
    const startTime = performance.now();
    config.metadata = { startTime };
    
    // Get token from token manager
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Track API request in analytics
    analyticsService.trackEvent(
      analyticsService.EVENT_CATEGORIES.PERFORMANCE, 
      analyticsService.EVENT_ACTIONS.API_RESPONSE_TIME, 
      `API_REQUEST_${config.method?.toUpperCase()}_${config.url}`,
      { 
        url: config.url,
        method: config.method,
      }
    );
    
    return config;
  },
  (error) => {
    // Track API request error in analytics
    analyticsService.trackError(
      analyticsService.EVENT_ACTIONS.API_ERROR,
      'API Request Error',
      { error: error.message }
    );
    
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handle token refresh
 * - Track API response in analytics
 * - Handle common errors
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Calculate API response time
    const endTime = performance.now();
    const startTime = response.config.metadata?.startTime || endTime;
    const duration = endTime - startTime;
    
    // Track API response in analytics
    analyticsService.trackPerformance(
      `API_RESPONSE_${response.config.method?.toUpperCase()}_${response.config.url}`,
      duration,
      { 
        url: response.config.url,
        method: response.config.method,
        status: response.status,
      }
    );
    
    return response;
  },
  async (error) => {
    // Calculate API response time even for errors
    const endTime = performance.now();
    const startTime = error.config?.metadata?.startTime || endTime;
    const duration = endTime - startTime;
    
    // Track API error in analytics
    analyticsService.trackError(
      analyticsService.EVENT_ACTIONS.API_ERROR,
      'API Response Error',
      { 
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        duration,
      }
    );
    
    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && !error.config._retry) {
      try {
        // Mark request as retry to prevent infinite loop
        error.config._retry = true;
        
        // Get refresh token from localStorage
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token available, reject the request
          return Promise.reject(error);
        }
        
        // Attempt to refresh the token
        const response = await axios.post(
          `${apiConfig.BASE_URL}/${apiConfig.VERSION}${apiConfig.ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken }
        );
        
        // If token refresh is successful, update tokens in localStorage
        if (response.data?.token) {
          localStorage.setItem('auth_token', response.data.token);
          
          if (response.data.refreshToken) {
            localStorage.setItem('refresh_token', response.data.refreshToken);
          }
          
          // Update the Authorization header and retry the original request
          error.config.headers.Authorization = `Bearer ${response.data.token}`;
          return axiosInstance(error.config);
        }
      } catch (refreshError) {
        // If token refresh fails, clear tokens and reject the request
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        
        // Track refresh token error in analytics
        analyticsService.trackError(
          analyticsService.EVENT_ACTIONS.API_ERROR,
          'Token Refresh Error',
          { error: refreshError.message }
        );
        
        // Redirect to login page if in browser environment
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    // Handle network errors
    if (!error.response) {
      // Check if offline and queue request for later if supported
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        // If the app has offline support, queue the request
        if (typeof window !== 'undefined' && window.offlineQueue) {
          window.offlineQueue.addToQueue({
            config: error.config,
            timestamp: new Date().toISOString(),
          });
          
          return Promise.reject({
            ...error,
            isOffline: true,
            message: 'Request queued for when connection is restored',
          });
        }
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * API Client
 * Methods for making API requests
 */
export const apiClient = {
  /**
   * Make a GET request
   * @param {string} url - API endpoint
   * @param {Object} params - Query parameters
   * @param {Object} options - Additional options
   * @returns {Promise} - API response
   */
  get: (url, params = {}, options = {}) => {
    return axiosInstance.get(url, { params, ...options });
  },
  
  /**
   * Make a POST request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Additional options
   * @returns {Promise} - API response
   */
  post: (url, data = {}, options = {}) => {
    return axiosInstance.post(url, data, options);
  },
  
  /**
   * Make a PUT request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Additional options
   * @returns {Promise} - API response
   */
  put: (url, data = {}, options = {}) => {
    return axiosInstance.put(url, data, options);
  },
  
  /**
   * Make a PATCH request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} options - Additional options
   * @returns {Promise} - API response
   */
  patch: (url, data = {}, options = {}) => {
    return axiosInstance.patch(url, data, options);
  },
  
  /**
   * Make a DELETE request
   * @param {string} url - API endpoint
   * @param {Object} options - Additional options
   * @returns {Promise} - API response
   */
  delete: (url, options = {}) => {
    return axiosInstance.delete(url, options);
  },
  
  /**
   * Upload a file
   * @param {string} url - API endpoint
   * @param {FormData} formData - Form data with file
   * @param {Object} options - Additional options
   * @returns {Promise} - API response
   */
  upload: (url, formData, options = {}) => {
    return axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...options,
    });
  },
  
  /**
   * Download a file
   * @param {string} url - API endpoint
   * @param {Object} params - Query parameters
   * @param {Object} options - Additional options
   * @returns {Promise} - API response
   */
  download: (url, params = {}, options = {}) => {
    return axiosInstance.get(url, {
      params,
      responseType: 'blob',
      ...options,
    });
  },
  
  /**
   * Set the authentication token
   * @param {Object} tokens - Authentication tokens
   * @param {string} tokens.token - Access token
   * @param {string} tokens.refreshToken - Refresh token
   * @param {boolean} rememberMe - Whether to remember the user
   */
  setAuthToken(tokens, rememberMe = false) {
    if (tokens) {
      // Use token manager to set tokens
      tokenManager.setTokens(tokens, rememberMe);
      
      // Set default header for future requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.token}`;
    } else {
      this.clearAuthToken();
    }
  },
  
  /**
   * Clear the authentication token
   */
  clearAuthToken() {
    // Use token manager to remove tokens
    tokenManager.removeTokens();
    
    // Remove default header
    delete axiosInstance.defaults.headers.common['Authorization'];
  },
  
  /**
   * Check if the user is authenticated
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated() {
    // Use token manager to check authentication
    return tokenManager.isAuthenticated();
  },
  
  /**
   * Check if token is expired
   * @returns {boolean} - True if token is expired
   */
  isTokenExpired() {
    const token = tokenManager.getToken();
    return tokenManager.isTokenExpired(token);
  },
  
  /**
   * Refresh the authentication token
   * @returns {Promise} - API response with new tokens
   */
  async refreshToken() {
    const refreshToken = tokenManager.getRefreshToken();
    
    if (!refreshToken) {
      return Promise.reject(new Error('No refresh token available'));
    }
    
    try {
      // Make request without using the interceptors to avoid infinite loop
      const response = await axios.post(
        `${apiConfig.BASE_URL}/${apiConfig.VERSION}${apiConfig.ENDPOINTS.AUTH.REFRESH_TOKEN}`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      // Update tokens
      if (response.data?.token) {
        this.setAuthToken(response.data);
      }
      
      return response.data;
    } catch (error) {
      // If refresh fails, clear tokens and reject
      this.clearAuthToken();
      return Promise.reject(error);
    }
  },
};

export default apiClient;
