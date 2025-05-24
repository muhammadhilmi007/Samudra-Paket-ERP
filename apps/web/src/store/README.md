# Redux Persist Implementation for Offline State Persistence

This document outlines the implementation of Redux Persist for offline state persistence in the Samudra Paket ERP system.

## Overview

The offline state persistence system enables the application to:
- Store and retrieve state data across page refreshes and app restarts
- Securely handle sensitive data with encryption
- Support offline operations with data synchronization
- Handle large datasets efficiently
- Migrate state schema across versions

## Architecture

### Storage Adapters

The system uses a hybrid storage approach:
- **localStorage**: For smaller datasets (faster access)
- **IndexedDB**: For larger datasets (higher capacity)

The storage adapter automatically selects the appropriate storage mechanism based on data size.

### Persistence Configuration

The persistence configuration is defined in `persistConfig.js` and includes:

1. **Root Configuration**:
   - Whitelist/blacklist for specific reducers
   - State reconciliation strategy
   - Migration configuration
   - Transforms for serialization/deserialization

2. **Slice-Specific Configurations**:
   - **Auth**: Securely stores authentication tokens with encryption
   - **Finance**: Handles sensitive financial data with selective persistence
   - **Shipment**: Manages shipment data with date transformations
   - **Settings**: Preserves user preferences

### Security Measures

Sensitive data is protected through:
- Field-level encryption for tokens and payment information
- Slice-level encryption for entire state objects
- Selective persistence to exclude sensitive fields
- Environment variable-based encryption keys

### Data Transformations

Custom transforms handle:
- Date objects (serialization/deserialization)
- Sensitive data encryption/decryption
- State schema migrations

## Usage Guidelines

### Persisting a New Reducer

To add persistence to a new reducer:

1. Create a persist configuration in `persistConfig.js`:
   ```javascript
   const newFeaturePersistConfig = {
     key: 'newFeature',
     storage,
     blacklist: ['sensitiveField', 'temporaryState'],
     transforms: [/* transforms */],
   };
   ```

2. Export the configuration:
   ```javascript
   export { rootPersistConfig, authPersistConfig, ..., newFeaturePersistConfig };
   ```

3. Create a persisted reducer in `store/index.js`:
   ```javascript
   const persistedNewFeatureReducer = persistReducer(newFeaturePersistConfig, newFeatureReducer);
   ```

4. Add it to the combined reducers:
   ```javascript
   const combinedReducers = combineReducers({
     // ...other reducers
     newFeature: persistedNewFeatureReducer,
   });
   ```

### Handling Sensitive Data

For sensitive data:
1. Add fields to the `blacklist` array in the persist configuration
2. For fields that need to be stored but encrypted, create a custom transform
3. Use the encryption utilities provided in the transforms

### Offline Synchronization

The persistence system works with the offline synchronization system:
1. Changes made offline are stored in the persisted state
2. When the application comes back online, the synchronization system processes the queued changes
3. Conflicts are resolved based on the defined reconciliation strategy

## Implementation Details

### Storage Adapters

- `persistStorage.js`: Safe storage adapter for SSR compatibility
- `indexedDBStorage.js`: IndexedDB storage adapter for larger datasets
- `hybridStorage.js`: Intelligent storage selection based on data size

### Transforms

- `dateTransform`: Handles Date objects serialization/deserialization
- Custom encryption transforms: Secure sensitive data

### Migration

The system supports state schema migrations through:
- Version tracking
- Migration functions for each version change
- Automatic migration application during rehydration

## Security Considerations

- Encryption keys should be stored in environment variables
- Sensitive data should be either excluded from persistence or encrypted
- Token expiration should be enforced regardless of persistence
- Clear persisted state on logout for sensitive applications

## Performance Considerations

- Use selective persistence (whitelist/blacklist) to minimize storage size
- Large collections should be paginated or excluded from persistence
- Consider using the debounce option for frequently changing state
- Monitor storage usage in different browsers and devices
