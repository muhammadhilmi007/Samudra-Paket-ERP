/**
 * Shipment API
 * API endpoints for shipment-related operations
 */

import { apiSlice } from './apiSlice';

export const shipmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShipments: builder.query({
      query: (params) => ({
        url: '/shipments',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Shipment', id })),
              { type: 'Shipment', id: 'LIST' },
            ]
          : [{ type: 'Shipment', id: 'LIST' }],
    }),
    
    getShipmentById: builder.query({
      query: (id) => `/shipments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Shipment', id }],
    }),
    
    createShipment: builder.mutation({
      query: (shipmentData) => ({
        url: '/shipments',
        method: 'POST',
        body: shipmentData,
      }),
      invalidatesTags: [{ type: 'Shipment', id: 'LIST' }],
    }),
    
    updateShipment: builder.mutation({
      query: ({ id, ...shipmentData }) => ({
        url: `/shipments/${id}`,
        method: 'PATCH',
        body: shipmentData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Shipment', id },
        { type: 'Shipment', id: 'LIST' },
      ],
    }),
    
    deleteShipment: builder.mutation({
      query: (id) => ({
        url: `/shipments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Shipment', id },
        { type: 'Shipment', id: 'LIST' },
      ],
    }),
    
    trackShipment: builder.query({
      query: (trackingNumber) => `/shipments/track/${trackingNumber}`,
    }),
    
    getShipmentHistory: builder.query({
      query: (id) => `/shipments/${id}/history`,
      providesTags: (result, error, id) => [
        { type: 'Shipment', id: `${id}-HISTORY` },
      ],
    }),
    
    updateShipmentStatus: builder.mutation({
      query: ({ id, status, notes }) => ({
        url: `/shipments/${id}/status`,
        method: 'PATCH',
        body: { status, notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Shipment', id },
        { type: 'Shipment', id: 'LIST' },
        { type: 'Shipment', id: `${id}-HISTORY` },
      ],
    }),
    
    getShipmentStatistics: builder.query({
      query: (params) => ({
        url: '/shipments/statistics',
        params,
      }),
      providesTags: ['Shipment'],
    }),
    
    generateShipmentLabel: builder.mutation({
      query: (id) => ({
        url: `/shipments/${id}/label`,
        method: 'POST',
      }),
    }),
    
    generateShipmentInvoice: builder.mutation({
      query: (id) => ({
        url: `/shipments/${id}/invoice`,
        method: 'POST',
      }),
    }),
    
    // Report endpoints
    getShipmentVolume: builder.query({
      query: (params) => ({
        url: '/reports/shipment-volume',
        params,
      }),
      providesTags: ['ShipmentReport'],
    }),
    
    getDeliveryPerformance: builder.query({
      query: (params) => ({
        url: '/reports/delivery-performance',
        params,
      }),
      providesTags: ['ShipmentReport'],
    }),
    
    getShipmentsByRegion: builder.query({
      query: (params) => ({
        url: '/reports/shipments-by-region',
        params,
      }),
      providesTags: ['ShipmentReport'],
    }),
    
    getTopRoutes: builder.query({
      query: (params) => ({
        url: '/reports/top-routes',
        params,
      }),
      providesTags: ['ShipmentReport'],
    }),
    
    getShipmentDetails: builder.query({
      query: (params) => ({
        url: '/reports/shipment-details',
        params,
      }),
      providesTags: ['ShipmentReport'],
    }),
  }),
});

export const {
  useGetShipmentsQuery,
  useGetShipmentByIdQuery,
  useCreateShipmentMutation,
  useUpdateShipmentMutation,
  useDeleteShipmentMutation,
  useTrackShipmentQuery,
  useGetShipmentHistoryQuery,
  useUpdateShipmentStatusMutation,
  useGetShipmentStatisticsQuery,
  useGenerateShipmentLabelMutation,
  useGenerateShipmentInvoiceMutation,
  
  // Report hooks
  useGetShipmentVolumeQuery,
  useGetDeliveryPerformanceQuery,
  useGetShipmentsByRegionQuery,
  useGetTopRoutesQuery,
  useGetShipmentDetailsQuery,
} = shipmentApi;
