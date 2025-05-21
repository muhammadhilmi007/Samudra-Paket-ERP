/**
 * Auth Service
 * Handles authentication-related API requests
 */

import apiClient from '../utils/apiClient';
import { apiConfig } from '../utils/apiConfig';

/**
 * Auth Service
 * Methods for authentication-related operations
 */
export const authService = {
  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @param {boolean} credentials.rememberMe - Whether to remember the user
   * @returns {Promise} - API response
   */
  login: async (credentials) => {
    try {
      const { rememberMe, ...loginData } = credentials;
      const response = await apiClient.post(apiConfig.ENDPOINTS.AUTH.LOGIN, loginData);
      
      // Store tokens using API client's token management
      if (response.data.token) {
        apiClient.setAuthToken({
          token: response.data.token,
          refreshToken: response.data.refreshToken
        }, rememberMe);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Register user
   * @param {Object} userData - User data
   * @returns {Promise} - API response
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post(apiConfig.ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Logout user
   * @returns {Promise} - API response
   */
  logout: async () => {
    try {
      // Get refresh token from token manager
      const refreshToken = apiClient.getRefreshToken ? apiClient.getRefreshToken() : null;
      
      // Make API request to invalidate token on server
      if (refreshToken) {
        await apiClient.post(apiConfig.ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      }
      
      // Clear tokens using API client
      apiClient.clearAuthToken();
      
      return { success: true };
    } catch (error) {
      // Clear tokens even if API request fails
      apiClient.clearAuthToken();
      
      throw error.response?.data || error;
    }
  },
  
  /**
   * Refresh authentication token
   * @returns {Promise} - API response with new token
   */
  refreshToken: async () => {
    try {
      // Use API client's refreshToken method if available
      if (apiClient.refreshToken) {
        return await apiClient.refreshToken();
      }
      
      // Fallback implementation if API client doesn't have refreshToken method
      const refreshToken = apiClient.getRefreshToken ? apiClient.getRefreshToken() : null;
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiClient.post(apiConfig.ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
      
      // Store new tokens using API client
      if (response.data.token) {
        apiClient.setAuthToken({
          token: response.data.token,
          refreshToken: response.data.refreshToken
        });
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get current user profile
   * @returns {Promise} - API response with user data
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.AUTH.ME);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Request password reset
   * @param {Object} data - Request data
   * @param {string} data.email - User email
   * @returns {Promise} - API response
   */
  forgotPassword: async (data) => {
    try {
      const response = await apiClient.post(apiConfig.ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Reset password
   * @param {Object} data - Reset data
   * @param {string} data.token - Reset token
   * @param {string} data.password - New password
   * @returns {Promise} - API response
   */
  resetPassword: async (data) => {
    try {
      const response = await apiClient.post(apiConfig.ENDPOINTS.AUTH.RESET_PASSWORD, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Change password
   * @param {Object} data - Password data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @returns {Promise} - API response
   */
  changePassword: async (data) => {
    try {
      const response = await apiClient.post(apiConfig.ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Verify email
   * @param {Object} data - Verification data
   * @param {string} data.token - Verification token
   * @returns {Promise} - API response
   */
  verifyEmail: async (data) => {
    try {
      const response = await apiClient.post(apiConfig.ENDPOINTS.AUTH.VERIFY_EMAIL, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated: () => {
    return apiClient.isAuthenticated();
  },
};

export default authService;
