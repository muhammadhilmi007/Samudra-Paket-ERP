/**
 * API Configuration
 * Centralized configuration for API endpoints and services
 */

// Base API URL from environment variable or default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// API version
const API_VERSION = 'v1';

// Service endpoints
const ENDPOINTS = {
  // Auth Service endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // Core Service endpoints
  CORE: {
    // User endpoints
    USERS: '/users',
    USER_DETAIL: (id) => `/users/${id}`,
    USER_PROFILE: '/users/profile',
    
    // Customer endpoints
    CUSTOMERS: '/customers',
    CUSTOMER_DETAIL: (id) => `/customers/${id}`,
    
    // Shipment endpoints
    SHIPMENTS: '/shipments',
    SHIPMENT_DETAIL: (id) => `/shipments/${id}`,
    SHIPMENT_TRACKING: (trackingNumber) => `/shipments/tracking/${trackingNumber}`,
    
    // Pickup endpoints
    PICKUPS: '/pickups',
    PICKUP_DETAIL: (id) => `/pickups/${id}`,
    PICKUP_ASSIGN: (id) => `/pickups/${id}/assign`,
    
    // Delivery endpoints
    DELIVERIES: '/deliveries',
    DELIVERY_DETAIL: (id) => `/deliveries/${id}`,
    DELIVERY_ASSIGN: (id) => `/deliveries/${id}/assign`,
    DELIVERY_COMPLETE: (id) => `/deliveries/${id}/complete`,
    
    // Branch endpoints
    BRANCHES: '/branches',
    BRANCH_DETAIL: (id) => `/branches/${id}`,
    
    // Employee endpoints
    EMPLOYEES: '/employees',
    EMPLOYEE_DETAIL: (id) => `/employees/${id}`,
    
    // Vehicle endpoints
    VEHICLES: '/vehicles',
    VEHICLE_DETAIL: (id) => `/vehicles/${id}`,
    
    // Service area endpoints
    SERVICE_AREAS: '/service-areas',
    SERVICE_AREA_DETAIL: (id) => `/service-areas/${id}`,
  },
  
  // Operations Service endpoints
  OPERATIONS: {
    // Tracking endpoints
    TRACKING: '/tracking',
    TRACKING_DETAIL: (trackingNumber) => `/tracking/${trackingNumber}`,
    
    // Route endpoints
    ROUTES: '/routes',
    ROUTE_DETAIL: (id) => `/routes/${id}`,
    ROUTE_OPTIMIZE: '/routes/optimize',
    
    // Manifest endpoints
    MANIFESTS: '/manifests',
    MANIFEST_DETAIL: (id) => `/manifests/${id}`,
    
    // Sorting endpoints
    SORTING: '/sorting',
    SORTING_DETAIL: (id) => `/sorting/${id}`,
  },
  
  // Finance Service endpoints
  FINANCE: {
    // Invoice endpoints
    INVOICES: '/invoices',
    INVOICE_DETAIL: (id) => `/invoices/${id}`,
    
    // Payment endpoints
    PAYMENTS: '/payments',
    PAYMENT_DETAIL: (id) => `/payments/${id}`,
    
    // COD endpoints
    COD: '/cod',
    COD_DETAIL: (id) => `/cod/${id}`,
    
    // Report endpoints
    FINANCIAL_REPORTS: '/financial-reports',
  },
  
  // Notification Service endpoints
  NOTIFICATION: {
    NOTIFICATIONS: '/notifications',
    NOTIFICATION_DETAIL: (id) => `/notifications/${id}`,
    NOTIFICATION_MARK_READ: (id) => `/notifications/${id}/read`,
    NOTIFICATION_MARK_ALL_READ: '/notifications/read-all',
    NOTIFICATION_SETTINGS: '/notification-settings',
  },
  
  // Reporting Service endpoints
  REPORTING: {
    REPORTS: '/reports',
    REPORT_DETAIL: (id) => `/reports/${id}`,
    OPERATIONAL_REPORTS: '/reports/operational',
    PERFORMANCE_REPORTS: '/reports/performance',
  },
  
  // System endpoints
  SYSTEM: {
    HEALTH: '/health',
    VERSION: '/version',
    SETTINGS: '/settings',
  },
};

// Timeout configuration (in milliseconds)
const TIMEOUT = {
  DEFAULT: 30000, // 30 seconds
  LONG: 60000,    // 60 seconds
  SHORT: 10000,   // 10 seconds
};

// Export configuration
export const apiConfig = {
  BASE_URL: API_BASE_URL,
  VERSION: API_VERSION,
  ENDPOINTS,
  TIMEOUT,
  
  // Helper method to get full URL for an endpoint
  getUrl: (endpoint) => `${API_BASE_URL}/${API_VERSION}${endpoint}`,
};

export default apiConfig;
