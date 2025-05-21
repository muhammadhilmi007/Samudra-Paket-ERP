/**
 * Core Thunks
 * Async action creators for core business operations
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { coreService } from '../../services';

/**
 * Shipment Thunks
 */

// Get shipments list
export const fetchShipments = createAsyncThunk(
  'shipment/fetchShipments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await coreService.getShipments(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch shipments');
    }
  }
);

// Get shipment by ID
export const fetchShipmentById = createAsyncThunk(
  'shipment/fetchShipmentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await coreService.getShipmentById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch shipment details');
    }
  }
);

// Create shipment
export const createShipment = createAsyncThunk(
  'shipment/createShipment',
  async (shipmentData, { rejectWithValue }) => {
    try {
      const response = await coreService.createShipment(shipmentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create shipment');
    }
  }
);

// Update shipment
export const updateShipment = createAsyncThunk(
  'shipment/updateShipment',
  async ({ id, shipmentData }, { rejectWithValue }) => {
    try {
      const response = await coreService.updateShipment(id, shipmentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update shipment');
    }
  }
);

// Track shipment
export const trackShipment = createAsyncThunk(
  'shipment/trackShipment',
  async (trackingNumber, { rejectWithValue }) => {
    try {
      const response = await coreService.trackShipment(trackingNumber);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to track shipment');
    }
  }
);

/**
 * Customer Thunks
 */

// Get customers list
export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await coreService.getCustomers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch customers');
    }
  }
);

// Get customer by ID
export const fetchCustomerById = createAsyncThunk(
  'customer/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await coreService.getCustomerById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch customer details');
    }
  }
);

// Create customer
export const createCustomer = createAsyncThunk(
  'customer/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await coreService.createCustomer(customerData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create customer');
    }
  }
);

// Update customer
export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      const response = await coreService.updateCustomer(id, customerData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update customer');
    }
  }
);

// Delete customer
export const deleteCustomer = createAsyncThunk(
  'customer/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await coreService.deleteCustomer(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete customer');
    }
  }
);

/**
 * Pickup Thunks
 */

// Get pickups list
export const fetchPickups = createAsyncThunk(
  'pickup/fetchPickups',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await coreService.getPickups(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch pickups');
    }
  }
);

// Get pickup by ID
export const fetchPickupById = createAsyncThunk(
  'pickup/fetchPickupById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await coreService.getPickupById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch pickup details');
    }
  }
);

// Create pickup
export const createPickup = createAsyncThunk(
  'pickup/createPickup',
  async (pickupData, { rejectWithValue }) => {
    try {
      const response = await coreService.createPickup(pickupData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create pickup');
    }
  }
);

// Assign pickup
export const assignPickup = createAsyncThunk(
  'pickup/assignPickup',
  async ({ id, assignData }, { rejectWithValue }) => {
    try {
      const response = await coreService.assignPickup(id, assignData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to assign pickup');
    }
  }
);

/**
 * Delivery Thunks
 */

// Get deliveries list
export const fetchDeliveries = createAsyncThunk(
  'delivery/fetchDeliveries',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await coreService.getDeliveries(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch deliveries');
    }
  }
);

// Get delivery by ID
export const fetchDeliveryById = createAsyncThunk(
  'delivery/fetchDeliveryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await coreService.getDeliveryById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch delivery details');
    }
  }
);

// Assign delivery
export const assignDelivery = createAsyncThunk(
  'delivery/assignDelivery',
  async ({ id, assignData }, { rejectWithValue }) => {
    try {
      const response = await coreService.assignDelivery(id, assignData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to assign delivery');
    }
  }
);

// Complete delivery
export const completeDelivery = createAsyncThunk(
  'delivery/completeDelivery',
  async ({ id, deliveryData }, { rejectWithValue }) => {
    try {
      const response = await coreService.completeDelivery(id, deliveryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to complete delivery');
    }
  }
);

/**
 * Branch Thunks
 */

// Get branches list
export const fetchBranches = createAsyncThunk(
  'branch/fetchBranches',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await coreService.getBranches(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch branches');
    }
  }
);

// Get branch by ID
export const fetchBranchById = createAsyncThunk(
  'branch/fetchBranchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await coreService.getBranchById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch branch details');
    }
  }
);

/**
 * Employee Thunks
 */

// Get employees list
export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await coreService.getEmployees(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch employees');
    }
  }
);

// Get employee by ID
export const fetchEmployeeById = createAsyncThunk(
  'employee/fetchEmployeeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await coreService.getEmployeeById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch employee details');
    }
  }
);

/**
 * Vehicle Thunks
 */

// Get vehicles list
export const fetchVehicles = createAsyncThunk(
  'vehicle/fetchVehicles',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await coreService.getVehicles(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch vehicles');
    }
  }
);

// Get vehicle by ID
export const fetchVehicleById = createAsyncThunk(
  'vehicle/fetchVehicleById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await coreService.getVehicleById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch vehicle details');
    }
  }
);

/**
 * Service Area Thunks
 */

// Get service areas list
export const fetchServiceAreas = createAsyncThunk(
  'serviceArea/fetchServiceAreas',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await coreService.getServiceAreas(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch service areas');
    }
  }
);

// Get service area by ID
export const fetchServiceAreaById = createAsyncThunk(
  'serviceArea/fetchServiceAreaById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await coreService.getServiceAreaById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch service area details');
    }
  }
);
