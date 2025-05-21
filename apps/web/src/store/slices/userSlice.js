/**
 * User Slice
 * Redux state management for user data and preferences
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  userPreferences: {
    language: 'id', // Default language is Indonesian
    theme: 'light',
    timezone: 'Asia/Jakarta',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    dashboard: {
      favoriteReports: [],
      layout: 'default',
    },
  },
  usersList: [],
  userFilters: {
    role: '',
    status: '',
    searchTerm: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set the current user
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    
    // Update the current user
    updateCurrentUser: (state, action) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      }
    },
    
    // Clear the current user
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    
    // Update user preferences
    updateUserPreferences: (state, action) => {
      state.userPreferences = {
        ...state.userPreferences,
        ...action.payload,
      };
    },
    
    // Update notification preferences
    updateNotificationPreferences: (state, action) => {
      state.userPreferences.notifications = {
        ...state.userPreferences.notifications,
        ...action.payload,
      };
    },
    
    // Update dashboard preferences
    updateDashboardPreferences: (state, action) => {
      state.userPreferences.dashboard = {
        ...state.userPreferences.dashboard,
        ...action.payload,
      };
    },
    
    // Add favorite report
    addFavoriteReport: (state, action) => {
      if (!state.userPreferences.dashboard.favoriteReports.includes(action.payload)) {
        state.userPreferences.dashboard.favoriteReports.push(action.payload);
      }
    },
    
    // Remove favorite report
    removeFavoriteReport: (state, action) => {
      state.userPreferences.dashboard.favoriteReports = 
        state.userPreferences.dashboard.favoriteReports.filter(id => id !== action.payload);
    },
    
    // Set users list
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
    
    // Update user filters
    setUserFilters: (state, action) => {
      state.userFilters = {
        ...state.userFilters,
        ...action.payload,
      };
    },
    
    // Reset user filters
    resetUserFilters: (state) => {
      state.userFilters = initialState.userFilters;
    },
    
    // Set language
    setLanguage: (state, action) => {
      state.userPreferences.language = action.payload;
    },
    
    // Toggle theme
    toggleTheme: (state) => {
      state.userPreferences.theme = state.userPreferences.theme === 'light' ? 'dark' : 'light';
    },
    
    // Set theme
    setTheme: (state, action) => {
      state.userPreferences.theme = action.payload;
    },
  },
  // We'll add extraReducers when we create the user API endpoints
});

// Export actions
export const {
  setCurrentUser,
  updateCurrentUser,
  clearCurrentUser,
  updateUserPreferences,
  updateNotificationPreferences,
  updateDashboardPreferences,
  addFavoriteReport,
  removeFavoriteReport,
  setUsersList,
  setUserFilters,
  resetUserFilters,
  setLanguage,
  toggleTheme,
  setTheme,
} = userSlice.actions;

// Export selectors with user-specific names
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectUserPreferences = (state) => state.user.userPreferences;
export const selectUserTheme = (state) => state.user.userPreferences?.theme || 'light';
export const selectUserLanguage = (state) => state.user.userPreferences?.language || 'id';
export const selectUserNotificationPrefs = (state) => state.user.userPreferences?.notifications || {};
export const selectUserDashboardPrefs = (state) => state.user.userPreferences?.dashboard || {};
export const selectUserFavoriteReports = (state) => state.user.userPreferences?.dashboard?.favoriteReports || [];
export const selectUsersList = (state) => state.user.usersList;
export const selectUserFilters = (state) => state.user.userFilters;

// Export reducer
export default userSlice.reducer;
