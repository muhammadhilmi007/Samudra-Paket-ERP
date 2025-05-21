/**
 * Settings Slice
 * Redux state management for application-wide settings
 */

import { createSlice } from '@reduxjs/toolkit';

// Detect initial language from browser or localStorage
const detectInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    // First check localStorage
    const savedLanguage = localStorage.getItem('NEXT_LOCALE');
    if (savedLanguage) {
      return savedLanguage;
    }
    
    // Then check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
      // Extract the language code (e.g., 'en-US' -> 'en')
      const langCode = browserLang.split('-')[0];
      // Return the language if it's supported
      if (['id', 'en'].includes(langCode)) {
        return langCode;
      }
    }
  }
  
  // Default to Indonesian
  return 'id';
};

const initialState = {
  // Language preference
  language: typeof window !== 'undefined' ? detectInitialLanguage() : 'id',
  theme: 'light', // 'light', 'dark', or 'system'
  // UI preferences
  uiPreferences: {
    density: 'comfortable', // 'comfortable', 'compact', or 'spacious'
    fontSize: 'medium', // 'small', 'medium', or 'large'
    animations: true,
    sidebarCollapsed: false,
    tableRowsPerPage: 10,
  },
  
  generalSettings: {
    companyName: 'PT. Sarana Mudah Raya',
    companyLogo: '/images/logo.png',
    defaultLanguage: 'id',
    defaultTimezone: 'Asia/Jakarta',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currencyFormat: 'Rp {amount}',
  },
  systemSettings: {
    maintenanceMode: false,
    debugMode: false,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api',
    maxUploadSize: 10, // in MB
    sessionTimeout: 30, // in minutes
    backupFrequency: 'daily',
  },
  notificationSettings: {
    emailNotifications: {
      enabled: true,
      templates: {
        shipmentCreated: true,
        shipmentDelivered: true,
        paymentReceived: true,
        invoiceCreated: true,
        invoiceOverdue: true,
      },
    },
    smsNotifications: {
      enabled: false,
      templates: {
        shipmentCreated: false,
        shipmentDelivered: true,
        paymentReceived: false,
        invoiceCreated: false,
        invoiceOverdue: true,
      },
    },
    pushNotifications: {
      enabled: true,
      templates: {
        shipmentCreated: true,
        shipmentDelivered: true,
        paymentReceived: true,
        invoiceCreated: true,
        invoiceOverdue: true,
      },
    },
  },
  integrationSettings: {
    paymentGateways: {
      midtrans: {
        enabled: false,
        clientKey: '',
        serverKey: '',
        sandboxMode: true,
      },
      xendit: {
        enabled: false,
        apiKey: '',
        sandboxMode: true,
      },
    },
    maps: {
      googleMaps: {
        enabled: true,
        apiKey: '',
      },
      mapbox: {
        enabled: false,
        accessToken: '',
      },
    },
    sms: {
      twilio: {
        enabled: false,
        accountSid: '',
        authToken: '',
        fromNumber: '',
      },
    },
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Update language preference
    setLanguage(state, action) {
      state.language = action.payload;
    },
    
    // Update theme preference
    setTheme(state, action) {
      state.theme = action.payload;
    },
    
    // Toggle theme between light and dark
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // Update UI preferences
    updateUiPreferences(state, action) {
      state.uiPreferences = {
        ...state.uiPreferences,
        ...action.payload,
      };
    },
    
    // Toggle sidebar collapsed state
    toggleSidebar(state) {
      state.uiPreferences.sidebarCollapsed = !state.uiPreferences.sidebarCollapsed;
    },
    
    // Update general settings
    updateGeneralSettings: (state, action) => {
      state.generalSettings = {
        ...state.generalSettings,
        ...action.payload,
      };
    },
    
    // Update system settings
    updateSystemSettings: (state, action) => {
      state.systemSettings = {
        ...state.systemSettings,
        ...action.payload,
      };
    },
    
    // Toggle maintenance mode
    toggleMaintenanceMode: (state) => {
      state.systemSettings.maintenanceMode = !state.systemSettings.maintenanceMode;
    },
    
    // Toggle debug mode
    toggleDebugMode: (state) => {
      state.systemSettings.debugMode = !state.systemSettings.debugMode;
    },
    
    // Update notification settings
    updateNotificationSettings: (state, action) => {
      state.notificationSettings = {
        ...state.notificationSettings,
        ...action.payload,
      };
    },
    
    // Update email notification settings
    updateEmailNotificationSettings: (state, action) => {
      state.notificationSettings.emailNotifications = {
        ...state.notificationSettings.emailNotifications,
        ...action.payload,
      };
    },
    
    // Update SMS notification settings
    updateSmsNotificationSettings: (state, action) => {
      state.notificationSettings.smsNotifications = {
        ...state.notificationSettings.smsNotifications,
        ...action.payload,
      };
    },
    
    // Update push notification settings
    updatePushNotificationSettings: (state, action) => {
      state.notificationSettings.pushNotifications = {
        ...state.notificationSettings.pushNotifications,
        ...action.payload,
      };
    },
    
    // Update integration settings
    updateIntegrationSettings: (state, action) => {
      state.integrationSettings = {
        ...state.integrationSettings,
        ...action.payload,
      };
    },
    
    // Update payment gateway settings
    updatePaymentGatewaySettings: (state, action) => {
      const { gateway, settings } = action.payload;
      state.integrationSettings.paymentGateways[gateway] = {
        ...state.integrationSettings.paymentGateways[gateway],
        ...settings,
      };
    },
    
    // Update maps settings
    updateMapsSettings: (state, action) => {
      const { provider, settings } = action.payload;
      state.integrationSettings.maps[provider] = {
        ...state.integrationSettings.maps[provider],
        ...settings,
      };
    },
    
    // Update SMS settings
    updateSmsSettings: (state, action) => {
      const { provider, settings } = action.payload;
      state.integrationSettings.sms[provider] = {
        ...state.integrationSettings.sms[provider],
        ...settings,
      };
    },
    
    // Reset all settings to defaults
    resetSettings: (state) => {
      return initialState;
    },
  },
  // We'll add extraReducers when we create the settings API endpoints
});

// Export actions
export const {
  setLanguage,
  setTheme,
  toggleTheme,
  updateUiPreferences,
  toggleSidebar,
  updateGeneralSettings,
  updateSystemSettings,
  toggleMaintenanceMode,
  toggleDebugMode,
  updateNotificationSettings,
  updateEmailNotificationSettings,
  updateSmsNotificationSettings,
  updatePushNotificationSettings,
  updateIntegrationSettings,
  updatePaymentGatewaySettings,
  updateMapsSettings,
  updateSmsSettings,
  resetSettings,
} = settingsSlice.actions;

// Export selectors with settings-specific names
export const selectSettingsLanguage = (state) => state.settings.language;
export const selectSettingsTheme = (state) => state.settings.theme;
export const selectUiPreferences = (state) => state.settings.uiPreferences;
export const selectGeneralSettings = (state) => state.settings.generalSettings;
export const selectSystemSettings = (state) => state.settings.systemSettings;
export const selectNotificationSettings = (state) => state.settings.notificationSettings;
export const selectIntegrationSettings = (state) => state.settings.integrationSettings;
export const selectPaymentGateways = (state) => state.settings.integrationSettings.paymentGateways;
export const selectMapsSettings = (state) => state.settings.integrationSettings.maps;
export const selectSmsSettings = (state) => state.settings.integrationSettings.sms;

// Export reducer
export default settingsSlice.reducer;
