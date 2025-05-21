/**
 * useWebSocket Hook
 * Custom React hook for using WebSocket functionality in components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import webSocketService, { WS_EVENT_TYPES } from '../utils/webSocketService';

/**
 * Hook for WebSocket functionality
 * @param {Object} options - Configuration options
 * @param {Array<string>} options.subscriptions - Event types to subscribe to
 * @param {boolean} options.autoConnect - Whether to connect automatically
 * @returns {Object} WebSocket methods and state
 */
export const useWebSocket = (options = {}) => {
  const { subscriptions = [], autoConnect = true } = options;
  
  // Get authentication state from Redux
  const { user, token } = useSelector((state) => state.auth);
  
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // Message state
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  
  // Track subscriptions with refs to avoid dependency issues
  const subscriptionsRef = useRef(subscriptions);
  const unsubscribeFunctions = useRef([]);
  
  // Initialize WebSocket connection
  const connect = useCallback(async () => {
    if (!user?.id || !token) {
      setConnectionError('Authentication required');
      return false;
    }
    
    try {
      const success = await webSocketService.initialize({
        userId: user.id,
        authToken: token,
      });
      
      setIsConnected(success);
      
      if (!success) {
        setConnectionError('Failed to connect');
      } else {
        setConnectionError(null);
      }
      
      return success;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setConnectionError(error.message || 'Connection error');
      return false;
    }
  }, [user?.id, token]);
  
  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
  }, []);
  
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
  
  // Handle connection status changes
  const handleConnectionChange = useCallback((status) => {
    setIsConnected(status.isConnected);
    setReconnectAttempts(status.reconnectAttempts);
  }, []);
  
  // Handle incoming messages
  const handleMessage = useCallback((message) => {
    setLastMessage(message);
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);
  
  // Setup subscriptions
  useEffect(() => {
    subscriptionsRef.current = subscriptions;
    
    // Clear previous subscriptions
    unsubscribeFunctions.current.forEach((unsubscribe) => unsubscribe());
    unsubscribeFunctions.current = [];
    
    // Add connection status subscriptions
    unsubscribeFunctions.current.push(
      webSocketService.subscribe(WS_EVENT_TYPES.CONNECT, () => {
        setIsConnected(true);
        setConnectionError(null);
      }),
      
      webSocketService.subscribe(WS_EVENT_TYPES.DISCONNECT, (data) => {
        setIsConnected(false);
        if (data.error) {
          setConnectionError(data.error);
        }
      }),
      
      webSocketService.subscribe(WS_EVENT_TYPES.RECONNECT, (data) => {
        setIsConnected(true);
        setConnectionError(null);
        setReconnectAttempts(data.attempts);
      })
    );
    
    // Add user-specified subscriptions
    subscriptionsRef.current.forEach((eventType) => {
      const unsubscribe = webSocketService.subscribe(eventType, handleMessage);
      unsubscribeFunctions.current.push(unsubscribe);
    });
    
    // Add wildcard subscription to track all messages
    const wildcardUnsubscribe = webSocketService.subscribe('*', handleMessage);
    unsubscribeFunctions.current.push(wildcardUnsubscribe);
    
    // Connect if autoConnect is true
    if (autoConnect && user?.id && token) {
      connect();
    }
    
    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeFunctions.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeFunctions.current = [];
    };
  }, [autoConnect, connect, handleMessage, subscriptions, token, user?.id]);
  
  // Get connection state
  const getConnectionState = useCallback(() => {
    return {
      isConnected,
      reconnectAttempts,
      error: connectionError,
    };
  }, [isConnected, reconnectAttempts, connectionError]);
  
  // Clear message history
  const clearMessages = useCallback(() => {
    setMessages([]);
    setLastMessage(null);
  }, []);
  
  return {
    // Connection methods
    connect,
    disconnect,
    isConnected,
    connectionError,
    reconnectAttempts,
    getConnectionState,
    
    // Message methods
    sendMessage,
    subscribe,
    lastMessage,
    messages,
    clearMessages,
    
    // Event types for convenience
    EVENT_TYPES: WS_EVENT_TYPES,
  };
};

export default useWebSocket;
