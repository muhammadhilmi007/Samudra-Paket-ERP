/**
 * Shipment Slice
 * Manages shipment-related state including shipment data, filters, and pagination
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shipments: [],
  selectedShipment: null,
  filters: {
    status: null,
    dateRange: null,
    origin: null,
    destination: null,
    customer: null,
  },
  pagination: {
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  isLoading: false,
  error: null,
};

const shipmentSlice = createSlice({
  name: 'shipment',
  initialState,
  reducers: {
    setShipments: (state, action) => {
      state.shipments = action.payload;
    },
    setSelectedShipment: (state, action) => {
      state.selectedShipment = action.payload;
    },
    clearSelectedShipment: (state) => {
      state.selectedShipment = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset pagination when filters change
      state.pagination.page = 1;
    },
    resetFilters: (state) => {
      state.filters = { ...initialState.filters };
      state.pagination.page = 1;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addShipment: (state, action) => {
      state.shipments.unshift(action.payload);
      state.pagination.totalItems += 1;
      state.pagination.totalPages = Math.ceil(
        state.pagination.totalItems / state.pagination.pageSize
      );
    },
    updateShipment: (state, action) => {
      const index = state.shipments.findIndex(
        (shipment) => shipment.id === action.payload.id
      );
      if (index !== -1) {
        state.shipments[index] = {
          ...state.shipments[index],
          ...action.payload,
        };
      }
      if (state.selectedShipment?.id === action.payload.id) {
        state.selectedShipment = {
          ...state.selectedShipment,
          ...action.payload,
        };
      }
    },
    removeShipment: (state, action) => {
      state.shipments = state.shipments.filter(
        (shipment) => shipment.id !== action.payload
      );
      state.pagination.totalItems -= 1;
      state.pagination.totalPages = Math.ceil(
        state.pagination.totalItems / state.pagination.pageSize
      );
      if (state.selectedShipment?.id === action.payload) {
        state.selectedShipment = null;
      }
    },
  },
});

export const {
  setShipments,
  setSelectedShipment,
  clearSelectedShipment,
  setFilters,
  resetFilters,
  setPagination,
  setSort,
  setLoading,
  setError,
  addShipment,
  updateShipment,
  removeShipment,
} = shipmentSlice.actions;

// Selectors
export const selectShipments = (state) => state.shipment.shipments;
export const selectSelectedShipment = (state) => state.shipment.selectedShipment;
export const selectShipmentFilters = (state) => state.shipment.filters;
export const selectShipmentPagination = (state) => state.shipment.pagination;
export const selectShipmentSort = (state) => state.shipment.sort;
export const selectShipmentLoading = (state) => state.shipment.isLoading;
export const selectShipmentError = (state) => state.shipment.error;

export default shipmentSlice.reducer;
