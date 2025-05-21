/**
 * Redux Provider Component
 * Provides Redux store to the entire application with state persistence
 */

'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/index';

/**
 * Redux Provider component that wraps the application with the Redux store
 * This enables all components to access the global state
 * The PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
 */
const ReduxProvider = ({ children }) => {
  // Create a loading component with proper styling
  const LoadingComponent = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading application...</p>
      </div>
    </div>
  );

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
