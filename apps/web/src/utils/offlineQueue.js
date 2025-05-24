/**
 * Offline Queue Utility
 * Manages operations performed while offline for later synchronization
 */

// Queue storage key in IndexedDB
const QUEUE_STORAGE_KEY = 'offlineOperationsQueue';

// Operation types
export const OPERATION_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

// Entity types
export const ENTITY_TYPES = {
  SHIPMENT: 'shipment',
  CUSTOMER: 'customer',
  PAYMENT: 'payment',
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
};

/**
 * Initialize the offline queue
 * @returns {Promise<void>}
 */
const initializeQueue = async () => {
  if (typeof window === 'undefined') return;
  
  // Check if queue exists in localStorage
  if (!localStorage.getItem(QUEUE_STORAGE_KEY)) {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify([]));
  }
};

/**
 * Add an operation to the offline queue
 * @param {Object} operation - Operation to add to queue
 * @param {string} operation.type - Operation type (create, update, delete)
 * @param {string} operation.entityType - Entity type (shipment, customer, etc.)
 * @param {string} operation.entityId - Entity ID
 * @param {Object} operation.data - Operation data
 * @param {number} operation.timestamp - Operation timestamp
 * @returns {Promise<void>}
 */
const addToQueue = async (operation) => {
  if (typeof window === 'undefined') return;
  
  try {
    // Validate operation
    if (!operation.type || !operation.entityType) {
      console.error('Invalid operation:', operation);
      return;
    }
    
    // Get current queue
    const queue = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY) || '[]');
    
    // Add timestamp if not provided
    if (!operation.timestamp) {
      operation.timestamp = Date.now();
    }
    
    // Add operation to queue
    queue.push(operation);
    
    // Save updated queue
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    
    // Update queue size indicator
    updateQueueSizeIndicator();
    
    console.log('Operation added to offline queue:', operation);
  } catch (error) {
    console.error('Error adding operation to offline queue:', error);
  }
};

/**
 * Get all operations in the offline queue
 * @returns {Promise<Array>} - Array of operations
 */
const getQueue = async () => {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Error getting offline queue:', error);
    return [];
  }
};

/**
 * Clear the offline queue
 * @returns {Promise<void>}
 */
const clearQueue = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify([]));
    updateQueueSizeIndicator();
  } catch (error) {
    console.error('Error clearing offline queue:', error);
  }
};

/**
 * Remove an operation from the queue
 * @param {number} index - Index of operation to remove
 * @returns {Promise<void>}
 */
const removeFromQueue = async (index) => {
  if (typeof window === 'undefined') return;
  
  try {
    const queue = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY) || '[]');
    
    if (index >= 0 && index < queue.length) {
      queue.splice(index, 1);
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
      updateQueueSizeIndicator();
    }
  } catch (error) {
    console.error('Error removing operation from offline queue:', error);
  }
};

/**
 * Update queue size indicator in the UI
 */
const updateQueueSizeIndicator = () => {
  if (typeof window === 'undefined') return;
  
  try {
    const queue = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY) || '[]');
    const event = new CustomEvent('offlineQueueUpdated', { detail: { size: queue.length } });
    window.dispatchEvent(event);
  } catch (error) {
    console.error('Error updating queue size indicator:', error);
  }
};

/**
 * Process the offline queue when online
 * @param {Function} processFunction - Function to process each operation
 * @returns {Promise<Array>} - Array of results
 */
const processQueue = async (processFunction) => {
  if (typeof window === 'undefined') return [];
  
  try {
    const queue = JSON.parse(localStorage.getItem(QUEUE_STORAGE_KEY) || '[]');
    const results = [];
    
    // Sort queue by timestamp (oldest first)
    queue.sort((a, b) => a.timestamp - b.timestamp);
    
    // Process each operation
    for (let i = 0; i < queue.length; i++) {
      const operation = queue[i];
      
      try {
        // Process operation
        const result = await processFunction(operation);
        results.push({ success: true, operation, result });
        
        // Remove processed operation
        await removeFromQueue(0); // Always remove the first item since we're processing in order
      } catch (error) {
        console.error('Error processing operation:', operation, error);
        results.push({ success: false, operation, error });
        
        // If critical error, stop processing
        if (error.critical) {
          break;
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error processing offline queue:', error);
    return [];
  }
};

// Initialize queue on load
if (typeof window !== 'undefined') {
  initializeQueue();
}

// Export offline queue functions
export const offlineQueue = {
  addToQueue,
  getQueue,
  clearQueue,
  removeFromQueue,
  processQueue,
  OPERATION_TYPES,
  ENTITY_TYPES,
};

export default offlineQueue;
