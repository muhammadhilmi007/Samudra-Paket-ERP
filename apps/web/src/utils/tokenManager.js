/**
 * Token Manager
 * Utility functions for managing authentication tokens
 */

import Cookies from 'js-cookie';

// Cookie options
const cookieOptions = {
  expires: 7, // 7 days
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

/**
 * Set authentication tokens in cookies and localStorage
 * 
 * @param {Object} tokens - Authentication tokens
 * @param {string} tokens.token - Access token
 * @param {string} tokens.refreshToken - Refresh token
 * @param {boolean} rememberMe - Whether to remember the user
 */
export const setTokens = (tokens, rememberMe = false) => {
  if (!tokens) return;
  
  const { token, refreshToken } = tokens;
  
  // Always set token in cookies for server-side authentication
  Cookies.set('token', token, cookieOptions);
  
  // Set refresh token in cookies
  Cookies.set('refreshToken', refreshToken, cookieOptions);
  
  // If rememberMe is true, also store in localStorage for persistence
  if (rememberMe && typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

/**
 * Get authentication token from cookies or localStorage
 * 
 * @returns {string|null} - Authentication token or null if not found
 */
export const getToken = () => {
  // Try to get token from cookies first
  const token = Cookies.get('token');
  
  // If token exists in cookies, return it
  if (token) return token;
  
  // If not in cookies, try localStorage (for remembered users)
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('token');
    
    // If found in localStorage, restore to cookies and return
    if (localToken) {
      Cookies.set('token', localToken, cookieOptions);
      return localToken;
    }
  }
  
  return null;
};

/**
 * Get refresh token from cookies or localStorage
 * 
 * @returns {string|null} - Refresh token or null if not found
 */
export const getRefreshToken = () => {
  // Try to get refresh token from cookies first
  const refreshToken = Cookies.get('refreshToken');
  
  // If refresh token exists in cookies, return it
  if (refreshToken) return refreshToken;
  
  // If not in cookies, try localStorage (for remembered users)
  if (typeof window !== 'undefined') {
    const localRefreshToken = localStorage.getItem('refreshToken');
    
    // If found in localStorage, restore to cookies and return
    if (localRefreshToken) {
      Cookies.set('refreshToken', localRefreshToken, cookieOptions);
      return localRefreshToken;
    }
  }
  
  return null;
};

/**
 * Remove all authentication tokens from cookies and localStorage
 */
export const removeTokens = () => {
  // Remove from cookies
  Cookies.remove('token', { path: '/' });
  Cookies.remove('refreshToken', { path: '/' });
  
  // Remove from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

/**
 * Check if user is authenticated
 * 
 * @returns {boolean} - Whether user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Parse JWT token to get payload
 * 
 * @param {string} token - JWT token
 * @returns {Object|null} - Token payload or null if invalid
 */
export const parseToken = (token) => {
  if (!token) return null;
  
  try {
    // Get the payload part of the JWT (second part)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * 
 * @param {string} token - JWT token
 * @returns {boolean} - Whether token is expired
 */
export const isTokenExpired = (token) => {
  const payload = parseToken(token);
  
  if (!payload || !payload.exp) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Date.now() / 1000;
  
  // Check if token is expired (with 60 seconds buffer)
  return payload.exp < currentTime - 60;
};

export default {
  setTokens,
  getToken,
  getRefreshToken,
  removeTokens,
  isAuthenticated,
  parseToken,
  isTokenExpired,
};
