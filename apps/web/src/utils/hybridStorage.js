/**
 * Hybrid Storage Adapter for Redux Persist
 * Intelligently chooses between localStorage and IndexedDB based on data size
 * Uses localStorage for smaller data (faster) and IndexedDB for larger data (more capacity)
 */

import localForageStorage from './persistStorage';
import indexedDBStorage from './indexedDBStorage';

// Size threshold in bytes - localStorage typically has a 5-10MB limit
// We'll use 2MB as a conservative threshold
const SIZE_THRESHOLD = 2 * 1024 * 1024; // 2MB in bytes

const createHybridStorage = () => {
  // Check if running in a browser environment
  if (typeof window === 'undefined') {
    // Return a noop storage for SSR
    return {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    };
  }

  // Store metadata about which storage is used for each key
  const getStorageMetadata = () => {
    try {
      const metadata = localStorage.getItem('_reduxPersistStorageMetadata');
      return metadata ? JSON.parse(metadata) : {};
    } catch (error) {
      console.error('Error reading storage metadata:', error);
      return {};
    }
  };

  const setStorageMetadata = (metadata) => {
    try {
      localStorage.setItem('_reduxPersistStorageMetadata', JSON.stringify(metadata));
    } catch (error) {
      console.error('Error saving storage metadata:', error);
    }
  };

  // Update storage type for a key
  const updateStorageType = (key, storageType) => {
    const metadata = getStorageMetadata();
    metadata[key] = storageType;
    setStorageMetadata(metadata);
  };

  // Get storage type for a key
  const getStorageType = (key) => {
    const metadata = getStorageMetadata();
    return metadata[key] || 'localStorage'; // Default to localStorage
  };

  return {
    // Get an item from the appropriate storage
    async getItem(key) {
      try {
        const storageType = getStorageType(key);
        
        if (storageType === 'indexedDB') {
          return indexedDBStorage.getItem(key);
        } else {
          return localForageStorage.getItem(key);
        }
      } catch (error) {
        console.error('Hybrid storage getItem error:', error);
        return null;
      }
    },

    // Set an item in the appropriate storage based on size
    async setItem(key, value) {
      try {
        // Estimate the size of the value
        const valueSize = new Blob([value]).size;
        
        // Choose storage based on size
        if (valueSize > SIZE_THRESHOLD) {
          // Use IndexedDB for large data
          updateStorageType(key, 'indexedDB');
          return indexedDBStorage.setItem(key, value);
        } else {
          // Use localStorage for small data
          updateStorageType(key, 'localStorage');
          return localForageStorage.setItem(key, value);
        }
      } catch (error) {
        console.error('Hybrid storage setItem error:', error);
        
        // Fallback to IndexedDB if localStorage fails (likely due to quota exceeded)
        try {
          updateStorageType(key, 'indexedDB');
          return indexedDBStorage.setItem(key, value);
        } catch (fallbackError) {
          console.error('Hybrid storage fallback error:', fallbackError);
        }
      }
    },

    // Remove an item from both storages to ensure it's completely removed
    async removeItem(key) {
      try {
        // Get current storage type
        const storageType = getStorageType(key);
        
        // Remove from the appropriate storage
        if (storageType === 'indexedDB') {
          await indexedDBStorage.removeItem(key);
        } else {
          await localForageStorage.removeItem(key);
        }
        
        // Remove from metadata
        const metadata = getStorageMetadata();
        delete metadata[key];
        setStorageMetadata(metadata);
      } catch (error) {
        console.error('Hybrid storage removeItem error:', error);
      }
    },
  };
};

export default createHybridStorage();
