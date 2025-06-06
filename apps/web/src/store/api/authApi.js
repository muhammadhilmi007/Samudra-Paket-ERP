"use client";

/**
 * Auth API
 * API endpoints for authentication-related operations
 */

import { apiSlice } from './apiSlice';
import { loginSuccess, loginFailure, logout } from '../slices/authSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(loginSuccess(data));
        } catch (error) {
          dispatch(loginFailure(error.error?.data?.message || 'Authentication failed'));
        }
      },
    }),
    
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (error) {
          // Even if the API call fails, we still want to log out the user locally
          dispatch(logout());
        }
      },
    }),
    
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { token, password },
      }),
    }),
    
    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: { currentPassword, newPassword },
      }),
    }),
    
    getProfile: builder.query({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),
    
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/auth/profile',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Login history and session management
    getLoginHistory: builder.query({
      query: () => '/auth/login-history',
      providesTags: ['LoginHistory'],
    }),
    
    terminateSession: builder.mutation({
      query: (sessionId) => ({
        url: `/auth/sessions/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LoginHistory'],
    }),
    
    // Security settings
    getSecuritySettings: builder.query({
      query: () => '/auth/security-settings',
      providesTags: ['SecuritySettings'],
    }),
    
    updateSecuritySettings: builder.mutation({
      query: (settings) => ({
        url: '/auth/security-settings',
        method: 'PATCH',
        body: settings,
      }),
      invalidatesTags: ['SecuritySettings'],
    }),
    
    // Trusted devices
    getTrustedDevices: builder.query({
      query: () => '/auth/trusted-devices',
      providesTags: ['TrustedDevices'],
    }),
    
    removeTrustedDevice: builder.mutation({
      query: (deviceId) => ({
        url: `/auth/trusted-devices/${deviceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TrustedDevices'],
    }),
    
    // Two-factor authentication
    setupTwoFactor: builder.mutation({
      query: (data) => ({
        url: '/auth/two-factor/setup',
        method: 'POST',
        body: data,
      }),
    }),
    
    verifyTwoFactor: builder.mutation({
      query: (code) => ({
        url: '/auth/two-factor/verify',
        method: 'POST',
        body: { code },
      }),
      invalidatesTags: ['SecuritySettings', 'User'],
    }),
    
    disableTwoFactor: builder.mutation({
      query: () => ({
        url: '/auth/two-factor/disable',
        method: 'POST',
      }),
      invalidatesTags: ['SecuritySettings', 'User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetLoginHistoryQuery,
  useTerminateSessionMutation,
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
  useGetTrustedDevicesQuery,
  useRemoveTrustedDeviceMutation,
  useSetupTwoFactorMutation,
  useVerifyTwoFactorMutation,
  useDisableTwoFactorMutation,
} = authApi;
