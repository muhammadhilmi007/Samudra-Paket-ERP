/**
 * Core Service
 * Handles core business operations API requests
 */

import apiClient from '../utils/apiClient';
import { apiConfig } from '../utils/apiConfig';

/**
 * Core Service
 * Methods for core business operations
 */
export const coreService = {
  // User management
  /**
   * Get users list
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getUsers: async (params = {}) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.USERS, params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise} - API response
   */
  getUserById: async (id) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.USER_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Update user profile
   * @param {Object} userData - User data
   * @returns {Promise} - API response
   */
  updateUserProfile: async (userData) => {
    try {
      const response = await apiClient.put(apiConfig.ENDPOINTS.CORE.USER_PROFILE, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Customer management
  /**
   * Get customers list
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getCustomers: async (params = {}) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.CUSTOMERS, params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get customer by ID
   * @param {string} id - Customer ID
   * @returns {Promise} - API response
   */
  getCustomerById: async (id) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.CUSTOMER_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Create customer
   * @param {Object} customerData - Customer data
   * @returns {Promise} - API response
   */
  createCustomer: async (customerData) => {
    try {
      const response = await apiClient.post(apiConfig.ENDPOINTS.CORE.CUSTOMERS, customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Update customer
   * @param {string} id - Customer ID
   * @param {Object} customerData - Customer data
   * @returns {Promise} - API response
   */
  updateCustomer: async (id, customerData) => {
    try {
      const response = await apiClient.put(apiConfig.ENDPOINTS.CORE.CUSTOMER_DETAIL(id), customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Delete customer
   * @param {string} id - Customer ID
   * @returns {Promise} - API response
   */
  deleteCustomer: async (id) => {
    try {
      const response = await apiClient.delete(apiConfig.ENDPOINTS.CORE.CUSTOMER_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Shipment management
  /**
   * Get shipments list
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getShipments: async (params = {}) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.SHIPMENTS, params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get shipment by ID
   * @param {string} id - Shipment ID
   * @returns {Promise} - API response
   */
  getShipmentById: async (id) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.SHIPMENT_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Create shipment
   * @param {Object} shipmentData - Shipment data
   * @returns {Promise} - API response
   */
  createShipment: async (shipmentData) => {
    try {
      const response = await apiClient.post(apiConfig.ENDPOINTS.CORE.SHIPMENTS, shipmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Update shipment
   * @param {string} id - Shipment ID
   * @param {Object} shipmentData - Shipment data
   * @returns {Promise} - API response
   */
  updateShipment: async (id, shipmentData) => {
    try {
      const response = await apiClient.put(apiConfig.ENDPOINTS.CORE.SHIPMENT_DETAIL(id), shipmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Track shipment
   * @param {string} trackingNumber - Tracking number
   * @returns {Promise} - API response
   */
  trackShipment: async (trackingNumber) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.SHIPMENT_TRACKING(trackingNumber));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Pickup management
  /**
   * Get pickups list
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getPickups: async (params = {}) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.PICKUPS, params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get pickup by ID
   * @param {string} id - Pickup ID
   * @returns {Promise} - API response
   */
  getPickupById: async (id) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.PICKUP_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Create pickup
   * @param {Object} pickupData - Pickup data
   * @returns {Promise} - API response
   */
  createPickup: async (pickupData) => {
    try {
      const response = await apiClient.post(apiConfig.ENDPOINTS.CORE.PICKUPS, pickupData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Assign pickup
   * @param {string} id - Pickup ID
   * @param {Object} assignData - Assignment data
   * @returns {Promise} - API response
   */
  assignPickup: async (id, assignData) => {
    try {
      const response = await apiClient.post(apiConfig.ENDPOINTS.CORE.PICKUP_ASSIGN(id), assignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Delivery management
  /**
   * Get deliveries list
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getDeliveries: async (params = {}) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.DELIVERIES, params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get delivery by ID
   * @param {string} id - Delivery ID
   * @returns {Promise} - API response
   */
  getDeliveryById: async (id) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.DELIVERY_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Assign delivery
   * @param {string} id - Delivery ID
   * @param {Object} assignData - Assignment data
   * @returns {Promise} - API response
   */
  assignDelivery: async (id, assignData) => {
    try {
      const response = await apiClient.post(apiConfig.ENDPOINTS.CORE.DELIVERY_ASSIGN(id), assignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Complete delivery
   * @param {string} id - Delivery ID
   * @param {Object} deliveryData - Delivery completion data
   * @returns {Promise} - API response
   */
  completeDelivery: async (id, deliveryData) => {
    try {
      const response = await apiClient.post(apiConfig.ENDPOINTS.CORE.DELIVERY_COMPLETE(id), deliveryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Branch management
  /**
   * Get branches list
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getBranches: async (params = {}) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.BRANCHES, params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get branch by ID
   * @param {string} id - Branch ID
   * @returns {Promise} - API response
   */
  getBranchById: async (id) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.BRANCH_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Employee management
  /**
   * Get employees list
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getEmployees: async (params = {}) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.EMPLOYEES, params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get employee by ID
   * @param {string} id - Employee ID
   * @returns {Promise} - API response
   */
  getEmployeeById: async (id) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.EMPLOYEE_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Vehicle management
  /**
   * Get vehicles list
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getVehicles: async (params = {}) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.VEHICLES, params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get vehicle by ID
   * @param {string} id - Vehicle ID
   * @returns {Promise} - API response
   */
  getVehicleById: async (id) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.VEHICLE_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Service area management
  /**
   * Get service areas list
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getServiceAreas: async (params = {}) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.SERVICE_AREAS, params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * Get service area by ID
   * @param {string} id - Service area ID
   * @returns {Promise} - API response
   */
  getServiceAreaById: async (id) => {
    try {
      const response = await apiClient.get(apiConfig.ENDPOINTS.CORE.SERVICE_AREA_DETAIL(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default coreService;
