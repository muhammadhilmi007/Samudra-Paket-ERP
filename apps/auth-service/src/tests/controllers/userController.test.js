/**
 * User Controller Tests
 * Tests the User controller functionality
 */

const request = require('supertest');
const express = require('express');
const { userController } = require('../../api/controllers');
const { userRepository, securityLogRepository } = require('../../infrastructure/repositories');
const { authenticateJWT, hasRole } = require('../../api/middlewares');

// Mock repositories
jest.mock('../../infrastructure/repositories/userRepository');
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
app.get('/users', authenticateJWT, hasRole(['admin', 'manager']), userController.getAllUsers);
app.get('/users/:id', authenticateJWT, userController.getUserById);
app.put('/users/:id', authenticateJWT, userController.updateUser);
app.delete('/users/:id', authenticateJWT, hasRole('admin'), userController.deleteUser);
app.get('/users/role/:role', authenticateJWT, hasRole(['admin', 'manager']), userController.getUsersByRole);
app.post('/users/:id/lock', authenticateJWT, hasRole('admin'), userController.lockUserAccount);
app.post('/users/:id/unlock', authenticateJWT, hasRole('admin'), userController.unlockUserAccount);

// Test user data
const testUser = {
  _id: '60d21b4667d0d8992e610c85',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  username: 'testuser',
  role: 'customer'
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock user repository
  userRepository.findAll.mockResolvedValue([testUser]);
  userRepository.countUsers.mockResolvedValue(1);
  userRepository.findById.mockResolvedValue(testUser);
  userRepository.updateUser.mockResolvedValue(testUser);
  userRepository.deleteUser.mockResolvedValue(testUser);
  userRepository.findByRole.mockResolvedValue([testUser]);
  userRepository.lockAccount.mockResolvedValue({
    ...testUser,
    isLocked: true,
    lockedUntil: new Date(Date.now() + 30 * 60 * 1000)
  });
  userRepository.unlockAccount.mockResolvedValue({
    ...testUser,
    isLocked: false,
    lockedUntil: null,
    failedLoginAttempts: 0
  });
  
  // Mock security log repository
  securityLogRepository.createLog.mockResolvedValue({});
});

describe('User Controller', () => {
  describe('getAllUsers', () => {
    it('should get all users with pagination', async () => {
      // Test request
      const res = await request(app)
        .get('/users')
        .query({ page: 1, limit: 10 });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.users).toHaveLength(1);
      expect(res.body.data.pagination).toBeDefined();
      
      // Verify that repository was called
      expect(userRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          limit: 10
        })
      );
      expect(userRepository.countUsers).toHaveBeenCalled();
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      userRepository.findAll.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .get('/users');
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('getUserById', () => {
    it('should get user by ID', async () => {
      // Test request
      const res = await request(app)
        .get(`/users/${testUser._id}`);
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data._id).toBe(testUser._id);
      
      // Verify that repository was called
      expect(userRepository.findById).toHaveBeenCalledWith(testUser._id);
    });
    
    it('should return 404 if user not found', async () => {
      // Mock repository to return null
      userRepository.findById.mockResolvedValue(null);
      
      // Test request
      const res = await request(app)
        .get(`/users/${testUser._id}`);
      
      // Assertions
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('NOT_FOUND');
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      userRepository.findById.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .get(`/users/${testUser._id}`);
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('updateUser', () => {
    it('should update user', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };
      
      // Test request
      const res = await request(app)
        .put(`/users/${testUser._id}`)
        .send(updateData);
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('updated successfully');
      expect(res.body.data).toBeDefined();
      
      // Verify that repository was called
      expect(userRepository.updateUser).toHaveBeenCalledWith(
        testUser._id,
        updateData
      );
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: testUser._id,
          eventType: 'ACCOUNT_UPDATE'
        })
      );
    });
    
    it('should prevent updating sensitive fields', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        password: 'NewPassword123!',
        passwordHistory: ['hash1', 'hash2'],
        verificationToken: 'token',
        resetPasswordToken: 'token'
      };
      
      // Test request
      const res = await request(app)
        .put(`/users/${testUser._id}`)
        .send(updateData);
      
      // Assertions
      expect(res.status).toBe(200);
      
      // Verify that repository was called with sanitized data
      expect(userRepository.updateUser).toHaveBeenCalledWith(
        testUser._id,
        expect.objectContaining({
          firstName: 'Updated',
          lastName: 'Name'
        })
      );
      
      // Verify that sensitive fields were not included
      expect(userRepository.updateUser).not.toHaveBeenCalledWith(
        testUser._id,
        expect.objectContaining({
          password: expect.anything(),
          passwordHistory: expect.anything(),
          verificationToken: expect.anything(),
          resetPasswordToken: expect.anything()
        })
      );
    });
    
    it('should return 404 if user not found', async () => {
      // Mock repository to return null
      userRepository.updateUser.mockResolvedValue(null);
      
      // Test request
      const res = await request(app)
        .put(`/users/${testUser._id}`)
        .send({ firstName: 'Updated' });
      
      // Assertions
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('NOT_FOUND');
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      userRepository.updateUser.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .put(`/users/${testUser._id}`)
        .send({ firstName: 'Updated' });
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('deleteUser', () => {
    it('should delete user', async () => {
      // Test request
      const res = await request(app)
        .delete(`/users/${testUser._id}`);
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('deleted successfully');
      
      // Verify that repository was called
      expect(userRepository.deleteUser).toHaveBeenCalledWith(testUser._id);
    });
    
    it('should return 404 if user not found', async () => {
      // Mock repository to return null
      userRepository.deleteUser.mockResolvedValue(null);
      
      // Test request
      const res = await request(app)
        .delete(`/users/${testUser._id}`);
      
      // Assertions
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('NOT_FOUND');
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      userRepository.deleteUser.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .delete(`/users/${testUser._id}`);
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('getUsersByRole', () => {
    it('should get users by role', async () => {
      // Test request
      const res = await request(app)
        .get('/users/role/customer')
        .query({ page: 1, limit: 10 });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.users).toHaveLength(1);
      expect(res.body.data.pagination).toBeDefined();
      
      // Verify that repository was called
      expect(userRepository.findByRole).toHaveBeenCalledWith(
        'customer',
        expect.objectContaining({
          skip: 0,
          limit: 10
        })
      );
      expect(userRepository.countUsers).toHaveBeenCalledWith({ role: 'customer' });
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      userRepository.findByRole.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .get('/users/role/customer');
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('lockUserAccount', () => {
    it('should lock user account', async () => {
      // Test request
      const res = await request(app)
        .post(`/users/${testUser._id}/lock`);
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('locked successfully');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.isLocked).toBe(true);
      expect(res.body.data.lockedUntil).toBeDefined();
      
      // Verify that repository was called
      expect(userRepository.lockAccount).toHaveBeenCalledWith(
        testUser._id,
        expect.any(Date)
      );
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: testUser._id,
          eventType: 'ACCOUNT_LOCK'
        })
      );
    });
    
    it('should return 404 if user not found', async () => {
      // Mock repository to return null
      userRepository.lockAccount.mockResolvedValue(null);
      
      // Test request
      const res = await request(app)
        .post(`/users/${testUser._id}/lock`);
      
      // Assertions
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('NOT_FOUND');
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      userRepository.lockAccount.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .post(`/users/${testUser._id}/lock`);
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('unlockUserAccount', () => {
    it('should unlock user account', async () => {
      // Test request
      const res = await request(app)
        .post(`/users/${testUser._id}/unlock`);
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('unlocked successfully');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.isLocked).toBe(false);
      expect(res.body.data.failedLoginAttempts).toBe(0);
      
      // Verify that repository was called
      expect(userRepository.unlockAccount).toHaveBeenCalledWith(testUser._id);
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: testUser._id,
          eventType: 'ACCOUNT_UNLOCK'
        })
      );
    });
    
    it('should return 404 if user not found', async () => {
      // Mock repository to return null
      userRepository.unlockAccount.mockResolvedValue(null);
      
      // Test request
      const res = await request(app)
        .post(`/users/${testUser._id}/unlock`);
      
      // Assertions
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('NOT_FOUND');
    });
    
    it('should handle service errors', async () => {
      // Mock repository to throw error
      userRepository.unlockAccount.mockRejectedValue(new Error('Database error'));
      
      // Test request
      const res = await request(app)
        .post(`/users/${testUser._id}/unlock`);
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
});
