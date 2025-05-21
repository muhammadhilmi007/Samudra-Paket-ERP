/**
 * useCoreService Hook
 * Custom hook for accessing core service functionality with loading and error states
 */

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useApi from './useApi';
import { coreService } from '../services';
import * as coreThunks from '../store/thunks/coreThunks';

/**
 * Custom hook for accessing core service functionality
 * Provides both direct API access and Redux thunk dispatching
 * 
 * @returns {Object} Core service methods with loading and error states
 */
const useCoreService = () => {
  const dispatch = useDispatch();
  
  // Shipment operations
  const getShipments = useApi(coreService.getShipments);
  const getShipmentById = useApi(coreService.getShipmentById);
  const createShipmentApi = useApi(coreService.createShipment);
  const updateShipmentApi = useApi(coreService.updateShipment);
  const trackShipmentApi = useApi(coreService.trackShipment);
  
  // Customer operations
  const getCustomers = useApi(coreService.getCustomers);
  const getCustomerById = useApi(coreService.getCustomerById);
  const createCustomerApi = useApi(coreService.createCustomer);
  const updateCustomerApi = useApi(coreService.updateCustomer);
  const deleteCustomerApi = useApi(coreService.deleteCustomer);
  
  // Pickup operations
  const getPickups = useApi(coreService.getPickups);
  const getPickupById = useApi(coreService.getPickupById);
  const createPickupApi = useApi(coreService.createPickup);
  const assignPickupApi = useApi(coreService.assignPickup);
  
  // Delivery operations
  const getDeliveries = useApi(coreService.getDeliveries);
  const getDeliveryById = useApi(coreService.getDeliveryById);
  const assignDeliveryApi = useApi(coreService.assignDelivery);
  const completeDeliveryApi = useApi(coreService.completeDelivery);
  
  // Branch operations
  const getBranches = useApi(coreService.getBranches);
  const getBranchById = useApi(coreService.getBranchById);
  
  // Employee operations
  const getEmployees = useApi(coreService.getEmployees);
  const getEmployeeById = useApi(coreService.getEmployeeById);
  
  // Vehicle operations
  const getVehicles = useApi(coreService.getVehicles);
  const getVehicleById = useApi(coreService.getVehicleById);
  
  // Service area operations
  const getServiceAreas = useApi(coreService.getServiceAreas);
  const getServiceAreaById = useApi(coreService.getServiceAreaById);
  
  // Redux thunk dispatchers
  
  // Shipment thunks
  const dispatchFetchShipments = useCallback(
    (params) => dispatch(coreThunks.fetchShipments(params)),
    [dispatch]
  );
  
  const dispatchFetchShipmentById = useCallback(
    (id) => dispatch(coreThunks.fetchShipmentById(id)),
    [dispatch]
  );
  
  const dispatchCreateShipment = useCallback(
    (data) => dispatch(coreThunks.createShipment(data)),
    [dispatch]
  );
  
  const dispatchUpdateShipment = useCallback(
    (id, data) => dispatch(coreThunks.updateShipment({ id, shipmentData: data })),
    [dispatch]
  );
  
  const dispatchTrackShipment = useCallback(
    (trackingNumber) => dispatch(coreThunks.trackShipment(trackingNumber)),
    [dispatch]
  );
  
  // Customer thunks
  const dispatchFetchCustomers = useCallback(
    (params) => dispatch(coreThunks.fetchCustomers(params)),
    [dispatch]
  );
  
  const dispatchFetchCustomerById = useCallback(
    (id) => dispatch(coreThunks.fetchCustomerById(id)),
    [dispatch]
  );
  
  const dispatchCreateCustomer = useCallback(
    (data) => dispatch(coreThunks.createCustomer(data)),
    [dispatch]
  );
  
  const dispatchUpdateCustomer = useCallback(
    (id, data) => dispatch(coreThunks.updateCustomer({ id, customerData: data })),
    [dispatch]
  );
  
  const dispatchDeleteCustomer = useCallback(
    (id) => dispatch(coreThunks.deleteCustomer(id)),
    [dispatch]
  );
  
  // Pickup thunks
  const dispatchFetchPickups = useCallback(
    (params) => dispatch(coreThunks.fetchPickups(params)),
    [dispatch]
  );
  
  const dispatchFetchPickupById = useCallback(
    (id) => dispatch(coreThunks.fetchPickupById(id)),
    [dispatch]
  );
  
  const dispatchCreatePickup = useCallback(
    (data) => dispatch(coreThunks.createPickup(data)),
    [dispatch]
  );
  
  const dispatchAssignPickup = useCallback(
    (id, data) => dispatch(coreThunks.assignPickup({ id, assignData: data })),
    [dispatch]
  );
  
  // Delivery thunks
  const dispatchFetchDeliveries = useCallback(
    (params) => dispatch(coreThunks.fetchDeliveries(params)),
    [dispatch]
  );
  
  const dispatchFetchDeliveryById = useCallback(
    (id) => dispatch(coreThunks.fetchDeliveryById(id)),
    [dispatch]
  );
  
  const dispatchAssignDelivery = useCallback(
    (id, data) => dispatch(coreThunks.assignDelivery({ id, assignData: data })),
    [dispatch]
  );
  
  const dispatchCompleteDelivery = useCallback(
    (id, data) => dispatch(coreThunks.completeDelivery({ id, deliveryData: data })),
    [dispatch]
  );
  
  // Branch thunks
  const dispatchFetchBranches = useCallback(
    (params) => dispatch(coreThunks.fetchBranches(params)),
    [dispatch]
  );
  
  const dispatchFetchBranchById = useCallback(
    (id) => dispatch(coreThunks.fetchBranchById(id)),
    [dispatch]
  );
  
  // Employee thunks
  const dispatchFetchEmployees = useCallback(
    (params) => dispatch(coreThunks.fetchEmployees(params)),
    [dispatch]
  );
  
  const dispatchFetchEmployeeById = useCallback(
    (id) => dispatch(coreThunks.fetchEmployeeById(id)),
    [dispatch]
  );
  
  // Vehicle thunks
  const dispatchFetchVehicles = useCallback(
    (params) => dispatch(coreThunks.fetchVehicles(params)),
    [dispatch]
  );
  
  const dispatchFetchVehicleById = useCallback(
    (id) => dispatch(coreThunks.fetchVehicleById(id)),
    [dispatch]
  );
  
  // Service area thunks
  const dispatchFetchServiceAreas = useCallback(
    (params) => dispatch(coreThunks.fetchServiceAreas(params)),
    [dispatch]
  );
  
  const dispatchFetchServiceAreaById = useCallback(
    (id) => dispatch(coreThunks.fetchServiceAreaById(id)),
    [dispatch]
  );
  
  return {
    // Direct API methods with loading/error states
    shipments: {
      getShipments,
      getShipmentById,
      createShipment: createShipmentApi,
      updateShipment: updateShipmentApi,
      trackShipment: trackShipmentApi,
    },
    customers: {
      getCustomers,
      getCustomerById,
      createCustomer: createCustomerApi,
      updateCustomer: updateCustomerApi,
      deleteCustomer: deleteCustomerApi,
    },
    pickups: {
      getPickups,
      getPickupById,
      createPickup: createPickupApi,
      assignPickup: assignPickupApi,
    },
    deliveries: {
      getDeliveries,
      getDeliveryById,
      assignDelivery: assignDeliveryApi,
      completeDelivery: completeDeliveryApi,
    },
    branches: {
      getBranches,
      getBranchById,
    },
    employees: {
      getEmployees,
      getEmployeeById,
    },
    vehicles: {
      getVehicles,
      getVehicleById,
    },
    serviceAreas: {
      getServiceAreas,
      getServiceAreaById,
    },
    
    // Redux thunk dispatchers
    dispatch: {
      shipments: {
        fetchShipments: dispatchFetchShipments,
        fetchShipmentById: dispatchFetchShipmentById,
        createShipment: dispatchCreateShipment,
        updateShipment: dispatchUpdateShipment,
        trackShipment: dispatchTrackShipment,
      },
      customers: {
        fetchCustomers: dispatchFetchCustomers,
        fetchCustomerById: dispatchFetchCustomerById,
        createCustomer: dispatchCreateCustomer,
        updateCustomer: dispatchUpdateCustomer,
        deleteCustomer: dispatchDeleteCustomer,
      },
      pickups: {
        fetchPickups: dispatchFetchPickups,
        fetchPickupById: dispatchFetchPickupById,
        createPickup: dispatchCreatePickup,
        assignPickup: dispatchAssignPickup,
      },
      deliveries: {
        fetchDeliveries: dispatchFetchDeliveries,
        fetchDeliveryById: dispatchFetchDeliveryById,
        assignDelivery: dispatchAssignDelivery,
        completeDelivery: dispatchCompleteDelivery,
      },
      branches: {
        fetchBranches: dispatchFetchBranches,
        fetchBranchById: dispatchFetchBranchById,
      },
      employees: {
        fetchEmployees: dispatchFetchEmployees,
        fetchEmployeeById: dispatchFetchEmployeeById,
      },
      vehicles: {
        fetchVehicles: dispatchFetchVehicles,
        fetchVehicleById: dispatchFetchVehicleById,
      },
      serviceAreas: {
        fetchServiceAreas: dispatchFetchServiceAreas,
        fetchServiceAreaById: dispatchFetchServiceAreaById,
      },
    },
  };
};

export default useCoreService;
