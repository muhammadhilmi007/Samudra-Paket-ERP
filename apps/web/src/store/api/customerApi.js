/**
 * Customer API
 * API endpoints for customer-related operations
 */

import { apiSlice } from './apiSlice';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: (params) => ({
        url: '/customers',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Customer', id })),
              { type: 'Customer', id: 'LIST' },
            ]
          : [{ type: 'Customer', id: 'LIST' }],
    }),
    
    getCustomerById: builder.query({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),
    
    createCustomer: builder.mutation({
      query: (customerData) => ({
        url: '/customers',
        method: 'POST',
        body: customerData,
      }),
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),
    
    updateCustomer: builder.mutation({
      query: ({ id, ...customerData }) => ({
        url: `/customers/${id}`,
        method: 'PATCH',
        body: customerData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Customer', id },
        { type: 'Customer', id: 'LIST' },
      ],
    }),
    
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Customer', id },
        { type: 'Customer', id: 'LIST' },
      ],
    }),
    
    getCustomerShipments: builder.query({
      query: ({ customerId, params }) => ({
        url: `/customers/${customerId}/shipments`,
        params,
      }),
      providesTags: (result, error, { customerId }) => [
        { type: 'Customer', id: `${customerId}-SHIPMENTS` },
        { type: 'Shipment', id: 'LIST' },
      ],
    }),
    
    getCustomerAddresses: builder.query({
      query: (customerId) => `/customers/${customerId}/addresses`,
      providesTags: (result, error, customerId) => [
        { type: 'Customer', id: `${customerId}-ADDRESSES` },
      ],
    }),
    
    addCustomerAddress: builder.mutation({
      query: ({ customerId, addressData }) => ({
        url: `/customers/${customerId}/addresses`,
        method: 'POST',
        body: addressData,
      }),
      invalidatesTags: (result, error, { customerId }) => [
        { type: 'Customer', id: `${customerId}-ADDRESSES` },
      ],
    }),
    
    updateCustomerAddress: builder.mutation({
      query: ({ customerId, addressId, addressData }) => ({
        url: `/customers/${customerId}/addresses/${addressId}`,
        method: 'PATCH',
        body: addressData,
      }),
      invalidatesTags: (result, error, { customerId }) => [
        { type: 'Customer', id: `${customerId}-ADDRESSES` },
      ],
    }),
    
    deleteCustomerAddress: builder.mutation({
      query: ({ customerId, addressId }) => ({
        url: `/customers/${customerId}/addresses/${addressId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { customerId }) => [
        { type: 'Customer', id: `${customerId}-ADDRESSES` },
      ],
    }),
    
    getCustomerStatistics: builder.query({
      query: (customerId) => `/customers/${customerId}/statistics`,
      providesTags: (result, error, customerId) => [
        { type: 'Customer', id: `${customerId}-STATS` },
      ],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerShipmentsQuery,
  useGetCustomerAddressesQuery,
  useAddCustomerAddressMutation,
  useUpdateCustomerAddressMutation,
  useDeleteCustomerAddressMutation,
  useGetCustomerStatisticsQuery,
} = customerApi;
