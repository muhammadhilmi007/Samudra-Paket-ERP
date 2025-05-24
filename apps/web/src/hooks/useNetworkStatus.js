/**
 * Network Status Hook
 * Detects online/offline status and handles network transitions
 */

import { useState, useEffect, useCallback } from 'react';
import { offlineQueue } from '../utils/offlineQueue';
import { useDispatch } from 'react-redux';
import { apiSlice } from '../store/api/apiSlice';

/**
 * Hook for detecting and responding to network status changes
 * @param {Object} options - Configuration options
 * @param {boolean} options.enableSync - Whether to enable auto-sync on reconnect
 * @returns {Object} Network status and related functions
 */
export const useNetworkStatus = (options = { enableSync: true }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingOperations, setPendingOperations] = useState(0);
  const dispatch = useDispatch();

  // Update pending operations count
  const updatePendingOperations = useCallback(async () => {
    const queue = await offlineQueue.getQueue();
    setPendingOperations(queue.length);
  }, []);

  // Handle online status change
  const handleOnlineStatusChange = useCallback(() => {
    const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
    setIsOnline(online);
    
    // If we're back online and auto-sync is enabled, trigger sync
    if (online && options.enableSync && !isSyncing) {
      syncPendingOperations();
    }
  }, [options.enableSync, isSyncing]);

  // Sync pending operations with the server
  const syncPendingOperations = useCallback(async () => {
    if (!isOnline || isSyncing) return;
    
    try {
      setIsSyncing(true);
      
      // Process the queue
      const results = await offlineQueue.processQueue(async (operation) => {
        // Process based on operation type and entity type
        switch (operation.type) {
          case offlineQueue.OPERATION_TYPES.CREATE:
            return processCreateOperation(operation, dispatch);
          case offlineQueue.OPERATION_TYPES.UPDATE:
            return processUpdateOperation(operation, dispatch);
          case offlineQueue.OPERATION_TYPES.DELETE:
            return processDeleteOperation(operation, dispatch);
          default:
            throw new Error(`Unknown operation type: ${operation.type}`);
        }
      });
      
      // Update pending operations count
      await updatePendingOperations();
      
      // Invalidate relevant API queries to refresh data
      dispatch(apiSlice.util.invalidateTags(['Shipment', 'Customer', 'Payment']));
      
      return results;
    } catch (error) {
      console.error('Error syncing pending operations:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, dispatch, updatePendingOperations]);

  // Process create operations
  const processCreateOperation = async (operation, dispatch) => {
    const { entityType, data } = operation;
    
    // Handle different entity types
    switch (entityType) {
      case offlineQueue.ENTITY_TYPES.SHIPMENT:
        // Use the appropriate API endpoint to create the shipment
        return dispatch(
          apiSlice.endpoints.createShipment.initiate(data)
        ).unwrap();
      case offlineQueue.ENTITY_TYPES.CUSTOMER:
        return dispatch(
          apiSlice.endpoints.createCustomer.initiate(data)
        ).unwrap();
      case offlineQueue.ENTITY_TYPES.PAYMENT:
        return dispatch(
          apiSlice.endpoints.createPayment.initiate(data)
        ).unwrap();
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  };

  // Process update operations
  const processUpdateOperation = async (operation, dispatch) => {
    const { entityType, entityId, data } = operation;
    
    // Handle different entity types
    switch (entityType) {
      case offlineQueue.ENTITY_TYPES.SHIPMENT:
        return dispatch(
          apiSlice.endpoints.updateShipment.initiate({ id: entityId, ...data })
        ).unwrap();
      case offlineQueue.ENTITY_TYPES.CUSTOMER:
        return dispatch(
          apiSlice.endpoints.updateCustomer.initiate({ id: entityId, ...data })
        ).unwrap();
      case offlineQueue.ENTITY_TYPES.PAYMENT:
        return dispatch(
          apiSlice.endpoints.updatePayment.initiate({ id: entityId, ...data })
        ).unwrap();
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  };

  // Process delete operations
  const processDeleteOperation = async (operation, dispatch) => {
    const { entityType, entityId } = operation;
    
    // Handle different entity types
    switch (entityType) {
      case offlineQueue.ENTITY_TYPES.SHIPMENT:
        return dispatch(
          apiSlice.endpoints.deleteShipment.initiate(entityId)
        ).unwrap();
      case offlineQueue.ENTITY_TYPES.CUSTOMER:
        return dispatch(
          apiSlice.endpoints.deleteCustomer.initiate(entityId)
        ).unwrap();
      case offlineQueue.ENTITY_TYPES.PAYMENT:
        return dispatch(
          apiSlice.endpoints.deletePayment.initiate(entityId)
        ).unwrap();
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  };

  // Set up event listeners for online/offline status
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Update initial pending operations count
    updatePendingOperations();
    
    // Add event listeners
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    window.addEventListener('offlineQueueUpdated', updatePendingOperations);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
      window.removeEventListener('offlineQueueUpdated', updatePendingOperations);
    };
  }, [handleOnlineStatusChange, updatePendingOperations]);

  return {
    isOnline,
    isSyncing,
    pendingOperations,
    syncPendingOperations,
  };
};

export default useNetworkStatus;
