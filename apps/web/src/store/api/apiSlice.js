"use client";

/**
 * API Slice
 * RTK Query API definition for handling API requests
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL for API requests
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

// Create a base query with authentication headers
const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    // Get the token from the auth state
    const token = getState().auth.token;
    
    // If we have a token, add it to the headers
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
  credentials: 'include', // Include cookies in the requests
});

// Create the API slice - export as empty API first to avoid circular dependencies
// Each API file will inject its endpoints using injectEndpoints
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    // Entity tags
    'Shipment', 
    'User', 
    'Customer', 
    'Pickup', 
    'Delivery', 
    'Invoice',
    'Payment',
    'Report',
    
    // Settings tags
    'Settings',
    'GeneralSettings',
    'SystemSettings',
    'NotificationSettings',
    'IntegrationSettings',
    'PaymentGateway',
    'Maps',
    'Sms',
    
    // User-related tags
    'UserPreferences',
    'UserNotifications',
    'UserRoles'
  ],
  endpoints: (builder) => ({}),
});

// Export hooks for usage in functional components
export const {
  endpoints,
  util: { getRunningQueriesThunk },
  reducer,
  middleware,
  useQueryState,
  useLazyQuerySubscription,
  useQuerySubscription,
} = apiSlice;
