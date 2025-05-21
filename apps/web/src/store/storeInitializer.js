/**
 * Store Initializer
 * Initializes all API slices to avoid circular dependencies
 */

// Import API slices
import { apiSlice } from './api/apiSlice';
import './api/authApi';
import './api/customerApi';
import './api/shipmentApi';
import './api/financeApi';
import './api/userApi';
import './api/settingsApi';

/**
 * Initialize store with all API slices
 * @param {Object} store - Redux store
 */
export const initializeStore = (store) => {
  // This function doesn't need to do anything else
  // Just importing the API slices is enough to register them
  console.log('Store initialized with all API slices');
};

export default initializeStore;
