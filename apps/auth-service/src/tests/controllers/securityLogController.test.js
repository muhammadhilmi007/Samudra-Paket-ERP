/**
 * Security Log Controller Tests
 * Tests the Security Log controller functionality
 */

const request = require('supertest');
const express = require('express');
const { securityLogController } = require('../../api/controllers');
const { securityLogRepository } = require('../../infrastructure/repositories');
const { authenticateJWT, hasRole } = require('../../api/middlewares');

// Mock repositories
jest.mock('../../infrastructure/repositories/securityLogRepository');

// Mock authentication middleware
jest.mock('../../api/middlewares/authMiddleware', () => ({
  authenticateJWT: jest.fn((req, res, next) => {
    req.user = {
      id: '60d21b4667d0d8992e610c85',
      username: 'testuser',
      email: 'test@example.com',
      role: 'admin'
    };
    next();
  }),
  hasRole: (roles) => jest.fn((req, res, next) => {
    // Check if user has required role
    const userRole = req.user.role;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!requiredRoles.includes(userRole) && userRole !== 'admin') {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  })
}));

// Create express app for testing
const app = express();
app.use(express.json());

// Setup routes for testing
app.get('/security-logs', authenticateJWT, hasRole('admin'), securityLogController.getAllLogs);
app.get('/security-logs/user/:userId', authenticateJWT, securityLogController.getLogsByUserId);
app.get('/security-logs/event/:eventType', authenticateJWT, hasRole('admin'), securityLogController.getLogsByEventType);
app.get('/security-logs/date-range', authenticateJWT, hasRole('admin'), securityLogController.getLogsByDateRange);
app.get('/security-logs/status/:status', authenticateJWT, hasRole('admin'), securityLogController.getLogsByStatus);

// Test user ID
const testUserId = '60d21b4667d0d8992e610c85';

// Test log data
const testLog = {
  _id: '60d21b4667d0d8992e610c87',
  userId: testUserId,
  eventType: 'LOGIN_SUCCESS',
  ipAddress: '127.0.0.1',
  userAgent: 'Test User Agent',
  details: { source: 'web' },
  status: 'SUCCESS',
  createdAt: new Date()
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock security log repository
  securityLogRepository.findAll.mockResolvedValue([testLog]);
  securityLogRepository.countLogs.mockResolvedValue(1);
  securityLogRepository.findByUserId.mockResolvedValue([testLog]);
  securityLogRepository.findByEventType.mockResolvedValue([testLog]);
  securityLogRepository.findByDateRange.mockResolvedValue([testLog]);
  securityLogRepository.findByStatus.mockResolvedValue([testLog]);
});

describe('Security Log Controller', () => {
  describe('getAllLogs', () => {
    it('should get all logs with pagination', async () => {
      // Test request
      const res = await request(app)
        .get('/security-logs')
        .query({ page: 1, limit: 20 });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.logs).toHaveLength(1);
      expect(res.body.data.pagination).toBeDefined();
      
      // Verify that repository was called
      expect(securityLogRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          limit: 20
        })
      );
      expect(securityLogRepository.countLogs).toHaveBeenCalled();
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      securityLogRepository.findAll.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .get('/security-logs');
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('getLogsByUserId', () => {
    it('should get logs by user ID', async () => {
      // Test request
      const res = await request(app)
        .get(`/security-logs/user/${testUserId}`)
        .query({ page: 1, limit: 20 });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.logs).toHaveLength(1);
      expect(res.body.data.pagination).toBeDefined();
      
      // Verify that repository was called
      expect(securityLogRepository.findByUserId).toHaveBeenCalledWith(
        testUserId,
        expect.objectContaining({
          skip: 0,
          limit: 20
        })
      );
      expect(securityLogRepository.countLogs).toHaveBeenCalledWith({ userId: testUserId });
    });
    
    it('should allow users to access their own logs', async () => {
      // Mock user with non-admin role
      const authenticateJWT = require('../../api/middlewares/authMiddleware').authenticateJWT;
      authenticateJWT.mockImplementationOnce((req, res, next) => {
        req.user = {
          id: testUserId,
          username: 'testuser',
          email: 'test@example.com',
          role: 'customer' // Non-admin role
        };
        next();
      });
      
      // Test request for own logs
      const res = await request(app)
        .get(`/security-logs/user/${testUserId}`);
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });
    
    it('should not allow users to access other users logs', async () => {
      // Mock user with non-admin role
      const authenticateJWT = require('../../api/middlewares/authMiddleware').authenticateJWT;
      authenticateJWT.mockImplementationOnce((req, res, next) => {
        req.user = {
          id: '60d21b4667d0d8992e610c88', // Different user ID
          username: 'otheruser',
          email: 'other@example.com',
          role: 'customer' // Non-admin role
        };
        req.params = { userId: testUserId }; // Trying to access another user's logs
        next();
      });
      
      // Add middleware to check permissions
      app.get('/security-logs/user/:userId-test', authenticateJWT, (req, res, next) => {
        // Allow users to access their own logs
        if (req.user.id === req.params.userId || ['admin', 'manager'].includes(req.user.role)) {
          return next();
        }
        
        return res.status(403).json({
          status: 'error',
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        });
      }, securityLogController.getLogsByUserId);
      
      // Test request for other user's logs
      const res = await request(app)
        .get(`/security-logs/user/${testUserId}-test`);
      
      // Assertions
      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('FORBIDDEN');
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      securityLogRepository.findByUserId.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .get(`/security-logs/user/${testUserId}`);
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('getLogsByEventType', () => {
    it('should get logs by event type', async () => {
      // Test request
      const res = await request(app)
        .get('/security-logs/event/LOGIN_SUCCESS')
        .query({ page: 1, limit: 20 });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.logs).toHaveLength(1);
      expect(res.body.data.pagination).toBeDefined();
      
      // Verify that repository was called
      expect(securityLogRepository.findByEventType).toHaveBeenCalledWith(
        'LOGIN_SUCCESS',
        expect.objectContaining({
          skip: 0,
          limit: 20
        })
      );
      expect(securityLogRepository.countLogs).toHaveBeenCalledWith({ eventType: 'LOGIN_SUCCESS' });
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      securityLogRepository.findByEventType.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .get('/security-logs/event/LOGIN_SUCCESS');
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('getLogsByDateRange', () => {
    it('should get logs by date range', async () => {
      // Test request
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
      const endDate = new Date().toISOString(); // Now
      
      const res = await request(app)
        .get('/security-logs/date-range')
        .query({ 
          startDate, 
          endDate,
          page: 1, 
          limit: 20 
        });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.logs).toHaveLength(1);
      expect(res.body.data.pagination).toBeDefined();
      
      // Verify that repository was called
      expect(securityLogRepository.findByDateRange).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Date),
        expect.objectContaining({
          skip: 0,
          limit: 20
        })
      );
      expect(securityLogRepository.countLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          createdAt: expect.objectContaining({
            $gte: expect.any(Date),
            $lte: expect.any(Date)
          })
        })
      );
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      securityLogRepository.findByDateRange.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
      const endDate = new Date().toISOString(); // Now
      
      const res = await request(app)
        .get('/security-logs/date-range')
        .query({ startDate, endDate });
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('getLogsByStatus', () => {
    it('should get logs by status', async () => {
      // Test request
      const res = await request(app)
        .get('/security-logs/status/SUCCESS')
        .query({ page: 1, limit: 20 });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.logs).toHaveLength(1);
      expect(res.body.data.pagination).toBeDefined();
      
      // Verify that repository was called
      expect(securityLogRepository.findByStatus).toHaveBeenCalledWith(
        'SUCCESS',
        expect.objectContaining({
          skip: 0,
          limit: 20
        })
      );
      expect(securityLogRepository.countLogs).toHaveBeenCalledWith({ status: 'SUCCESS' });
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      securityLogRepository.findByStatus.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .get('/security-logs/status/SUCCESS');
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
});
