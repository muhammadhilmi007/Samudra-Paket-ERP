"use client";

/**
 * API Slice
 * RTK Query API definition for handling API requests with offline support
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import apiClientWithOffline from '../../utils/apiClientWithOffline';
import { offlineQueue } from '../../utils/offlineQueue';

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
  fetchFn: async (input, init) => {
    // Check if offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      // For mutations, use the offline-enabled API client
      if (init.method !== 'GET') {
        try {
          // Convert fetch request to axios format
          const url = typeof input === 'string' ? input : input.url;
          const response = await apiClientWithOffline({
            url: url.replace(baseUrl, ''),
            method: init.method,
            data: init.body ? JSON.parse(init.body) : undefined,
            headers: init.headers,
          });
          
          // Convert axios response to fetch response format
          return new Response(JSON.stringify(response.data), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          });
        } catch (error) {
          console.error('Offline API request error:', error);
          // Return a failed response
          return new Response(JSON.stringify({ error: 'Offline operation failed' }), {
            status: 503,
            statusText: 'Service Unavailable (Offline)',
          });
        }
      }
    }
    
    // Online or GET request: use default fetch
    return fetch(input, init);
  },
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
