/**
 * useOfflineStorage Hook
 * React hook for using offline storage functionality
 */

import { useState, useEffect, useCallback } from 'react';
import { offlineStorage } from '../utils/offlineStorage';

/**
 * Hook for interacting with offline storage
 * @param {string} storeName - The name of the store to interact with
 * @returns {Object} Methods and state for offline storage
 */
export const useOfflineStorage = (storeName) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingOperations, setPendingOperations] = useState(0);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Load all items from the store
  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await offlineStorage.getAllItems(storeName);
      setItems(data);
      setError(null);
    } catch (err) {
      console.error(`Error loading items from ${storeName}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [storeName]);

  // Add or update an item
  const saveItem = useCallback(async (item) => {
    try {
      await offlineStorage.updateItem(storeName, item);
      
      // If offline, queue for sync
      if (!isOnline) {
        const operation = item.id ? 'update' : 'create';
        if (storeName === offlineStorage.STORES.SHIPMENTS) {
          await offlineStorage.queueShipmentSync(item, operation);
        } else if (storeName === offlineStorage.STORES.CUSTOMERS) {
          await offlineStorage.queueCustomerSync(item, operation);
        }
      }
      
      // Refresh items
      await loadItems();
      
      // Check pending operations
      await checkPendingOperations();
      
      return true;
    } catch (err) {
      console.error(`Error saving item to ${storeName}:`, err);
      setError(err.message);
      return false;
    }
  }, [storeName, isOnline, loadItems]);

  // Get a single item by ID
  const getItem = useCallback(async (id) => {
    try {
      return await offlineStorage.getItem(storeName, id);
    } catch (err) {
      console.error(`Error getting item from ${storeName}:`, err);
      setError(err.message);
      return null;
    }
  }, [storeName]);

  // Delete an item
  const deleteItem = useCallback(async (id) => {
    try {
      await offlineStorage.deleteItem(storeName, id);
      
      // If offline, queue for sync
      if (!isOnline) {
        const item = { id };
        if (storeName === offlineStorage.STORES.SHIPMENTS) {
          await offlineStorage.queueShipmentSync(item, 'delete');
        } else if (storeName === offlineStorage.STORES.CUSTOMERS) {
          await offlineStorage.queueCustomerSync(item, 'delete');
        }
      }
      
      // Refresh items
      await loadItems();
      
      // Check pending operations
      await checkPendingOperations();
      
      return true;
    } catch (err) {
      console.error(`Error deleting item from ${storeName}:`, err);
      setError(err.message);
      return false;
    }
  }, [storeName, isOnline, loadItems]);

  // Check for pending operations
  const checkPendingOperations = useCallback(async () => {
    try {
      const pendingShipments = await offlineStorage.getPendingShipments();
      const pendingCustomers = await offlineStorage.getPendingCustomers();
      setPendingOperations(pendingShipments.length + pendingCustomers.length);
    } catch (err) {
      console.error('Error checking pending operations:', err);
    }
  }, []);

  // Trigger sync of pending operations
  const syncPendingOperations = useCallback(async () => {
    if (isOnline) {
      try {
        await offlineStorage.triggerSync();
        await checkPendingOperations();
        await loadItems(); // Refresh data after sync
      } catch (err) {
        console.error('Error syncing pending operations:', err);
        setError(err.message);
      }
    }
  }, [isOnline, checkPendingOperations, loadItems]);

  // Handle online/offline status changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      syncPendingOperations();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial load
    loadItems();
    checkPendingOperations();
    
    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadItems, checkPendingOperations, syncPendingOperations]);

  return {
    items,
    loading,
    error,
    isOnline,
    pendingOperations,
    saveItem,
    getItem,
    deleteItem,
    loadItems,
    syncPendingOperations,
  };
};
