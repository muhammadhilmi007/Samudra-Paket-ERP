/**
 * NotificationCenter Component
 * Displays notifications and alerts to users
 */

'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectNotifications, 
  removeNotification,
  markNotificationsAsRead 
} from '../../store/slices/uiSlice';
import { NOTIFICATION_TYPES } from '../../utils/notificationUtils';
import Typography from '../atoms/Typography';

const NotificationCenter = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  
  // Auto-dismiss notifications based on their duration
  useEffect(() => {
    // Create a Map to store timeouts by notification ID
    const timeouts = new Map();
    
    notifications.forEach((notification) => {
      if (notification.duration > 0 && !timeouts.has(notification.id)) {
        const timeoutId = setTimeout(() => {
          dispatch(removeNotification(notification.id));
          timeouts.delete(notification.id);
        }, notification.duration);
        
        // Store the timeout ID in our local Map instead of modifying the notification object
        timeouts.set(notification.id, timeoutId);
      }
    });
    
    // Cleanup function to clear all timeouts when component unmounts or notifications change
    return () => {
      timeouts.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, [notifications, dispatch]);
  
  // Handle notification dismiss
  const handleDismiss = (id) => {
    dispatch(removeNotification(id));
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case NOTIFICATION_TYPES.ERROR:
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case NOTIFICATION_TYPES.WARNING:
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case NOTIFICATION_TYPES.INFO:
      default:
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };
  
  // Get background color based on notification type
  const getNotificationBgColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'bg-green-50';
      case NOTIFICATION_TYPES.ERROR:
        return 'bg-red-50';
      case NOTIFICATION_TYPES.WARNING:
        return 'bg-yellow-50';
      case NOTIFICATION_TYPES.INFO:
      default:
        return 'bg-blue-50';
    }
  };
  
  // Get border color based on notification type
  const getNotificationBorderColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'border-green-400';
      case NOTIFICATION_TYPES.ERROR:
        return 'border-red-400';
      case NOTIFICATION_TYPES.WARNING:
        return 'border-yellow-400';
      case NOTIFICATION_TYPES.INFO:
      default:
        return 'border-blue-400';
    }
  };
  
  if (!notifications.length) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`max-w-sm w-full ${getNotificationBgColor(notification.type)} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 ${getNotificationBorderColor(notification.type)}`}
          >
            <div className="p-4">
              <div className="flex items-start">
                {getNotificationIcon(notification.type)}
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <Typography variant="subtitle2" className="text-gray-900">
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" className="mt-1 text-gray-500">
                    {notification.message}
                  </Typography>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => handleDismiss(notification.id)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
