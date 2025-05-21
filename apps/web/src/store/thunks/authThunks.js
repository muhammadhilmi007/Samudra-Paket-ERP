/**
 * Auth Thunks
 * Async action creators for authentication operations
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  updateUserProfile,
} from '../slices/authSlice';

/**
 * Login user thunk
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginStart());
      const response = await authService.login(credentials);
      dispatch(loginSuccess(response));
      return response;
    } catch (error) {
      dispatch(loginFailure(error.message || 'Authentication failed'));
      return rejectWithValue(error.message || 'Authentication failed');
    }
  }
);

/**
 * Register user thunk
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginStart());
      const response = await authService.register(userData);
      
      // If registration automatically logs in the user
      if (response.token) {
        dispatch(loginSuccess(response));
      }
      
      return response;
    } catch (error) {
      dispatch(loginFailure(error.message || 'Registration failed'));
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

/**
 * Logout user thunk
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await authService.logout();
      dispatch(logout());
      return { success: true };
    } catch (error) {
      // Still logout the user locally even if the API call fails
      dispatch(logout());
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

/**
 * Refresh token thunk
 */
export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(refreshTokenStart());
      const response = await authService.refreshToken();
      dispatch(refreshTokenSuccess(response));
      return response;
    } catch (error) {
      dispatch(refreshTokenFailure(error.message || 'Token refresh failed'));
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

/**
 * Get current user thunk
 */
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      dispatch(updateUserProfile(response));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to get user profile');
    }
  }
);

/**
 * Update user profile thunk
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await authService.updateUserProfile(userData);
      dispatch(updateUserProfile(response));
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

/**
 * Change password thunk
 */
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to change password');
    }
  }
);

/**
 * Forgot password thunk
 */
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to request password reset');
    }
  }
);

/**
 * Reset password thunk
 */
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to reset password');
    }
  }
);
