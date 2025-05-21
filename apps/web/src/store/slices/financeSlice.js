/**
 * Finance Slice
 * Redux state management for financial data
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedInvoice: null,
  selectedPayment: null,
  invoiceFilters: {
    status: '',
    dateRange: '',
    startDate: null,
    endDate: null,
    minAmount: '',
    maxAmount: '',
    searchTerm: '',
  },
  paymentFilters: {
    method: '',
    dateRange: '',
    startDate: null,
    endDate: null,
    minAmount: '',
    maxAmount: '',
    searchTerm: '',
  },
  invoiceSort: {
    field: 'date',
    direction: 'desc',
  },
  paymentSort: {
    field: 'date',
    direction: 'desc',
  },
  financialSummary: {
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    accountsReceivable: 0,
    accountsPayable: 0,
  },
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    // Set the selected invoice
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
    },
    
    // Clear the selected invoice
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
    
    // Set the selected payment
    setSelectedPayment: (state, action) => {
      state.selectedPayment = action.payload;
    },
    
    // Clear the selected payment
    clearSelectedPayment: (state) => {
      state.selectedPayment = null;
    },
    
    // Update invoice filters
    setInvoiceFilters: (state, action) => {
      state.invoiceFilters = {
        ...state.invoiceFilters,
        ...action.payload,
      };
    },
    
    // Reset invoice filters
    resetInvoiceFilters: (state) => {
      state.invoiceFilters = initialState.invoiceFilters;
    },
    
    // Update payment filters
    setPaymentFilters: (state, action) => {
      state.paymentFilters = {
        ...state.paymentFilters,
        ...action.payload,
      };
    },
    
    // Reset payment filters
    resetPaymentFilters: (state) => {
      state.paymentFilters = initialState.paymentFilters;
    },
    
    // Set invoice sort
    setInvoiceSort: (state, action) => {
      state.invoiceSort = action.payload;
    },
    
    // Set payment sort
    setPaymentSort: (state, action) => {
      state.paymentSort = action.payload;
    },
    
    // Update financial summary
    updateFinancialSummary: (state, action) => {
      state.financialSummary = {
        ...state.financialSummary,
        ...action.payload,
      };
    },
  },
  // We'll add extraReducers when we create the finance API endpoints
});

// Export actions
export const {
  setSelectedInvoice,
  clearSelectedInvoice,
  setSelectedPayment,
  clearSelectedPayment,
  setInvoiceFilters,
  resetInvoiceFilters,
  setPaymentFilters,
  resetPaymentFilters,
  setInvoiceSort,
  setPaymentSort,
  updateFinancialSummary,
} = financeSlice.actions;

// Export selectors
export const selectSelectedInvoice = (state) => state.finance.selectedInvoice;
export const selectSelectedPayment = (state) => state.finance.selectedPayment;
export const selectInvoiceFilters = (state) => state.finance.invoiceFilters;
export const selectPaymentFilters = (state) => state.finance.paymentFilters;
export const selectInvoiceSort = (state) => state.finance.invoiceSort;
export const selectPaymentSort = (state) => state.finance.paymentSort;
export const selectFinancialSummary = (state) => state.finance.financialSummary;

// Export reducer
export default financeSlice.reducer;
