/**
 * Notification Utilities
 * Functions for handling notifications and user feedback
 */

import { uiActions } from '../store/index';
import { generateId } from './commonUtils';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Default notification durations (in milliseconds)
const DEFAULT_DURATIONS = {
  [NOTIFICATION_TYPES.SUCCESS]: 3000,
  [NOTIFICATION_TYPES.ERROR]: 5000,
  [NOTIFICATION_TYPES.WARNING]: 4000,
  [NOTIFICATION_TYPES.INFO]: 3000,
};

/**
 * Create a notification object
 * @param {string} type - Notification type (success, error, warning, info)
 * @param {string} message - Notification message
 * @param {string} title - Notification title
 * @param {number} duration - Duration in milliseconds (0 for persistent)
 * @returns {Object} Notification object
 */
export const createNotification = (
  type = NOTIFICATION_TYPES.INFO,
  message,
  title,
  duration
) => {
  const id = generateId('notification-');
  const defaultDuration = DEFAULT_DURATIONS[type] || DEFAULT_DURATIONS[NOTIFICATION_TYPES.INFO];
  
  return {
    id,
    type,
    message,
    title: title || getDefaultTitle(type),
    duration: duration === undefined ? defaultDuration : duration,
    timestamp: new Date().toISOString(),
    read: false,
  };
};

/**
 * Get default title based on notification type
 * @param {string} type - Notification type
 * @returns {string} Default title
 */
const getDefaultTitle = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return 'Success';
    case NOTIFICATION_TYPES.ERROR:
      return 'Error';
    case NOTIFICATION_TYPES.WARNING:
      return 'Warning';
    case NOTIFICATION_TYPES.INFO:
      return 'Information';
    default:
      return 'Notification';
  }
};

/**
 * Show a notification
 * @param {Object} dispatch - Redux dispatch function
 * @param {string} type - Notification type
 * @param {string} message - Notification message
 * @param {string} title - Notification title
 * @param {number} duration - Duration in milliseconds (0 for persistent)
 * @returns {string} Notification ID
 */
export const showNotification = (dispatch, type, message, title, duration) => {
  const notification = createNotification(type, message, title, duration);
  dispatch(uiActions.addNotification(notification));
  
  // Auto-dismiss notification after duration (if not persistent)
  if (notification.duration > 0) {
    setTimeout(() => {
      dispatch(uiActions.removeNotification(notification.id));
    }, notification.duration);
  }
  
  return notification.id;
};

/**
 * Show a success notification
 * @param {Object} dispatch - Redux dispatch function
 * @param {string} message - Notification message
 * @param {string} title - Notification title
 * @param {number} duration - Duration in milliseconds
 * @returns {string} Notification ID
 */
export const showSuccess = (dispatch, message, title, duration) => {
  return showNotification(dispatch, NOTIFICATION_TYPES.SUCCESS, message, title, duration);
};

/**
 * Show an error notification
 * @param {Object} dispatch - Redux dispatch function
 * @param {string} message - Notification message
 * @param {string} title - Notification title
 * @param {number} duration - Duration in milliseconds
 * @returns {string} Notification ID
 */
export const showError = (dispatch, message, title, duration) => {
  return showNotification(dispatch, NOTIFICATION_TYPES.ERROR, message, title, duration);
};

/**
 * Show a warning notification
 * @param {Object} dispatch - Redux dispatch function
 * @param {string} message - Notification message
 * @param {string} title - Notification title
 * @param {number} duration - Duration in milliseconds
 * @returns {string} Notification ID
 */
export const showWarning = (dispatch, message, title, duration) => {
  return showNotification(dispatch, NOTIFICATION_TYPES.WARNING, message, title, duration);
};

/**
 * Show an info notification
 * @param {Object} dispatch - Redux dispatch function
 * @param {string} message - Notification message
 * @param {string} title - Notification title
 * @param {number} duration - Duration in milliseconds
 * @returns {string} Notification ID
 */
export const showInfo = (dispatch, message, title, duration) => {
  return showNotification(dispatch, NOTIFICATION_TYPES.INFO, message, title, duration);
};

/**
 * Dismiss a notification
 * @param {Object} dispatch - Redux dispatch function
 * @param {string} id - Notification ID
 */
export const dismissNotification = (dispatch, id) => {
  dispatch(uiActions.removeNotification(id));
};

/**
 * Show a notification for an API error
 * @param {Object} dispatch - Redux dispatch function
 * @param {Object} error - Error object
 * @param {string} fallbackMessage - Fallback message if error doesn't have a message
 * @returns {string} Notification ID
 */
export const showApiError = (dispatch, error, fallbackMessage = 'An error occurred') => {
  const message = error?.message || fallbackMessage;
  return showError(dispatch, message);
};

/**
 * Create a notification handler object with bound dispatch
 * @param {Object} dispatch - Redux dispatch function
 * @returns {Object} Notification handler object
 */
export const createNotificationHandler = (dispatch) => {
  return {
    success: (message, title, duration) => showSuccess(dispatch, message, title, duration),
    error: (message, title, duration) => showError(dispatch, message, title, duration),
    warning: (message, title, duration) => showWarning(dispatch, message, title, duration),
    info: (message, title, duration) => showInfo(dispatch, message, title, duration),
    apiError: (error, fallbackMessage) => showApiError(dispatch, error, fallbackMessage),
    dismiss: (id) => dismissNotification(dispatch, id),
  };
};
