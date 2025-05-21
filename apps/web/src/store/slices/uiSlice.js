/**
 * UI Slice
 * Manages UI state including sidebar visibility, theme, language, notifications, etc.
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';
import { DEFAULT_LANGUAGE } from '../../utils/languageUtils';

const initialState = {
  sidebarOpen: false,
  theme: 'light',
  language: DEFAULT_LANGUAGE,
  notifications: [],
  unreadNotificationsCount: 0,
  activeModal: null,
  modalData: null,
  loading: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadNotificationsCount += 1;
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    markNotificationsAsRead: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
      state.unreadNotificationsCount = 0;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload.modalType;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
    setLoading: (state, action) => {
      state.loading[action.payload.key] = action.payload.isLoading;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLanguage,
  addNotification,
  removeNotification,
  markNotificationsAsRead,
  openModal,
  closeModal,
  setLoading,
} = uiSlice.actions;

// Base selector
const selectUiState = (state) => state.ui;

// Memoized selectors
export const selectSidebarOpen = createSelector(
  [selectUiState],
  (ui) => ui.sidebarOpen
);

export const selectTheme = createSelector(
  [selectUiState],
  (ui) => ui.theme
);

export const selectLanguage = createSelector(
  [selectUiState],
  (ui) => ui.language
);

export const selectNotifications = createSelector(
  [selectUiState],
  (ui) => ui.notifications
);

export const selectUnreadNotificationsCount = createSelector(
  [selectUiState],
  (ui) => ui.unreadNotificationsCount
);

export const selectActiveModal = createSelector(
  [selectUiState],
  (ui) => ui.activeModal
);

export const selectModalData = createSelector(
  [selectUiState],
  (ui) => ui.modalData
);

// This selector needs to be created dynamically for each key
export const selectLoading = (state, key) => state.ui.loading[key] || false;

// Complex selectors
export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(notification => !notification.read)
);

export const selectThemeWithSystemPreference = createSelector(
  [selectTheme],
  (theme) => {
    if (theme === 'system') {
      // Check system preference
      return typeof window !== 'undefined' && window.matchMedia && 
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }
);

export default uiSlice.reducer;
