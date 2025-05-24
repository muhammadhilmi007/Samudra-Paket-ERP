"use client";

/**
 * Master Data API
 * API endpoints for master data management (branches, divisions, etc.)
 */

import { apiSlice } from './apiSlice';

export const masterDataApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Branches endpoints
    getBranches: builder.query({
      query: (params) => ({
        url: '/master-data/branches',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Branches', id })),
              { type: 'Branches', id: 'LIST' },
            ]
          : [{ type: 'Branches', id: 'LIST' }],
    }),
    
    getBranchById: builder.query({
      query: (id) => `/master-data/branches/${id}`,
      providesTags: (result, error, id) => [{ type: 'Branches', id }],
    }),
    
    createBranch: builder.mutation({
      query: (data) => ({
        url: '/master-data/branches',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Branches', id: 'LIST' }],
    }),
    
    updateBranch: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/master-data/branches/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Branches', id },
        { type: 'Branches', id: 'LIST' },
      ],
    }),
    
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `/master-data/branches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Branches', id: 'LIST' }],
    }),
    
    // Divisions endpoints
    getDivisions: builder.query({
      query: (params) => ({
        url: '/master-data/divisions',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Divisions', id })),
              { type: 'Divisions', id: 'LIST' },
            ]
          : [{ type: 'Divisions', id: 'LIST' }],
    }),
    
    getDivisionById: builder.query({
      query: (id) => `/master-data/divisions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Divisions', id }],
    }),
    
    createDivision: builder.mutation({
      query: (data) => ({
        url: '/master-data/divisions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Divisions', id: 'LIST' }],
    }),
    
    updateDivision: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/master-data/divisions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Divisions', id },
        { type: 'Divisions', id: 'LIST' },
      ],
    }),
    
    deleteDivision: builder.mutation({
      query: (id) => ({
        url: `/master-data/divisions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Divisions', id: 'LIST' }],
    }),
    
    // Get branches by division
    getBranchesByDivision: builder.query({
      query: (divisionId) => `/master-data/divisions/${divisionId}/branches`,
      providesTags: (result, error, divisionId) => [
        { type: 'BranchesByDivision', id: divisionId },
      ],
    }),
    
    // Get divisions by branch
    getDivisionsByBranch: builder.query({
      query: (branchId) => `/master-data/branches/${branchId}/divisions`,
      providesTags: (result, error, branchId) => [
        { type: 'DivisionsByBranch', id: branchId },
      ],
    }),
    
    // Assign divisions to branch
    assignDivisionsToBranch: builder.mutation({
      query: ({ branchId, divisionIds }) => ({
        url: `/master-data/branches/${branchId}/divisions`,
        method: 'POST',
        body: { divisionIds },
      }),
      invalidatesTags: (result, error, { branchId }) => [
        { type: 'DivisionsByBranch', id: branchId },
        { type: 'BranchesByDivision', id: 'LIST' },
      ],
    }),
    
    // Remove division from branch
    removeDivisionFromBranch: builder.mutation({
      query: ({ branchId, divisionId }) => ({
        url: `/master-data/branches/${branchId}/divisions/${divisionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { branchId, divisionId }) => [
        { type: 'DivisionsByBranch', id: branchId },
        { type: 'BranchesByDivision', id: divisionId },
      ],
    }),
    
    // Assign branches to division
    assignBranchesToDivision: builder.mutation({
      query: ({ divisionId, branchIds }) => ({
        url: `/master-data/divisions/${divisionId}/branches`,
        method: 'POST',
        body: { branchIds },
      }),
      invalidatesTags: (result, error, { divisionId }) => [
        { type: 'BranchesByDivision', id: divisionId },
        { type: 'DivisionsByBranch', id: 'LIST' },
      ],
    }),
    
    // Remove branch from division
    removeBranchFromDivision: builder.mutation({
      query: ({ divisionId, branchId }) => ({
        url: `/master-data/divisions/${divisionId}/branches/${branchId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { divisionId, branchId }) => [
        { type: 'BranchesByDivision', id: divisionId },
        { type: 'DivisionsByBranch', id: branchId },
      ],
    }),
  }),
});

export const {
  useGetBranchesQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useGetDivisionsQuery,
  useGetDivisionByIdQuery,
  useCreateDivisionMutation,
  useUpdateDivisionMutation,
  useDeleteDivisionMutation,
  useGetBranchesByDivisionQuery,
  useGetDivisionsByBranchQuery,
  useAssignDivisionsToBranchMutation,
  useRemoveDivisionFromBranchMutation,
  useAssignBranchesToDivisionMutation,
  useRemoveBranchFromDivisionMutation,
} = masterDataApi;
