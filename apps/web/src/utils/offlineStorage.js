/**
 * Offline Storage Utility
 * Handles IndexedDB operations for offline data storage and synchronization
 */

const DB_NAME = 'samudraERPDB';
const DB_VERSION = 1;
const STORES = {
  SHIPMENTS: 'shipments',
  CUSTOMERS: 'customers',
  PENDING_SHIPMENTS: 'pendingShipments',
  PENDING_CUSTOMERS: 'pendingCustomers',
  USER_PREFERENCES: 'userPreferences',
};

/**
 * Opens the IndexedDB database
 * @returns {Promise<IDBDatabase>} The database instance
 */
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.SHIPMENTS)) {
        db.createObjectStore(STORES.SHIPMENTS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.CUSTOMERS)) {
        db.createObjectStore(STORES.CUSTOMERS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.PENDING_SHIPMENTS)) {
        db.createObjectStore(STORES.PENDING_SHIPMENTS, { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.PENDING_CUSTOMERS)) {
        db.createObjectStore(STORES.PENDING_CUSTOMERS, { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.USER_PREFERENCES)) {
        db.createObjectStore(STORES.USER_PREFERENCES, { keyPath: 'key' });
      }
    };
  });
};

/**
 * Adds an item to a store
 * @param {string} storeName - The name of the store
 * @param {Object} item - The item to add
 * @returns {Promise<number>} The ID of the added item
 */
const addItem = async (storeName, item) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item);
    
    request.onerror = (event) => {
      console.error(`Error adding item to ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Updates an item in a store
 * @param {string} storeName - The name of the store
 * @param {Object} item - The item to update
 * @returns {Promise<void>}
 */
const updateItem = async (storeName, item) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);
    
    request.onerror = (event) => {
      console.error(`Error updating item in ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = () => {
      resolve();
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Gets an item from a store by ID
 * @param {string} storeName - The name of the store
 * @param {string|number} id - The ID of the item
 * @returns {Promise<Object|null>} The item or null if not found
 */
const getItem = async (storeName, id) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    
    request.onerror = (event) => {
      console.error(`Error getting item from ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result || null);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Gets all items from a store
 * @param {string} storeName - The name of the store
 * @returns {Promise<Array>} Array of items
 */
const getAllItems = async (storeName) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onerror = (event) => {
      console.error(`Error getting all items from ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result || []);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Deletes an item from a store by ID
 * @param {string} storeName - The name of the store
 * @param {string|number} id - The ID of the item
 * @returns {Promise<void>}
 */
const deleteItem = async (storeName, id) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onerror = (event) => {
      console.error(`Error deleting item from ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = () => {
      resolve();
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Clears all items from a store
 * @param {string} storeName - The name of the store
 * @returns {Promise<void>}
 */
const clearStore = async (storeName) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    
    request.onerror = (event) => {
      console.error(`Error clearing store ${storeName}:`, event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = () => {
      resolve();
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

/**
 * Saves a shipment for offline use
 * @param {Object} shipment - The shipment data
 * @returns {Promise<void>}
 */
const saveShipment = async (shipment) => {
  await updateItem(STORES.SHIPMENTS, shipment);
};

/**
 * Saves a customer for offline use
 * @param {Object} customer - The customer data
 * @returns {Promise<void>}
 */
const saveCustomer = async (customer) => {
  await updateItem(STORES.CUSTOMERS, customer);
};

/**
 * Queues a shipment to be synced when online
 * @param {Object} shipment - The shipment data
 * @param {string} operation - The operation type (create, update, delete)
 * @returns {Promise<number>} The ID of the queued item
 */
const queueShipmentSync = async (shipment, operation) => {
  const pendingItem = {
    data: shipment,
    operation,
    timestamp: new Date().toISOString(),
  };
  
  return await addItem(STORES.PENDING_SHIPMENTS, pendingItem);
};

/**
 * Queues a customer to be synced when online
 * @param {Object} customer - The customer data
 * @param {string} operation - The operation type (create, update, delete)
 * @returns {Promise<number>} The ID of the queued item
 */
const queueCustomerSync = async (customer, operation) => {
  const pendingItem = {
    data: customer,
    operation,
    timestamp: new Date().toISOString(),
  };
  
  return await addItem(STORES.PENDING_CUSTOMERS, pendingItem);
};

/**
 * Gets all pending shipments to be synced
 * @returns {Promise<Array>} Array of pending shipments
 */
const getPendingShipments = async () => {
  return await getAllItems(STORES.PENDING_SHIPMENTS);
};

/**
 * Gets all pending customers to be synced
 * @returns {Promise<Array>} Array of pending customers
 */
const getPendingCustomers = async () => {
  return await getAllItems(STORES.PENDING_CUSTOMERS);
};

/**
 * Removes a pending shipment after successful sync
 * @param {number} id - The ID of the pending shipment
 * @returns {Promise<void>}
 */
const removePendingShipment = async (id) => {
  await deleteItem(STORES.PENDING_SHIPMENTS, id);
};

/**
 * Removes a pending customer after successful sync
 * @param {number} id - The ID of the pending customer
 * @returns {Promise<void>}
 */
const removePendingCustomer = async (id) => {
  await deleteItem(STORES.PENDING_CUSTOMERS, id);
};

/**
 * Saves user preferences for offline use
 * @param {string} key - The preference key
 * @param {*} value - The preference value
 * @returns {Promise<void>}
 */
const saveUserPreference = async (key, value) => {
  await updateItem(STORES.USER_PREFERENCES, { key, value });
};

/**
 * Gets a user preference
 * @param {string} key - The preference key
 * @returns {Promise<*>} The preference value
 */
const getUserPreference = async (key) => {
  const preference = await getItem(STORES.USER_PREFERENCES, key);
  return preference ? preference.value : null;
};

/**
 * Triggers background sync for pending operations
 * @returns {Promise<void>}
 */
const triggerSync = async () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    
    try {
      await registration.sync.register('sync-shipments');
      await registration.sync.register('sync-customers');
      console.log('Background sync registered');
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  } else {
    console.warn('Background sync not supported');
    // Fallback to manual sync
    await manualSync();
  }
};

/**
 * Manually syncs pending operations when background sync is not available
 * @returns {Promise<void>}
 */
const manualSync = async () => {
  const pendingShipments = await getPendingShipments();
  const pendingCustomers = await getPendingCustomers();
  
  // Process pending shipments
  for (const item of pendingShipments) {
    try {
      const { data, operation } = item;
      let endpoint = '/api/shipments';
      let method = 'POST';
      
      if (operation === 'update') {
        endpoint = `/api/shipments/${data.id}`;
        method = 'PUT';
      } else if (operation === 'delete') {
        endpoint = `/api/shipments/${data.id}`;
        method = 'DELETE';
      }
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'DELETE' ? JSON.stringify(data) : undefined,
      });
      
      if (response.ok) {
        await removePendingShipment(item.id);
      }
    } catch (error) {
      console.error('Failed to sync shipment:', error);
    }
  }
  
  // Process pending customers
  for (const item of pendingCustomers) {
    try {
      const { data, operation } = item;
      let endpoint = '/api/customers';
      let method = 'POST';
      
      if (operation === 'update') {
        endpoint = `/api/customers/${data.id}`;
        method = 'PUT';
      } else if (operation === 'delete') {
        endpoint = `/api/customers/${data.id}`;
        method = 'DELETE';
      }
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'DELETE' ? JSON.stringify(data) : undefined,
      });
      
      if (response.ok) {
        await removePendingCustomer(item.id);
      }
    } catch (error) {
      console.error('Failed to sync customer:', error);
    }
  }
};

/**
 * Checks if there are any pending operations to sync
 * @returns {Promise<boolean>}
 */
const hasPendingOperations = async () => {
  const pendingShipments = await getPendingShipments();
  const pendingCustomers = await getPendingCustomers();
  
  return pendingShipments.length > 0 || pendingCustomers.length > 0;
};

export const offlineStorage = {
  STORES,
  saveShipment,
  saveCustomer,
  queueShipmentSync,
  queueCustomerSync,
  getPendingShipments,
  getPendingCustomers,
  removePendingShipment,
  removePendingCustomer,
  saveUserPreference,
  getUserPreference,
  triggerSync,
  manualSync,
  hasPendingOperations,
  // Lower-level functions
  addItem,
  updateItem,
  getItem,
  getAllItems,
  deleteItem,
  clearStore,
};
