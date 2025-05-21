/**
 * Persistence Utilities
 * Helper functions for managing state persistence and offline data
 */

/**
 * Determines if the app is in an offline state
 * @returns {boolean} - True if the app is offline
 */
export const isOffline = () => {
  if (typeof navigator !== 'undefined') {
    return !navigator.onLine;
  }
  return false;
};

/**
 * Filters sensitive data from an object before persistence
 * @param {Object} data - The data object to filter
 * @param {Array<string>} sensitiveFields - Array of field names to remove
 * @returns {Object} - Filtered data object
 */
export const filterSensitiveData = (data, sensitiveFields = []) => {
  if (!data || typeof data !== 'object') return data;
  
  const filtered = { ...data };
  
  sensitiveFields.forEach(field => {
    if (field in filtered) {
      delete filtered[field];
    }
  });
  
  return filtered;
};

/**
 * Transforms data for secure storage
 * @param {Object} data - The data to transform
 * @returns {Object} - Transformed data
 */
export const transformForStorage = (data) => {
  if (!data) return data;
  
  // Define fields that should be masked or transformed
  const sensitiveFields = ['password', 'securityQuestion', 'securityAnswer', 'pin'];
  
  // Create a deep copy to avoid mutating the original
  const transformed = JSON.parse(JSON.stringify(data));
  
  // Process the object recursively
  const processObject = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    Object.keys(obj).forEach(key => {
      // If this is a sensitive field, mask it
      if (sensitiveFields.includes(key)) {
        if (obj[key]) {
          obj[key] = '[REDACTED]';
        }
      } 
      // If this is an object or array, process it recursively
      else if (typeof obj[key] === 'object' && obj[key] !== null) {
        processObject(obj[key]);
      }
    });
  };
  
  processObject(transformed);
  return transformed;
};

/**
 * Creates a storage object that selectively persists data
 * @param {Object} storage - The base storage object (e.g., localStorage)
 * @param {Array<string>} allowList - Keys that are allowed to be persisted
 * @returns {Object} - Storage object with selective persistence
 */
export const createSelectiveStorage = (storage, allowList = []) => {
  return {
    getItem: (key) => {
      return storage.getItem(key);
    },
    setItem: (key, value) => {
      // Only persist keys in the allow list
      if (allowList.includes(key) || key.startsWith('persist:')) {
        storage.setItem(key, value);
      }
    },
    removeItem: (key) => {
      storage.removeItem(key);
    },
  };
};

/**
 * Handles data synchronization when coming back online
 * @param {Function} syncFunction - Function to call for synchronization
 */
export const setupOfflineSync = (syncFunction) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      console.log('App is back online. Syncing data...');
      syncFunction();
    });
  }
};

/**
 * Purges specific keys from persisted storage
 * @param {Object} persistor - Redux persistor object
 * @param {Array<string>} keys - Keys to purge
 */
export const purgePersistedKeys = async (persistor, keys = []) => {
  if (!persistor || !persistor.purge) return;
  
  try {
    await persistor.purge(keys);
    console.log(`Purged keys: ${keys.join(', ')}`);
  } catch (error) {
    console.error('Error purging persisted keys:', error);
  }
};

/**
 * Checks if a specific key is persisted in storage
 * @param {string} key - The key to check
 * @returns {boolean} - True if the key exists in storage
 */
export const isKeyPersisted = (key) => {
  if (typeof window === 'undefined') return false;
  
  try {
    const persistedKey = `persist:${key}`;
    return localStorage.getItem(persistedKey) !== null;
  } catch (error) {
    console.error('Error checking persisted key:', error);
    return false;
  }
};
