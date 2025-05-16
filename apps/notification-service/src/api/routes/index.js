/**
 * Notification Service Routes
 * Defines all routes for the Notification Service
 */

const express = require('express');
const router = express.Router();

// Import controllers
// In a real implementation, these would be imported from separate controller files
const notificationController = {
  sendNotification: async (req, res) => {
    try {
      const { userId, type, title, message, data } = req.body;
      
      if (!userId || !type || !title || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Validate notification type
      const validTypes = ['email', 'sms', 'push', 'in_app'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: 'Invalid notification type' });
      }
      
      // Simulate sending notification
      const notification = {
        id: Math.random().toString(36).substring(2, 15),
        userId,
        type,
        title,
        message,
        data: data || {},
        status: 'sent',
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      
      res.status(201).json(notification);
    } catch (error) {
      console.error('Send notification error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  getUserNotifications: async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      // Simulate fetching user notifications
      const notifications = [
        {
          id: '1a2b3c',
          userId,
          type: 'in_app',
          title: 'New shipment',
          message: 'Your shipment has been created',
          status: 'sent',
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: '4d5e6f',
          userId,
          type: 'in_app',
          title: 'Delivery update',
          message: 'Your shipment is out for delivery',
          status: 'sent',
          sentAt: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Get user notifications error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  createTemplate: async (req, res) => {
    try {
      const { name, type, subject, content } = req.body;
      
      if (!name || !type || !content) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Validate template type
      const validTypes = ['email', 'sms', 'push', 'in_app'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: 'Invalid template type' });
      }
      
      // Simulate creating template
      const template = {
        id: Math.random().toString(36).substring(2, 15),
        name,
        type,
        subject: subject || '',
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      res.status(201).json(template);
    } catch (error) {
      console.error('Create template error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  getTemplates: async (req, res) => {
    try {
      // Simulate fetching templates
      const templates = [
        {
          id: '1a2b3c',
          name: 'Shipment Created',
          type: 'email',
          subject: 'Your shipment has been created',
          content: 'Hello {{name}}, your shipment with tracking number {{trackingNumber}} has been created.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4d5e6f',
          name: 'Delivery Update',
          type: 'sms',
          content: 'Your shipment {{trackingNumber}} is out for delivery. Expected delivery time: {{deliveryTime}}.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      
      res.status(200).json(templates);
    } catch (error) {
      console.error('Get templates error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

// Define routes
router.post('/notifications', notificationController.sendNotification);
router.get('/notifications/user/:userId', notificationController.getUserNotifications);
router.post('/templates', notificationController.createTemplate);
router.get('/templates', notificationController.getTemplates);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
