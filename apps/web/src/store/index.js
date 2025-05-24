/**
 * Redux Store Configuration
 * Central state management for the application with offline persistence
 */

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import offlineMiddleware from './middleware/offlineMiddleware';

// Import persist configuration
import { 
  rootPersistConfig, 
  authPersistConfig, 
  financePersistConfig, 
  shipmentPersistConfig 
} from './persistConfig';

// Import reducers
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import shipmentReducer from './slices/shipmentSlice';
import customerReducer from './slices/customerSlice';
import financeReducer from './slices/financeSlice';
import userReducer from './slices/userSlice';
import settingsReducer from './slices/settingsSlice';

// Import API slice and initializer
import { apiSlice } from './api/apiSlice';
import initializeStore from './storeInitializer';

// Create persisted reducers with their own configurations
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedShipmentReducer = persistReducer(shipmentPersistConfig, shipmentReducer);
const persistedFinanceReducer = persistReducer(financePersistConfig, financeReducer);

// Combine all reducers
const combinedReducers = combineReducers({
  // Feature slices with persistence
  auth: persistedAuthReducer,
  ui: uiReducer,
  shipment: persistedShipmentReducer,
  customer: customerReducer,
  finance: persistedFinanceReducer,
  user: userReducer,
  settings: settingsReducer,
  
  // API slice
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// Create a root reducer with persistence
const rootReducer = (state, action) => {
  // Handle special actions like logout
  if (action.type === 'auth/logout') {
    // Keep some state when logging out if needed
    const { settings } = state;
    state = { settings };
  }
  
  return combinedReducers(state, action);
};

// Create the persisted reducer
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

/**
 * Configure the Redux store with all reducers and middleware
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Ignore serializability checks for Redux Persist actions
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
    .concat(apiSlice.middleware)
    .concat(offlineMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create the persistor
export const persistor = persistStore(store);

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Initialize store with all API slices
initializeStore(store);

// Store and persistor are already exported above

// Re-export the API slice
export { apiSlice } from './api/apiSlice';

// Instead of star exports, import and re-export specific slices
// This prevents naming conflicts between slices

// Auth slice - import and re-export with namespace
import * as authActions from './slices/authSlice';
export { authActions };

// UI slice - import and re-export with namespace
import * as uiActions from './slices/uiSlice';
export { uiActions };

// Shipment slice - import and re-export with namespace
import * as shipmentActions from './slices/shipmentSlice';
export { shipmentActions };

// Customer slice - import and re-export with namespace
import * as customerActions from './slices/customerSlice';
export { customerActions };

// Finance slice - import and re-export with namespace
import * as financeActions from './slices/financeSlice';
export { financeActions };

// User slice - import and re-export with namespace
import * as userActions from './slices/userSlice';
export { userActions };

// Settings slice - import and re-export with namespace
import * as settingsActions from './slices/settingsSlice';
export { settingsActions };

// No default export needed as we're using named exports
