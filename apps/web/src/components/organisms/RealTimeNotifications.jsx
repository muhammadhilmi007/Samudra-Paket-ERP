"use client";

/**
 * Real-Time Notifications Component
 * Displays notifications received through WebSockets
 */

import React, { useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { WebSocketContext } from '../providers/WebSocketProvider';
import { useAnalytics } from '../../hooks/useAnalytics';
import Typography from '../atoms/Typography';
import Badge from '../atoms/Badge';
import Card from '../molecules/Card';

const RealTimeNotifications = () => {
  const { notifications, markNotificationAsRead, isConnected, connectionError } = useContext(WebSocketContext);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const analytics = useAnalytics({ componentName: 'RealTimeNotifications' });
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Toggle notifications panel
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      analytics.trackNavigation(
        analytics.EVENT_ACTIONS.OPEN_MODAL,
        'RealTimeNotifications',
        { unreadCount }
      );
    } else {
      analytics.trackNavigation(
        analytics.EVENT_ACTIONS.CLOSE_MODAL,
        'RealTimeNotifications',
        { unreadCount }
      );
    }
  };
  
  // Mark notification as read when clicked
  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    
    analytics.trackUserAction(
      analytics.EVENT_ACTIONS.CLICK,
      'NotificationItem',
      { 
        notificationType: notification.type,
        notificationId: notification.id
      }
    );
    
    // Handle notification action if needed
    if (notification.actionUrl) {
      // Navigate to the action URL
      window.location.href = notification.actionUrl;
    }
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'shipment':
        return '📦';
      case 'pickup':
        return '🚚';
      case 'delivery':
        return '🏠';
      case 'payment':
        return '💰';
      case 'alert':
        return '⚠️';
      case 'system':
        return '🔧';
      default:
        return '📣';
    }
  };
  
  // Get notification color based on priority
  const getNotificationColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-500';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500';
      case 'low':
        return 'bg-blue-100 border-blue-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };
  
  // Format notification timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hr ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Play notification sound for new notifications
  useEffect(() => {
    if (notifications.length > 0 && notifications[0] && !notifications[0].read) {
      // Play notification sound
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch(error => {
        console.error('Failed to play notification sound:', error);
      });
    }
  }, [notifications]);

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        className="relative p-2 text-gray-600 hover:text-primary focus:outline-none"
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <Badge 
            variant="primary" 
            className="absolute -top-1 -right-1"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </button>
      
      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <Typography variant="h3">Notifications</Typography>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <span className="flex items-center text-xs text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                    Live
                  </span>
                ) : (
                  <span className="flex items-center text-xs text-red-600">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                    Offline
                  </span>
                )}
              </div>
            </div>
            
            {connectionError && (
              <div className="mt-2 text-sm text-red-600">
                {connectionError}
              </div>
            )}
          </div>
          
          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 mx-auto text-gray-400 mb-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
                  />
                </svg>
                <Typography>No notifications yet</Typography>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={notification.id || index}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.priority)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <Typography variant="subtitle" className="font-medium">
                          {notification.title}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </Typography>
                      </div>
                      
                      <Typography variant="body2" className="mt-1 text-gray-600">
                        {notification.message}
                      </Typography>
                      
                      {notification.actionLabel && (
                        <div className="mt-2">
                          <button className="text-sm text-primary hover:text-primary-dark font-medium">
                            {notification.actionLabel}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-t border-gray-200 text-center">
              <button 
                className="text-sm text-primary hover:text-primary-dark font-medium"
                onClick={() => {
                  // Mark all as read
                  notifications.forEach(notification => {
                    if (!notification.read) {
                      markNotificationAsRead(notification.id);
                    }
                  });
                  
                  analytics.trackUserAction(
                    analytics.EVENT_ACTIONS.CLICK,
                    'MarkAllNotificationsAsRead',
                    { count: unreadCount }
                  );
                }}
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RealTimeNotifications;
