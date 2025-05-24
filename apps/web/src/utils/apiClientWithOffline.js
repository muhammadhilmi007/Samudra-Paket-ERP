/**
 * Enhanced API Client with Offline Support
 * Extends the base API client with offline operation capabilities
 */

import axios from 'axios';
import { offlineQueue } from './offlineQueue';

// Create a custom instance of axios
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add request interceptor to handle offline operations
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Add response interceptor to handle errors and offline mode
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is due to network connectivity
    if (error.message === 'Network Error' || !navigator.onLine) {
      // Check if the request is eligible for offline queueing
      if (isQueueableRequest(originalRequest)) {
        // Queue the request for later
        await queueRequest(originalRequest);
        
        // Return a mock response to prevent app errors
        return createMockResponse(originalRequest);
      }
    }
    
    // Handle token refresh if needed
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Attempt to refresh token logic would go here
      // ...
    }
    
    return Promise.reject(error);
  }
);

/**
 * Check if a request can be queued for offline operation
 * @param {Object} request - The axios request config
 * @returns {boolean} - Whether the request can be queued
 */
const isQueueableRequest = (request) => {
  // Only queue mutating operations (POST, PUT, PATCH, DELETE)
  const queueableMethods = ['post', 'put', 'patch', 'delete'];
  
  // Check if method is queueable
  if (!queueableMethods.includes(request.method.toLowerCase())) {
    return false;
  }
  
  // Check if request has been marked as not queueable
  if (request.noQueue) {
    return false;
  }
  
  return true;
};

/**
 * Queue a request for later execution when online
 * @param {Object} request - The axios request config
 */
const queueRequest = async (request) => {
  try {
    // Determine operation type based on HTTP method
    let operationType;
    switch (request.method.toLowerCase()) {
      case 'post':
        operationType = offlineQueue.OPERATION_TYPES.CREATE;
        break;
      case 'put':
      case 'patch':
        operationType = offlineQueue.OPERATION_TYPES.UPDATE;
        break;
      case 'delete':
        operationType = offlineQueue.OPERATION_TYPES.DELETE;
        break;
      default:
        throw new Error(`Unsupported method for offline queue: ${request.method}`);
    }
    
    // Determine entity type from URL
    const entityType = getEntityTypeFromUrl(request.url);
    
    // Extract entity ID from URL if available
    const entityId = getEntityIdFromUrl(request.url);
    
    // Queue the operation
    await offlineQueue.addToQueue({
      type: operationType,
      entityType,
      entityId,
      data: request.data,
      url: request.url,
      method: request.method,
      timestamp: Date.now(),
    });
    
    console.log(`Request queued for offline operation: ${request.method} ${request.url}`);
  } catch (error) {
    console.error('Error queueing request for offline operation:', error);
  }
};

/**
 * Create a mock response for offline operations
 * @param {Object} request - The axios request config
 * @returns {Object} - A mock response object
 */
const createMockResponse = (request) => {
  // Generate a temporary ID for created entities
  const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Create a basic mock response
  const mockResponse = {
    data: {
      success: true,
      message: 'Operation queued for processing when online',
      offlineOperation: true,
    },
    status: 200,
    statusText: 'OK (Offline)',
    headers: {},
    config: request,
  };
  
  // Enhance mock response based on operation type
  if (request.method.toLowerCase() === 'post') {
    // For creation operations, return a temporary ID
    mockResponse.data.id = tempId;
    mockResponse.data.tempId = tempId;
  } else if (request.method.toLowerCase() === 'delete') {
    // For delete operations, confirm deletion
    mockResponse.data.deleted = true;
  }
  
  return mockResponse;
};

/**
 * Extract entity type from URL
 * @param {string} url - The request URL
 * @returns {string} - The entity type
 */
const getEntityTypeFromUrl = (url) => {
  // Extract the entity type from the URL path
  const pathSegments = url.split('/').filter(Boolean);
  
  // Map URL path to entity type
  if (url.includes('/shipments')) {
    return offlineQueue.ENTITY_TYPES.SHIPMENT;
  } else if (url.includes('/customers')) {
    return offlineQueue.ENTITY_TYPES.CUSTOMER;
  } else if (url.includes('/payments')) {
    return offlineQueue.ENTITY_TYPES.PAYMENT;
  } else if (url.includes('/deliveries')) {
    return offlineQueue.ENTITY_TYPES.DELIVERY;
  } else if (url.includes('/pickups')) {
    return offlineQueue.ENTITY_TYPES.PICKUP;
  }
  
  // Default to the last path segment
  return pathSegments[pathSegments.length - 1] || 'unknown';
};

/**
 * Extract entity ID from URL
 * @param {string} url - The request URL
 * @returns {string|null} - The entity ID or null if not found
 */
const getEntityIdFromUrl = (url) => {
  // Extract the entity ID from the URL path
  const matches = url.match(/\/([^\/]+)\/([^\/\?]+)(?:\/|$|\?)/);
  
  if (matches && matches.length >= 3) {
    return matches[2];
  }
  
  return null;
};

export default apiClient;
