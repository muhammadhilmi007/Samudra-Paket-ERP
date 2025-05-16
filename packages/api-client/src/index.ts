/**
 * API Client Package
 * Shared API client for frontend applications
 */

// This is a placeholder file for the API client package
// In a real implementation, this would export API client functions

import axios from 'axios';

const baseURL = process.env.API_BASE_URL || 'http://localhost:3000';

/**
 * Create an axios instance with default configuration
 */
export const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add authentication token to requests
 * @param token The authentication token
 */
export const setAuthToken = (token: string): void => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Remove authentication token from requests
 */
export const removeAuthToken = (): void => {
  delete apiClient.defaults.headers.common['Authorization'];
};

export default {
  apiClient,
  setAuthToken,
  removeAuthToken,
};
