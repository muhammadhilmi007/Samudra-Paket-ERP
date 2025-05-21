/**
 * Customer Slice
 * Redux state management for customer data
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCustomer: null,
  customerFilters: {
    status: '',
    type: '',
    searchTerm: '',
  },
  customerSort: {
    field: 'createdAt',
    direction: 'desc',
  },
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // Set the selected customer
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    
    // Clear the selected customer
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
    
    // Update customer filters
    setCustomerFilters: (state, action) => {
      state.customerFilters = {
        ...state.customerFilters,
        ...action.payload,
      };
    },
    
    // Reset customer filters
    resetCustomerFilters: (state) => {
      state.customerFilters = initialState.customerFilters;
    },
    
    // Set customer sort
    setCustomerSort: (state, action) => {
      state.customerSort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle API actions based on action type patterns instead of direct references
      // This avoids circular dependencies
      
      // Handle getCustomerById.fulfilled
      .addMatcher(
        (action) => action.type.endsWith('/getCustomerById/fulfilled'),
        (state, { payload }) => {
          state.selectedCustomer = payload;
        }
      )
      // Handle createCustomer.fulfilled
      .addMatcher(
        (action) => action.type.endsWith('/createCustomer/fulfilled'),
        (state) => {
          state.selectedCustomer = null;
        }
      )
      // Handle updateCustomer.fulfilled
      .addMatcher(
        (action) => action.type.endsWith('/updateCustomer/fulfilled'),
        (state, { payload }) => {
          if (state.selectedCustomer && state.selectedCustomer.id === payload.id) {
            state.selectedCustomer = payload;
          }
        }
      )
      // Handle deleteCustomer.fulfilled
      .addMatcher(
        (action) => action.type.endsWith('/deleteCustomer/fulfilled'),
        (state) => {
          state.selectedCustomer = null;
        }
      );
  },
});

// Export actions
export const {
  setSelectedCustomer,
  clearSelectedCustomer,
  setCustomerFilters,
  resetCustomerFilters,
  setCustomerSort,
} = customerSlice.actions;

// Export selectors
export const selectSelectedCustomer = (state) => state.customer.selectedCustomer;
export const selectCustomerFilters = (state) => state.customer.customerFilters;
export const selectCustomerSort = (state) => state.customer.customerSort;

// Export reducer
export default customerSlice.reducer;
