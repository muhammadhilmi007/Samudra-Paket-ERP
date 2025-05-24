/**
 * Offline Middleware
 * Middleware for handling offline operations and synchronization
 */

import { offlineQueue } from '../../utils/offlineQueue';
import { isRejectedWithValue } from '@reduxjs/toolkit';

/**
 * Middleware that handles offline operations and synchronization
 */
export const offlineMiddleware = store => next => action => {
  // Check if action is a rejected API call due to network error
  if (isRejectedWithValue(action) && action.payload?.status === 'FETCH_ERROR') {
    // Check if we're offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.log('Network error detected in offline mode:', action);
      
      // For mutation actions, queue them for later if appropriate
      if (action.meta?.arg?.type === 'mutation') {
        const { endpoint, originalArgs } = action.meta.arg;
        
        // Determine entity type and operation type from the endpoint
        let entityType = 'unknown';
        let operationType = offlineQueue.OPERATION_TYPES.UPDATE;
        
        if (endpoint.startsWith('create')) {
          operationType = offlineQueue.OPERATION_TYPES.CREATE;
          entityType = endpoint.replace('create', '').toLowerCase();
        } else if (endpoint.startsWith('update')) {
          operationType = offlineQueue.OPERATION_TYPES.UPDATE;
          entityType = endpoint.replace('update', '').toLowerCase();
        } else if (endpoint.startsWith('delete')) {
          operationType = offlineQueue.OPERATION_TYPES.DELETE;
          entityType = endpoint.replace('delete', '').toLowerCase();
        }
        
        // Map entity type to offline queue entity types
        if (entityType.includes('shipment')) {
          entityType = offlineQueue.ENTITY_TYPES.SHIPMENT;
        } else if (entityType.includes('customer')) {
          entityType = offlineQueue.ENTITY_TYPES.CUSTOMER;
        } else if (entityType.includes('payment')) {
          entityType = offlineQueue.ENTITY_TYPES.PAYMENT;
        } else if (entityType.includes('delivery')) {
          entityType = offlineQueue.ENTITY_TYPES.DELIVERY;
        } else if (entityType.includes('pickup')) {
          entityType = offlineQueue.ENTITY_TYPES.PICKUP;
        }
        
        // Queue the operation
        offlineQueue.addToQueue({
          type: operationType,
          entityType,
          entityId: originalArgs.id,
          data: originalArgs,
          timestamp: Date.now(),
        });
        
        console.log(`Operation queued for offline synchronization: ${operationType} ${entityType}`);
        
        // Modify the action to indicate it was queued
        return next({
          ...action,
          meta: {
            ...action.meta,
            offlineQueued: true,
          },
        });
      }
    }
  }
  
  return next(action);
};

export default offlineMiddleware;
