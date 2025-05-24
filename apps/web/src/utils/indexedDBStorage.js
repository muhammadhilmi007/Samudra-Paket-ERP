/**
 * IndexedDB Storage Adapter for Redux Persist
 * Provides a storage solution for larger datasets that exceed localStorage limits
 */

// Define database configuration
const DB_NAME = 'samudraERP';
const DB_VERSION = 1;
const STORE_NAME = 'reduxPersist';

// Create a storage adapter using IndexedDB
const createIndexedDBStorage = () => {
  // Check if running in a browser environment
  if (typeof window === 'undefined' || !window.indexedDB) {
    // Return a noop storage for SSR or unsupported browsers
    return {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    };
  }

  // Open/create the database
  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  };

  // Get a transaction and object store
  const getStore = async (mode = 'readonly') => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, mode);
    return transaction.objectStore(STORE_NAME);
  };

  return {
    // Get an item from IndexedDB
    async getItem(key) {
      try {
        const store = await getStore('readonly');
        return new Promise((resolve, reject) => {
          const request = store.get(key);
          
          request.onsuccess = () => {
            resolve(request.result);
          };
          
          request.onerror = (event) => {
            console.error('Error getting item from IndexedDB:', event.target.error);
            reject(event.target.error);
          };
        });
      } catch (error) {
        console.error('IndexedDB getItem error:', error);
        return null;
      }
    },

    // Set an item in IndexedDB
    async setItem(key, value) {
      try {
        const store = await getStore('readwrite');
        return new Promise((resolve, reject) => {
          const request = store.put(value, key);
          
          request.onsuccess = () => {
            resolve();
          };
          
          request.onerror = (event) => {
            console.error('Error setting item in IndexedDB:', event.target.error);
            reject(event.target.error);
          };
        });
      } catch (error) {
        console.error('IndexedDB setItem error:', error);
      }
    },

    // Remove an item from IndexedDB
    async removeItem(key) {
      try {
        const store = await getStore('readwrite');
        return new Promise((resolve, reject) => {
          const request = store.delete(key);
          
          request.onsuccess = () => {
            resolve();
          };
          
          request.onerror = (event) => {
            console.error('Error removing item from IndexedDB:', event.target.error);
            reject(event.target.error);
          };
        });
      } catch (error) {
        console.error('IndexedDB removeItem error:', error);
      }
    },
  };
};

export default createIndexedDBStorage();
