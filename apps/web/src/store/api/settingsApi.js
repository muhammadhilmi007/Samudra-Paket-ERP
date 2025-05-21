/**
 * Settings API
 * API endpoints for application settings operations
 */

import { apiSlice } from './apiSlice';

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all settings
    getSettings: builder.query({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    
    // Get general settings
    getGeneralSettings: builder.query({
      query: () => '/settings/general',
      providesTags: ['GeneralSettings'],
    }),
    
    // Update general settings
    updateGeneralSettings: builder.mutation({
      query: (settingsData) => ({
        url: '/settings/general',
        method: 'PATCH',
        body: settingsData,
      }),
      invalidatesTags: ['GeneralSettings', 'Settings'],
    }),
    
    // Get system settings
    getSystemSettings: builder.query({
      query: () => '/settings/system',
      providesTags: ['SystemSettings'],
    }),
    
    // Update system settings
    updateSystemSettings: builder.mutation({
      query: (settingsData) => ({
        url: '/settings/system',
        method: 'PATCH',
        body: settingsData,
      }),
      invalidatesTags: ['SystemSettings', 'Settings'],
    }),
    
    // Get notification settings
    getNotificationSettings: builder.query({
      query: () => '/settings/notifications',
      providesTags: ['NotificationSettings'],
    }),
    
    // Update notification settings
    updateNotificationSettings: builder.mutation({
      query: (settingsData) => ({
        url: '/settings/notifications',
        method: 'PATCH',
        body: settingsData,
      }),
      invalidatesTags: ['NotificationSettings', 'Settings'],
    }),
    
    // Get integration settings
    getIntegrationSettings: builder.query({
      query: () => '/settings/integrations',
      providesTags: ['IntegrationSettings'],
    }),
    
    // Update integration settings
    updateIntegrationSettings: builder.mutation({
      query: (settingsData) => ({
        url: '/settings/integrations',
        method: 'PATCH',
        body: settingsData,
      }),
      invalidatesTags: ['IntegrationSettings', 'Settings'],
    }),
    
    // Get payment gateway settings
    getPaymentGatewaySettings: builder.query({
      query: (gateway) => `/settings/integrations/payment-gateways/${gateway}`,
      providesTags: (result, error, gateway) => [
        { type: 'PaymentGateway', id: gateway },
        'IntegrationSettings',
      ],
    }),
    
    // Update payment gateway settings
    updatePaymentGatewaySettings: builder.mutation({
      query: ({ gateway, settings }) => ({
        url: `/settings/integrations/payment-gateways/${gateway}`,
        method: 'PATCH',
        body: settings,
      }),
      invalidatesTags: (result, error, { gateway }) => [
        { type: 'PaymentGateway', id: gateway },
        'IntegrationSettings',
        'Settings',
      ],
    }),
    
    // Get maps settings
    getMapsSettings: builder.query({
      query: (provider) => `/settings/integrations/maps/${provider}`,
      providesTags: (result, error, provider) => [
        { type: 'Maps', id: provider },
        'IntegrationSettings',
      ],
    }),
    
    // Update maps settings
    updateMapsSettings: builder.mutation({
      query: ({ provider, settings }) => ({
        url: `/settings/integrations/maps/${provider}`,
        method: 'PATCH',
        body: settings,
      }),
      invalidatesTags: (result, error, { provider }) => [
        { type: 'Maps', id: provider },
        'IntegrationSettings',
        'Settings',
      ],
    }),
    
    // Get SMS settings
    getSmsSettings: builder.query({
      query: (provider) => `/settings/integrations/sms/${provider}`,
      providesTags: (result, error, provider) => [
        { type: 'Sms', id: provider },
        'IntegrationSettings',
      ],
    }),
    
    // Update SMS settings
    updateSmsSettings: builder.mutation({
      query: ({ provider, settings }) => ({
        url: `/settings/integrations/sms/${provider}`,
        method: 'PATCH',
        body: settings,
      }),
      invalidatesTags: (result, error, { provider }) => [
        { type: 'Sms', id: provider },
        'IntegrationSettings',
        'Settings',
      ],
    }),
    
    // Upload company logo
    uploadCompanyLogo: builder.mutation({
      query: (formData) => ({
        url: '/settings/general/logo',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['GeneralSettings', 'Settings'],
    }),
    
    // Reset settings to defaults
    resetSettings: builder.mutation({
      query: () => ({
        url: '/settings/reset',
        method: 'POST',
      }),
      invalidatesTags: [
        'Settings',
        'GeneralSettings',
        'SystemSettings',
        'NotificationSettings',
        'IntegrationSettings',
      ],
    }),
  }),
});

export const {
  // General settings hooks
  useGetSettingsQuery,
  useGetGeneralSettingsQuery,
  useUpdateGeneralSettingsQuery,
  
  // System settings hooks
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  
  // Notification settings hooks
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  
  // Integration settings hooks
  useGetIntegrationSettingsQuery,
  useUpdateIntegrationSettingsMutation,
  
  // Payment gateway settings hooks
  useGetPaymentGatewaySettingsQuery,
  useUpdatePaymentGatewaySettingsMutation,
  
  // Maps settings hooks
  useGetMapsSettingsQuery,
  useUpdateMapsSettingsMutation,
  
  // SMS settings hooks
  useGetSmsSettingsQuery,
  useUpdateSmsSettingsMutation,
  
  // Logo upload hook
  useUploadCompanyLogoMutation,
  
  // Reset settings hook
  useResetSettingsMutation,
} = settingsApi;
