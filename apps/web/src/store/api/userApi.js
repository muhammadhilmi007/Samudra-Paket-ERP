/**
 * User API
 * API endpoints for user-related operations
 */

import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user profile
    getCurrentUser: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    
    // Update current user profile
    updateCurrentUser: builder.mutation({
      query: (userData) => ({
        url: '/users/me',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Update user password
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/users/me/password',
        method: 'PATCH',
        body: passwordData,
      }),
    }),
    
    // Get user preferences
    getUserPreferences: builder.query({
      query: () => '/users/me/preferences',
      providesTags: ['UserPreferences'],
    }),
    
    // Update user preferences
    updateUserPreferences: builder.mutation({
      query: (preferencesData) => ({
        url: '/users/me/preferences',
        method: 'PATCH',
        body: preferencesData,
      }),
      invalidatesTags: ['UserPreferences'],
    }),
    
    // Get all users (admin only)
    getUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'User', id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    
    // Get user by ID (admin only)
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    // Create user (admin only)
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    
    // Update user (admin only)
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
    
    // Delete user (admin only)
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
    
    // Get user roles (admin only)
    getUserRoles: builder.query({
      query: () => '/users/roles',
      providesTags: ['UserRoles'],
    }),
    
    // Upload user avatar
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: '/users/me/avatar',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Get user activity log
    getUserActivityLog: builder.query({
      query: (params) => ({
        url: '/users/me/activity',
        params,
      }),
    }),
    
    // Get user notifications
    getUserNotifications: builder.query({
      query: (params) => ({
        url: '/users/me/notifications',
        params,
      }),
      providesTags: ['UserNotifications'],
    }),
    
    // Mark notification as read
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/users/me/notifications/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['UserNotifications'],
    }),
    
    // Mark all notifications as read
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: '/users/me/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['UserNotifications'],
    }),
  }),
});

export const {
  // Current user hooks
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useUpdatePasswordMutation,
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
  
  // User management hooks (admin)
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserRolesQuery,
  
  // Avatar upload
  useUploadAvatarMutation,
  
  // Activity and notifications
  useGetUserActivityLogQuery,
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = userApi;
