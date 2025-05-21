/**
 * Redux Persist Configuration
 * Configures storage adapter and serialization for offline state persistence
 */

// Import custom storage adapter that safely handles SSR
import storage from '../utils/persistStorage';
import { createTransform } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';

// Define which parts of the state should be persisted
const rootPersistConfig = {
  key: 'root',
  storage,
  // Whitelist specific reducers to persist (empty means all are persisted)
  whitelist: ['auth', 'customer', 'shipment', 'settings'],
  // Blacklist specific reducers to NOT persist
  blacklist: ['api', 'notification', 'ui'],
  // Add transforms for serialization/deserialization if needed
  transforms: [],
};

// Create auth persist config with selective persistence for sensitive data
const authPersistConfig = {
  key: 'auth',
  storage,
  // Blacklist sensitive fields from auth state
  blacklist: ['error', 'loading', 'passwordResetToken'],
  // Add encryption for sensitive data
  transforms: [
    // Optional: Add encryption transform if encryption key is available
    process.env.NEXT_PUBLIC_PERSIST_ENCRYPTION_KEY
      ? encryptTransform({
          secretKey: process.env.NEXT_PUBLIC_PERSIST_ENCRYPTION_KEY,
          onError: (error) => {
            console.error('Redux Persist Encryption Error:', error);
          },
        })
      : null,
  ].filter(Boolean), // Filter out null values
};

// Create a transform to handle serialization of Date objects
const dateTransform = createTransform(
  // Transform state on its way to being serialized and persisted
  (inboundState, key) => {
    // Convert Date objects to ISO strings for storage
    if (!inboundState) return inboundState;
    
    const transformed = { ...inboundState };
    
    // Handle dates in different state shapes
    if (key === 'shipment' && transformed.selectedShipment) {
      if (transformed.selectedShipment.createdAt instanceof Date) {
        transformed.selectedShipment.createdAt = transformed.selectedShipment.createdAt.toISOString();
      }
      if (transformed.selectedShipment.updatedAt instanceof Date) {
        transformed.selectedShipment.updatedAt = transformed.selectedShipment.updatedAt.toISOString();
      }
      if (transformed.selectedShipment.estimatedDelivery instanceof Date) {
        transformed.selectedShipment.estimatedDelivery = transformed.selectedShipment.estimatedDelivery.toISOString();
      }
    }
    
    return transformed;
  },
  // Transform state being rehydrated
  (outboundState, key) => {
    // Convert ISO strings back to Date objects
    if (!outboundState) return outboundState;
    
    const transformed = { ...outboundState };
    
    // Handle dates in different state shapes
    if (key === 'shipment' && transformed.selectedShipment) {
      if (typeof transformed.selectedShipment.createdAt === 'string') {
        transformed.selectedShipment.createdAt = new Date(transformed.selectedShipment.createdAt);
      }
      if (typeof transformed.selectedShipment.updatedAt === 'string') {
        transformed.selectedShipment.updatedAt = new Date(transformed.selectedShipment.updatedAt);
      }
      if (typeof transformed.selectedShipment.estimatedDelivery === 'string') {
        transformed.selectedShipment.estimatedDelivery = new Date(transformed.selectedShipment.estimatedDelivery);
      }
    }
    
    return transformed;
  },
  // The 'shipment' reducer handles Date objects that need special treatment
  { whitelist: ['shipment'] }
);

// Add the dateTransform to the root transforms
rootPersistConfig.transforms.push(dateTransform);

// Create a migration object to handle version changes
const migrations = {
  // Migration for version 0 to version 1
  0: (state) => {
    // Return a new state with any necessary changes for migration
    return {
      ...state,
      // Example: Add a new field or modify existing ones
      auth: state.auth ? {
        ...state.auth,
        // Add new fields or modify existing ones
        migrationVersion: 1,
      } : undefined,
    };
  },
  // Add more migrations as needed
};

// Add migration configuration
rootPersistConfig.migrate = (state, currentVersion) => {
  // Apply migrations sequentially from the current version to the latest
  let newState = { ...state };
  
  for (let version = currentVersion; version < Object.keys(migrations).length; version++) {
    if (migrations[version]) {
      newState = migrations[version](newState);
    }
  }
  
  // Return a Promise to resolve the migrated state
  return Promise.resolve(newState);
};

// Current version of the persisted state schema
rootPersistConfig.version = 1;

export { rootPersistConfig, authPersistConfig };
