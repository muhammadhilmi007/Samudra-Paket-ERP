# Offline Functionality Documentation

This document outlines the offline functionality implementation in the Samudra Paket ERP system, focusing on state persistence and data synchronization.

## Overview

The Samudra Paket ERP system implements a comprehensive offline-first approach that enables:

1. **State Persistence**: Storing Redux state across page refreshes and app restarts
2. **Offline Operations**: Performing operations while offline
3. **Data Synchronization**: Synchronizing offline changes when back online
4. **Conflict Resolution**: Handling conflicts between offline and server data

## Architecture

The offline functionality is built on several key components:

### 1. Redux Persist

Redux Persist enables state persistence across app restarts:

- **Storage Adapters**: Hybrid storage system using localStorage and IndexedDB
- **Selective Persistence**: Whitelist/blacklist for specific slices
- **Security**: Encryption for sensitive data
- **Migrations**: Schema version tracking and migration support

### 2. Offline Queue

The offline queue manages operations performed while offline:

- **Operation Types**: Create, Update, Delete
- **Entity Types**: Shipment, Customer, Payment, Delivery, Pickup
- **Queue Management**: Add, remove, process operations
- **Synchronization**: Process queued operations when back online

### 3. Network Status Detection

Network status detection handles online/offline transitions:

- **Status Monitoring**: Detect online/offline status changes
- **Auto-Synchronization**: Trigger sync when back online
- **User Feedback**: Provide visual indicators of network status

### 4. API Client with Offline Support

The API client handles requests in both online and offline modes:

- **Request Interception**: Detect network errors and offline status
- **Request Queueing**: Queue mutating operations for later
- **Mock Responses**: Provide mock responses for offline operations

### 5. Redux Middleware

Middleware integrates offline functionality with Redux:

- **Action Interception**: Detect failed API calls due to network issues
- **Operation Queueing**: Queue operations for later synchronization
- **Action Modification**: Modify actions to indicate offline status

## Usage Guide

### Working with Offline-Enabled Components

#### 1. Detecting Network Status

Use the `useNetworkStatus` hook to detect network status:

```jsx
import { useNetworkStatus } from '../hooks/useNetworkStatus';

function MyComponent() {
  const { isOnline, isSyncing, pendingOperations, syncPendingOperations } = useNetworkStatus();
  
  return (
    <div>
      {!isOnline && <p>You are currently offline</p>}
      {pendingOperations > 0 && (
        <button onClick={syncPendingOperations}>
          Sync {pendingOperations} pending changes
        </button>
      )}
    </div>
  );
}
```

#### 2. Performing Offline Operations

Use the standard Redux Toolkit Query hooks for data operations:

```jsx
import { useCreateShipmentMutation } from '../store/api/shipmentApi';

function CreateShipmentForm() {
  const [createShipment, { isLoading, isError }] = useCreateShipmentMutation();
  
  const handleSubmit = async (data) => {
    try {
      // This will work both online and offline
      const result = await createShipment(data).unwrap();
      // Handle success
    } catch (error) {
      // Handle error
      if (error.meta?.offlineQueued) {
        // Operation was queued for later
        showNotification('Operation will be performed when back online');
      } else {
        // Other error
        showError('Failed to create shipment');
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

#### 3. Displaying Offline Status

Use the `OfflineIndicator` component to show offline status:

```jsx
import OfflineIndicator from '../components/molecules/OfflineIndicator';

function AppLayout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
      <OfflineIndicator />
    </div>
  );
}
```

### Implementing Offline Support for New Features

#### 1. Add Persistence Configuration

To add persistence for a new reducer:

```javascript
// In persistConfig.js
const newFeaturePersistConfig = {
  key: 'newFeature',
  storage,
  blacklist: ['temporaryState', 'error', 'loading'],
};

export { 
  rootPersistConfig, 
  authPersistConfig, 
  // ...other configs
  newFeaturePersistConfig 
};

// In store/index.js
const persistedNewFeatureReducer = persistReducer(
  newFeaturePersistConfig, 
  newFeatureReducer
);

const combinedReducers = combineReducers({
  // ...other reducers
  newFeature: persistedNewFeatureReducer,
});
```

#### 2. Add Entity Type to Offline Queue

To support a new entity type in the offline queue:

```javascript
// In utils/offlineQueue.js
export const ENTITY_TYPES = {
  // ...existing types
  NEW_ENTITY: 'newEntity',
};

// In hooks/useNetworkStatus.js
// Add case for the new entity type in processCreateOperation, 
// processUpdateOperation, and processDeleteOperation functions
```

#### 3. Update API Client for Offline Support

Ensure the API endpoints for the new feature work with the offline-enabled API client:

```javascript
// In store/api/newFeatureApi.js
import { apiSlice } from './apiSlice';

export const newFeatureApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNewFeatures: builder.query({
      query: () => '/new-features',
      providesTags: ['NewFeature'],
    }),
    createNewFeature: builder.mutation({
      query: (data) => ({
        url: '/new-features',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['NewFeature'],
    }),
    // ...other endpoints
  }),
});
```

## Best Practices

### 1. Data Synchronization

- **Prioritize Critical Data**: Sync important data first when coming back online
- **Handle Conflicts**: Implement proper conflict resolution strategies
- **Provide Feedback**: Show synchronization status to users

### 2. Storage Management

- **Limit Storage Size**: Be mindful of storage limits in browsers
- **Clean Up Old Data**: Implement data purging strategies
- **Monitor Usage**: Track storage usage to prevent quota issues

### 3. Security Considerations

- **Encrypt Sensitive Data**: Use encryption for sensitive information
- **Minimize Offline Storage**: Only store essential data offline
- **Clear Data on Logout**: Remove sensitive data when users log out

### 4. Performance Optimization

- **Selective Persistence**: Use whitelist/blacklist to minimize storage size
- **Debounce Writes**: Reduce storage writes for frequently changing state
- **Optimize Serialization**: Use efficient serialization for large objects

## Troubleshooting

### Common Issues

1. **Storage Quota Exceeded**
   - Symptom: Storage operations fail
   - Solution: Implement storage limits, purge old data

2. **Synchronization Conflicts**
   - Symptom: Data inconsistencies after coming online
   - Solution: Implement proper conflict resolution strategies

3. **Stale Data**
   - Symptom: Outdated data displayed to users
   - Solution: Implement cache invalidation and refresh mechanisms

### Debugging Tools

1. **Redux DevTools**: Inspect Redux state and actions
2. **Browser DevTools**: Examine localStorage and IndexedDB storage
3. **Network Panel**: Monitor API requests and offline status

## Conclusion

The offline functionality in Samudra Paket ERP provides a robust solution for field operations in areas with limited connectivity. By following the guidelines in this document, developers can leverage these capabilities and extend them for new features.
