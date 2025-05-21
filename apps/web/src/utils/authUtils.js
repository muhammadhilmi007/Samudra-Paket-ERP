/**
 * Authentication Utilities
 * Functions for handling authentication, token management, and user permissions
 */

// Token storage keys
const TOKEN_KEY = 'samudra_auth_token';
const REFRESH_TOKEN_KEY = 'samudra_refresh_token';
const USER_KEY = 'samudra_user';

// Token refresh settings
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes before expiry

/**
 * Store authentication tokens securely
 * @param {Object} authData - Authentication data including token and refreshToken
 */
export const storeAuthTokens = (authData) => {
  if (typeof window === 'undefined') return;
  
  const { token, refreshToken, user } = authData;
  
  // Store tokens in localStorage (in production, consider using HTTP-only cookies)
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Get the stored authentication token
 * @returns {string|null} Authentication token or null if not found
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get the stored refresh token
 * @returns {string|null} Refresh token or null if not found
 */
export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Get the stored user data
 * @returns {Object|null} User data or null if not found
 */
export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

/**
 * Clear all authentication data from storage
 */
export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if the user is authenticated based on stored token
 * @returns {boolean} Whether the user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Parse JWT token to get payload data
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const parseJwt = (token) => {
  if (!token) return null;
  
  try {
    // Split the token and get the payload part
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
    console.error('Failed to parse JWT:', error);
    return null;
  }
};

/**
 * Check if a token is expired
 * @param {string} token - JWT token
 * @returns {boolean} Whether the token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decodedToken = parseJwt(token);
  if (!decodedToken) return true;
  
  // Check if the token has an expiration claim
  if (!decodedToken.exp) return false;
  
  // Get current time in seconds
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Check if token is expired
  return decodedToken.exp < currentTime;
};

/**
 * Check if a token needs refresh (will expire soon)
 * @param {string} token - JWT token
 * @returns {boolean} Whether the token needs refresh
 */
export const needsRefresh = (token) => {
  if (!token) return true;
  
  const decodedToken = parseJwt(token);
  if (!decodedToken) return true;
  
  // Check if the token has an expiration claim
  if (!decodedToken.exp) return false;
  
  // Get current time in seconds
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Check if token will expire soon (within REFRESH_THRESHOLD_MS)
  return decodedToken.exp < currentTime + (REFRESH_THRESHOLD_MS / 1000);
};

/**
 * Refresh the authentication token
 * @param {Function} refreshTokenMutation - RTK Query refresh token mutation
 * @returns {Promise<boolean>} Whether the refresh was successful
 */
export const refreshAuthToken = async (refreshTokenMutation) => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    
    // Call the refresh token API
    const result = await refreshTokenMutation(refreshToken).unwrap();
    
    // Store the new tokens
    if (result?.token) {
      storeAuthTokens(result);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    clearAuthData();
    return false;
  }
};

/**
 * Check if the user has the required role
 * @param {Object} user - User object with roles array
 * @param {string|string[]} requiredRoles - Required role(s)
 * @returns {boolean} Whether the user has the required role
 */
export const hasRole = (user, requiredRoles) => {
  if (!user || !user.roles || !user.roles.length) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.some(role => user.roles.includes(role));
  }
  
  return user.roles.includes(requiredRoles);
};

/**
 * Check if the user has permission for a specific action
 * @param {Object} user - User object with permissions array
 * @param {string} permission - Required permission
 * @returns {boolean} Whether the user has the required permission
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions || !user.permissions.length) return false;
  
  return user.permissions.includes(permission);
};
