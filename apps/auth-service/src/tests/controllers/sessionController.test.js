/**
 * Session Controller Tests
 * Tests the Session controller functionality
 */

const request = require('supertest');
const express = require('express');
const { sessionController } = require('../../api/controllers');
const { sessionRepository, securityLogRepository } = require('../../infrastructure/repositories');
const { authenticateJWT, hasRole } = require('../../api/middlewares');

// Mock repositories
jest.mock('../../infrastructure/repositories/sessionRepository');
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
    req.sessionId = '60d21b4667d0d8992e610c86';
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
app.get('/sessions', authenticateJWT, hasRole('admin'), sessionController.getAllSessions);
app.get('/sessions/me', authenticateJWT, sessionController.getUserSessions);
app.delete('/sessions/:sessionId', authenticateJWT, sessionController.revokeSession);
app.delete('/sessions/me/all', authenticateJWT, sessionController.revokeAllSessions);

// Test user ID
const testUserId = '60d21b4667d0d8992e610c85';

// Test session data
const testSession = {
  _id: '60d21b4667d0d8992e610c86',
  userId: testUserId,
  refreshToken: 'refresh-token',
  userAgent: 'Test User Agent',
  ipAddress: '127.0.0.1',
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock session repository
  sessionRepository.findAll.mockResolvedValue([testSession]);
  sessionRepository.countSessions.mockResolvedValue(1);
  sessionRepository.findByUserId.mockResolvedValue([testSession]);
  sessionRepository.findById.mockResolvedValue(testSession);
  sessionRepository.deleteSession.mockResolvedValue(testSession);
  sessionRepository.deleteAllExcept.mockResolvedValue({ deletedCount: 1 });
  
  // Mock security log repository
  securityLogRepository.createLog.mockResolvedValue({});
});

describe('Session Controller', () => {
  describe('getAllSessions', () => {
    it('should get all active sessions with pagination', async () => {
      // Test request
      const res = await request(app)
        .get('/sessions')
        .query({ page: 1, limit: 10 });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.sessions).toHaveLength(1);
      expect(res.body.data.pagination).toBeDefined();
      
      // Verify that repository was called
      expect(sessionRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          limit: 10
        })
      );
      expect(sessionRepository.countSessions).toHaveBeenCalled();
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      sessionRepository.findAll.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .get('/sessions');
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('getUserSessions', () => {
    it('should get user sessions', async () => {
      // Test request
      const res = await request(app)
        .get('/sessions/me');
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.sessions).toHaveLength(1);
      
      // Verify that repository was called
      expect(sessionRepository.findByUserId).toHaveBeenCalledWith(testUserId);
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      sessionRepository.findByUserId.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .get('/sessions/me');
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('revokeSession', () => {
    it('should revoke a specific session', async () => {
      // Test request
      const res = await request(app)
        .delete(`/sessions/${testSession._id}`);
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('revoked successfully');
      
      // Verify that repository was called
      expect(sessionRepository.findById).toHaveBeenCalledWith(testSession._id);
      expect(sessionRepository.deleteSession).toHaveBeenCalledWith(testSession._id);
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: testUserId,
          eventType: 'SESSION_REVOKED'
        })
      );
    });
    
    it('should return 404 if session not found', async () => {
      // Mock repository to return null
      sessionRepository.findById.mockResolvedValue(null);
      
      // Test request
      const res = await request(app)
        .delete(`/sessions/${testSession._id}`);
      
      // Assertions
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('NOT_FOUND');
    });
    
    it('should return 403 if session belongs to another user', async () => {
      // Mock session with different user ID
      const otherUserSession = {
        ...testSession,
        userId: '60d21b4667d0d8992e610c87' // Different user ID
      };
      sessionRepository.findById.mockResolvedValue(otherUserSession);
      
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
      
      // Test request
      const res = await request(app)
        .delete(`/sessions/${testSession._id}`);
      
      // Assertions
      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('FORBIDDEN');
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      sessionRepository.findById.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .delete(`/sessions/${testSession._id}`);
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('revokeAllSessions', () => {
    it('should revoke all sessions except current', async () => {
      // Test request
      const res = await request(app)
        .delete('/sessions/me/all');
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('revoked successfully');
      
      // Verify that repository was called
      expect(sessionRepository.deleteAllExcept).toHaveBeenCalledWith(
        testUserId,
        '60d21b4667d0d8992e610c86' // Current session ID
      );
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: testUserId,
          eventType: 'ALL_SESSIONS_REVOKED'
        })
      );
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      sessionRepository.deleteAllExcept.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .delete('/sessions/me/all');
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
});
