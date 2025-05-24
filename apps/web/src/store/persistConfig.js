/**
 * Redux Persist Configuration
 * Configures storage adapter and serialization for offline state persistence
 */

// Import hybrid storage adapter that handles both small and large datasets
import storage from '../utils/hybridStorage';
import { createTransform } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';

// Import crypto utilities for additional encryption
import CryptoJS from 'crypto-js';

// Define which parts of the state should be persisted
const rootPersistConfig = {
  key: 'root',
  storage,
  // Whitelist specific reducers to persist (empty means all are persisted)
  whitelist: ['auth', 'customer', 'shipment', 'settings', 'finance', 'user'],
  // Blacklist specific reducers to NOT persist
  blacklist: ['api', 'notification', 'ui'],
  // Add transforms for serialization/deserialization if needed
  transforms: [],
  // Debounce writes to storage to improve performance
  debounce: 500,
  // Stale time in milliseconds before revalidating data
  stateReconciler: (inboundState, originalState, reducedState, config) => {
    // Custom state reconciler to handle merging server and client state
    // For most reducers, prefer the inbound (persisted) state
    const newState = { ...reducedState };
    
    // Process each reducer in the whitelist
    Object.keys(inboundState).forEach(key => {
      if (config.whitelist && config.whitelist.indexOf(key) !== -1) {
        newState[key] = inboundState[key];
      }
    });
    
    return newState;
  },
};

// Create auth persist config with selective persistence for sensitive data
const authPersistConfig = {
  key: 'auth',
  storage,
  // Blacklist sensitive fields from auth state
  blacklist: ['error', 'loading', 'passwordResetToken', 'loginAttempts'],
  // Add encryption for sensitive data
  transforms: [
    // Create a transform to handle sensitive data
    createTransform(
      // Encrypt sensitive data before storing
      (inboundState) => {
        if (!inboundState) return inboundState;
        
        // Create a copy of the state to avoid mutating the original
        const safeState = { ...inboundState };
        
        // Encrypt tokens if they exist
        if (safeState.accessToken) {
          safeState.accessToken = CryptoJS.AES.encrypt(
            safeState.accessToken,
            process.env.NEXT_PUBLIC_PERSIST_ENCRYPTION_KEY || 'fallback-key-samudra-erp'
          ).toString();
        }
        
        if (safeState.refreshToken) {
          safeState.refreshToken = CryptoJS.AES.encrypt(
            safeState.refreshToken,
            process.env.NEXT_PUBLIC_PERSIST_ENCRYPTION_KEY || 'fallback-key-samudra-erp'
          ).toString();
        }
        
        return safeState;
      },
      // Decrypt sensitive data when retrieving
      (outboundState) => {
        if (!outboundState) return outboundState;
        
        // Create a copy of the state to avoid mutating the original
        const decryptedState = { ...outboundState };
        
        // Decrypt tokens if they exist and are encrypted
        if (decryptedState.accessToken && typeof decryptedState.accessToken === 'string') {
          try {
            const bytes = CryptoJS.AES.decrypt(
              decryptedState.accessToken,
              process.env.NEXT_PUBLIC_PERSIST_ENCRYPTION_KEY || 'fallback-key-samudra-erp'
            );
            decryptedState.accessToken = bytes.toString(CryptoJS.enc.Utf8);
          } catch (error) {
            console.error('Error decrypting access token:', error);
            // If decryption fails, clear the token
            decryptedState.accessToken = null;
          }
        }
        
        if (decryptedState.refreshToken && typeof decryptedState.refreshToken === 'string') {
          try {
            const bytes = CryptoJS.AES.decrypt(
              decryptedState.refreshToken,
              process.env.NEXT_PUBLIC_PERSIST_ENCRYPTION_KEY || 'fallback-key-samudra-erp'
            );
            decryptedState.refreshToken = bytes.toString(CryptoJS.enc.Utf8);
          } catch (error) {
            console.error('Error decrypting refresh token:', error);
            // If decryption fails, clear the token
            decryptedState.refreshToken = null;
          }
        }
        
        return decryptedState;
      },
      // Options object - specify which reducer this transform applies to
      { whitelist: ['auth'] }
    ),
    // Additional encryption for the entire auth state
    process.env.NEXT_PUBLIC_PERSIST_ENCRYPTION_KEY
      ? encryptTransform({
          secretKey: process.env.NEXT_PUBLIC_PERSIST_ENCRYPTION_KEY || 'fallback-key-samudra-erp',
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

// Create finance persist config with selective persistence for sensitive financial data
const financePersistConfig = {
  key: 'finance',
  storage,
  // Blacklist sensitive fields and temporary UI state
  blacklist: ['error', 'loading', 'transactionDetails'],
  // Add encryption for sensitive financial data
  transforms: [
    // Create a transform to handle sensitive financial data
    createTransform(
      // Encrypt sensitive data before storing
      (inboundState) => {
        if (!inboundState) return inboundState;
        
        // Create a copy of the state to avoid mutating the original
        const safeState = { ...inboundState };
        
        // Encrypt payment information if it exists
        if (safeState.paymentMethods && safeState.paymentMethods.length) {
          safeState.paymentMethods = safeState.paymentMethods.map(method => {
            if (method.cardNumber) {
              return {
                ...method,
                cardNumber: CryptoJS.AES.encrypt(
                  method.cardNumber,
                  process.env.NEXT_PUBLIC_PERSIST_ENCRYPTION_KEY || 'fallback-key-samudra-erp'
                ).toString(),
                // Only store last 4 digits in clear text
                lastFourDigits: method.cardNumber.slice(-4)
              };
            }
            return method;
          });
        }
        
        return safeState;
      },
      // Decrypt sensitive data when retrieving
      (outboundState) => {
        if (!outboundState) return outboundState;
        
        // Create a copy of the state to avoid mutating the original
        const decryptedState = { ...outboundState };
        
        // Decrypt payment information if it exists
        if (decryptedState.paymentMethods && decryptedState.paymentMethods.length) {
          decryptedState.paymentMethods = decryptedState.paymentMethods.map(method => {
            if (method.cardNumber && typeof method.cardNumber === 'string' && method.cardNumber.length > 10) {
              try {
                const bytes = CryptoJS.AES.decrypt(
                  method.cardNumber,
                  process.env.NEXT_PUBLIC_PERSIST_ENCRYPTION_KEY || 'fallback-key-samudra-erp'
                );
                return {
                  ...method,
                  cardNumber: bytes.toString(CryptoJS.enc.Utf8)
                };
              } catch (error) {
                console.error('Error decrypting card number:', error);
                // If decryption fails, keep the encrypted version
                return method;
              }
            }
            return method;
          });
        }
        
        return decryptedState;
      },
      // Options object - specify which reducer this transform applies to
      { whitelist: ['finance'] }
    )
  ],
};

// Create shipment persist config with selective persistence
const shipmentPersistConfig = {
  key: 'shipment',
  storage,
  // Blacklist temporary UI state and large datasets
  blacklist: ['error', 'loading', 'allShipments'],
  // Add transforms for serialization/deserialization
  transforms: [
    // Date transform is already applied to shipment data
  ],
};

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

export { 
  rootPersistConfig, 
  authPersistConfig, 
  financePersistConfig, 
  shipmentPersistConfig 
};
