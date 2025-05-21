"use client";

/**
 * WebSocket Provider Component
 * Initializes WebSocket connection and provides context for real-time communication
 */

import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import webSocketService, { WS_EVENT_TYPES } from '../../utils/webSocketService';
import { useAnalytics } from '../../hooks/useAnalytics';

// Create context for WebSocket
export const WebSocketContext = createContext(null);

/**
 * WebSocket Provider Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
const WebSocketProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const analytics = useAnalytics({ componentName: 'WebSocketProvider' });

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(async () => {
    if (!isAuthenticated || !user?.id || !token) return;

    try {
      const success = await webSocketService.initialize({
        userId: user.id,
        authToken: token,
      });

      setIsConnected(success);

      if (!success) {
        setConnectionError('Failed to connect to real-time service');
        analytics.trackError(
          analytics.EVENT_ACTIONS.CLIENT_ERROR,
          'WebSocket connection failed',
          { userId: user.id }
        );
      } else {
        setConnectionError(null);
        analytics.trackFeature(
          analytics.EVENT_ACTIONS.ENABLE,
          'RealTimeConnection',
          { userId: user.id }
        );
      }
    } catch (error) {
      console.error('WebSocket initialization error:', error);
      setConnectionError(error.message || 'Connection error');
      analytics.trackError(
        analytics.EVENT_ACTIONS.CLIENT_ERROR,
        'WebSocket initialization error',
        { error: error.message, userId: user.id }
      );
    }
  }, [isAuthenticated, user?.id, token, analytics]);

  // Handle connection events
  useEffect(() => {
    if (!isAuthenticated) return;

    // Connect to WebSocket when authenticated
    initializeWebSocket();

    // Setup event listeners
    const connectListener = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const disconnectListener = (data) => {
      setIsConnected(false);
      if (data.error) {
        setConnectionError(data.error);
      }
    };

    const notificationListener = (data) => {
      setNotifications((prev) => [data, ...prev].slice(0, 50)); // Keep last 50 notifications
      analytics.trackFeature(
        analytics.EVENT_ACTIONS.ENABLE,
        'RealTimeNotification',
        { type: data.type, userId: user?.id }
      );
    };

    // Subscribe to events
    const unsubscribeConnect = webSocketService.subscribe(
      WS_EVENT_TYPES.CONNECT,
      connectListener
    );
    
    const unsubscribeDisconnect = webSocketService.subscribe(
      WS_EVENT_TYPES.DISCONNECT,
      disconnectListener
    );
    
    const unsubscribeNotification = webSocketService.subscribe(
      WS_EVENT_TYPES.USER_NOTIFICATION,
      notificationListener
    );

    // Cleanup on unmount
    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeNotification();
      webSocketService.disconnect();
    };
  }, [isAuthenticated, initializeWebSocket, user?.id, analytics]);

  // Send a message through WebSocket
  const sendMessage = useCallback((type, data = {}) => {
    return webSocketService.sendMessage({
      type,
      data,
      userId: user?.id,
    });
  }, [user?.id]);

  // Subscribe to a specific event type
  const subscribe = useCallback((eventType, callback) => {
    return webSocketService.subscribe(eventType, callback);
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Context value
  const contextValue = {
    isConnected,
    connectionError,
    notifications,
    clearNotifications,
    markNotificationAsRead,
    sendMessage,
    subscribe,
    EVENT_TYPES: WS_EVENT_TYPES,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
