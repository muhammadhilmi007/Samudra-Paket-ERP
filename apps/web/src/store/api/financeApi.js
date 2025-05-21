/**
 * Finance API
 * API endpoints for finance-related operations
 */

import { apiSlice } from './apiSlice';

export const financeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Invoice endpoints
    getInvoices: builder.query({
      query: (params) => ({
        url: '/invoices',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Invoice', id })),
              { type: 'Invoice', id: 'LIST' },
            ]
          : [{ type: 'Invoice', id: 'LIST' }],
    }),
    
    getInvoiceById: builder.query({
      query: (id) => `/invoices/${id}`,
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),
    
    createInvoice: builder.mutation({
      query: (invoiceData) => ({
        url: '/invoices',
        method: 'POST',
        body: invoiceData,
      }),
      invalidatesTags: [{ type: 'Invoice', id: 'LIST' }],
    }),
    
    updateInvoice: builder.mutation({
      query: ({ id, ...invoiceData }) => ({
        url: `/invoices/${id}`,
        method: 'PATCH',
        body: invoiceData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Invoice', id },
        { type: 'Invoice', id: 'LIST' },
      ],
    }),
    
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Invoice', id },
        { type: 'Invoice', id: 'LIST' },
      ],
    }),
    
    // Get invoice payments
    getInvoicePayments: builder.query({
      query: (invoiceId) => `/invoices/${invoiceId}/payments`,
      providesTags: (result, error, invoiceId) => [
        { type: 'Payment', id: `Invoice-${invoiceId}` },
      ],
    }),
    
    // Payment endpoints
    getPayments: builder.query({
      query: (params) => ({
        url: '/payments',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Payment', id })),
              { type: 'Payment', id: 'LIST' },
            ]
          : [{ type: 'Payment', id: 'LIST' }],
    }),
    
    getPaymentById: builder.query({
      query: (id) => `/payments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),
    
    createPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/payments',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: (result) => [
        { type: 'Payment', id: 'LIST' },
        result?.invoiceId 
          ? { type: 'Invoice', id: result.invoiceId }
          : null,
        result?.invoiceId 
          ? { type: 'Payment', id: `Invoice-${result.invoiceId}` }
          : null,
      ].filter(Boolean),
    }),
    
    updatePayment: builder.mutation({
      query: ({ id, ...paymentData }) => ({
        url: `/payments/${id}`,
        method: 'PATCH',
        body: paymentData,
      }),
      invalidatesTags: (result, error, { id, invoiceId }) => [
        { type: 'Payment', id },
        { type: 'Payment', id: 'LIST' },
        invoiceId ? { type: 'Invoice', id: invoiceId } : null,
        invoiceId ? { type: 'Payment', id: `Invoice-${invoiceId}` } : null,
      ].filter(Boolean),
    }),
    
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Payment', id },
        { type: 'Payment', id: 'LIST' },
      ],
    }),
    
    // Financial reports
    getFinancialSummary: builder.query({
      query: (params) => ({
        url: '/reports/financial-summary',
        params,
      }),
      providesTags: ['Report'],
    }),
    
    getRevenueByPeriod: builder.query({
      query: (params) => ({
        url: '/reports/revenue-by-period',
        params,
      }),
      providesTags: ['Report'],
    }),
    
    getProfitMargin: builder.query({
      query: (params) => ({
        url: '/reports/profit-margin',
        params,
      }),
      providesTags: ['Report'],
    }),
    
    getRevenueByService: builder.query({
      query: (params) => ({
        url: '/reports/revenue-by-service',
        params,
      }),
      providesTags: ['Report'],
    }),
    
    getAccountsReceivable: builder.query({
      query: (params) => ({
        url: '/reports/accounts-receivable',
        params,
      }),
      providesTags: ['Report'],
    }),
    
    getTopCustomersByRevenue: builder.query({
      query: (params) => ({
        url: '/reports/top-customers-by-revenue',
        params,
      }),
      providesTags: ['Report'],
    }),
    
    // Transaction details for reports
    getTransactionDetails: builder.query({
      query: (params) => ({
        url: '/reports/transaction-details',
        params,
      }),
      providesTags: ['Report'],
    }),
  }),
});

export const {
  // Invoice hooks
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetInvoicePaymentsQuery,
  
  // Payment hooks
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  
  // Report hooks
  useGetFinancialSummaryQuery,
  useGetRevenueByPeriodQuery,
  useGetProfitMarginQuery,
  useGetRevenueByServiceQuery,
  useGetAccountsReceivableQuery,
  useGetTopCustomersByRevenueQuery,
  useGetTransactionDetailsQuery,
} = financeApi;
