/**
 * API Utilities
 * Functions for handling API requests and error handling
 */

import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * Handle API errors consistently
 * @param {Error} error - Error object from axios
 * @returns {Object} Standardized error object
 */
export const handleApiError = (error) => {
  let errorMessage = 'An unexpected error occurred';
  let statusCode = 500;
  let errorData = null;

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    statusCode = error.response.status;
    errorData = error.response.data;
    errorMessage = error.response.data?.message || `Error ${statusCode}`;
    
    // Handle specific status codes
    switch (statusCode) {
      case 401:
        errorMessage = 'Authentication required. Please log in again.';
        // Potentially trigger a logout or token refresh here
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 422:
        errorMessage = 'Validation failed. Please check your input.';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response from server. Please check your connection.';
    statusCode = 0;
  }

  // Create a standardized error object
  const standardizedError = {
    message: errorMessage,
    statusCode,
    data: errorData,
    originalError: error,
  };

  // Log the error for debugging
  console.error('API Error:', standardizedError);

  return standardizedError;
};

/**
 * Add auth token to API requests
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Setup request interceptor for handling auth tokens and request logging
 */
apiClient.interceptors.request.use(
  (config) => {
    // You can add request logging here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Setup response interceptor for handling common response scenarios
 */
apiClient.interceptors.response.use(
  (response) => {
    // You can add response logging or transformation here
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration and refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // This would be implemented with your token refresh logic
        // const refreshToken = getRefreshToken();
        // const response = await axios.post('/auth/refresh-token', { refreshToken });
        // const newToken = response.data.token;
        // setAuthToken(newToken);
        // originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        // return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        // This would be handled by your auth state management
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
