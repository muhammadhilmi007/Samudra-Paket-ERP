/**
 * WebSocket Service
 * Handles real-time communication for the Samudra Paket ERP application
 */

// Event types for WebSocket messages
export const WS_EVENT_TYPES = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  
  // Shipment events
  SHIPMENT_CREATED: 'shipment:created',
  SHIPMENT_UPDATED: 'shipment:updated',
  SHIPMENT_STATUS_CHANGED: 'shipment:status_changed',
  
  // Pickup events
  PICKUP_ASSIGNED: 'pickup:assigned',
  PICKUP_STARTED: 'pickup:started',
  PICKUP_COMPLETED: 'pickup:completed',
  PICKUP_CANCELLED: 'pickup:cancelled',
  
  // Delivery events
  DELIVERY_ASSIGNED: 'delivery:assigned',
  DELIVERY_STARTED: 'delivery:started',
  DELIVERY_COMPLETED: 'delivery:completed',
  DELIVERY_FAILED: 'delivery:failed',
  
  // User events
  USER_ACTIVITY: 'user:activity',
  USER_NOTIFICATION: 'user:notification',
  
  // System events
  SYSTEM_ALERT: 'system:alert',
  SYSTEM_MAINTENANCE: 'system:maintenance',
};

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000; // 5 seconds
    this.listeners = new Map();
    this.pendingMessages = [];
    this.userId = null;
    this.authToken = null;
  }

  /**
   * Initialize the WebSocket connection
   * @param {Object} options - Connection options
   * @param {string} options.userId - User ID for authentication
   * @param {string} options.authToken - Authentication token
   * @param {string} options.url - WebSocket server URL
   * @returns {Promise<boolean>} Connection success
   */
  async initialize(options = {}) {
    if (typeof window === 'undefined') return false;
    
    this.userId = options.userId;
    this.authToken = options.authToken;
    
    const url = options.url || this.getWebSocketUrl();
    
    return new Promise((resolve) => {
      try {
        this.socket = new WebSocket(url);
        
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Authenticate the connection
          this.sendMessage({
            type: WS_EVENT_TYPES.CONNECT,
            userId: this.userId,
            authToken: this.authToken,
            timestamp: new Date().toISOString(),
          });
          
          // Send any pending messages
          this.processPendingMessages();
          
          resolve(true);
        };
        
        this.socket.onclose = (event) => {
          console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
          this.isConnected = false;
          
          // Notify listeners about disconnection
          this.notifyListeners(WS_EVENT_TYPES.DISCONNECT, {
            code: event.code,
            reason: event.reason,
          });
          
          // Attempt to reconnect
          this.attemptReconnect();
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          
          // Notify listeners about error
          this.notifyListeners(WS_EVENT_TYPES.DISCONNECT, {
            error: 'Connection error',
          });
        };
        
        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        resolve(false);
      }
    });
  }

  /**
   * Get the WebSocket server URL
   * @returns {string} WebSocket URL
   */
  getWebSocketUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_WS_HOST || window.location.host;
    const path = process.env.NEXT_PUBLIC_WS_PATH || '/ws';
    
    return `${protocol}//${host}${path}`;
  }

  /**
   * Attempt to reconnect to the WebSocket server
   */
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnect attempts reached');
      return;
    }
    
    this.reconnectAttempts++;
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.initialize({
        userId: this.userId,
        authToken: this.authToken,
      }).then((success) => {
        if (success) {
          // Notify listeners about reconnection
          this.notifyListeners(WS_EVENT_TYPES.RECONNECT, {
            attempts: this.reconnectAttempts,
          });
        }
      });
    }, this.reconnectInterval);
  }

  /**
   * Handle incoming WebSocket messages
   * @param {Object} message - Message data
   */
  handleMessage(message) {
    if (!message || !message.type) {
      console.error('Invalid message format:', message);
      return;
    }
    
    // Notify listeners for this message type
    this.notifyListeners(message.type, message.data || {});
    
    // Also notify wildcard listeners
    this.notifyListeners('*', {
      type: message.type,
      data: message.data || {},
    });
  }

  /**
   * Send a message to the WebSocket server
   * @param {Object} message - Message to send
   * @returns {boolean} Send success
   */
  sendMessage(message) {
    if (!message) return false;
    
    // Add timestamp if not present
    if (!message.timestamp) {
      message.timestamp = new Date().toISOString();
    }
    
    // If not connected, queue the message for later
    if (!this.isConnected) {
      this.pendingMessages.push(message);
      return false;
    }
    
    try {
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      
      // Queue the message for retry
      this.pendingMessages.push(message);
      return false;
    }
  }

  /**
   * Process any pending messages
   */
  processPendingMessages() {
    if (this.pendingMessages.length === 0) return;
    
    console.log(`Processing ${this.pendingMessages.length} pending messages`);
    
    const messages = [...this.pendingMessages];
    this.pendingMessages = [];
    
    messages.forEach((message) => {
      this.sendMessage(message);
    });
  }

  /**
   * Subscribe to WebSocket events
   * @param {string} eventType - Event type to listen for
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(eventType, callback) {
    if (!eventType || typeof callback !== 'function') {
      console.error('Invalid subscription parameters');
      return () => {};
    }
    
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    const listeners = this.listeners.get(eventType);
    listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      if (this.listeners.has(eventType)) {
        const listeners = this.listeners.get(eventType);
        listeners.delete(callback);
        
        if (listeners.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  /**
   * Notify all listeners for a specific event type
   * @param {string} eventType - Event type
   * @param {Object} data - Event data
   */
  notifyListeners(eventType, data) {
    if (this.listeners.has(eventType)) {
      const listeners = this.listeners.get(eventType);
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket listener for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.socket && this.isConnected) {
      this.socket.close();
      this.isConnected = false;
      this.socket = null;
    }
  }

  /**
   * Check if the WebSocket is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.isConnected;
  }

  /**
   * Get the current connection state
   * @returns {Object} Connection state
   */
  getConnectionState() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      pendingMessages: this.pendingMessages.length,
    };
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
