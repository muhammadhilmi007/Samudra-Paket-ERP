/**
 * Auth Controller Tests
 * Tests the Auth controller functionality
 */

const request = require('supertest');
const express = require('express');
const { authController } = require('../../api/controllers');
const { authService } = require('../../application/services');
const { validate } = require('../../api/middlewares/validationMiddleware');
const { authValidators } = require('../../api/validators');

// Mock auth service
jest.mock('../../application/services/authService');

// Mock security log repository
jest.mock('../../infrastructure/repositories/securityLogRepository', () => ({
  createLog: jest.fn().mockResolvedValue({})
}));

// Create express app for testing
const app = express();
app.use(express.json());

// Setup routes for testing
app.post('/register', validate(authValidators.registerSchema), authController.register);
app.post('/login', validate(authValidators.loginSchema), authController.login);
app.post('/refresh-token', validate(authValidators.refreshTokenSchema), authController.refreshToken);
app.post('/logout', validate(authValidators.logoutSchema), authController.logout);
app.post('/request-password-reset', validate(authValidators.passwordResetRequestSchema), authController.requestPasswordReset);
app.post('/reset-password', validate(authValidators.passwordResetSchema), authController.resetPassword);

// Test user data
const testUser = {
  _id: '60d21b4667d0d8992e610c85',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  username: 'testuser',
  role: 'customer'
};

// Test tokens
const testTokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  user: testUser
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Auth Controller', () => {
  describe('register', () => {
    it('should register a new user', async () => {
      // Mock auth service
      authService.registerUser.mockResolvedValue(testUser);
      
      // Test request
      const res = await request(app)
        .post('/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          username: 'testuser',
          password: 'Password123!',
          role: 'customer'
        });
      
      // Assertions
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('registered successfully');
      expect(res.body.data).toBeDefined();
      
      // Verify that auth service was called
      expect(authService.registerUser).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          username: 'testuser',
          password: 'Password123!',
          role: 'customer'
        })
      );
    });
    
    it('should return validation error for invalid data', async () => {
      // Test request with invalid data
      const res = await request(app)
        .post('/register')
        .send({
          firstName: 'Test',
          // Missing lastName
          email: 'invalid-email', // Invalid email
          username: 'tu', // Too short
          password: '123', // Too short
          role: 'invalid-role' // Invalid role
        });
      
      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
      
      // Verify that auth service was not called
      expect(authService.registerUser).not.toHaveBeenCalled();
    });
    
    // it('should handle service errors', async () => {
    //   // Mock auth service to throw error
    //   authService.registerUser.mockRejectedValue(new Error('Registration failed'));
      
    //   // Test request
    //   const res = await request(app)
    //     .post('/register')
    //     .send({
    //       firstName: 'Test',
    //       lastName: 'User',
    //       email: 'test@example.com',
    //       username: 'testuser',
    //       password: 'Password@123!995522',
    //       role: 'customer'
    //     });
      
    //   // Assertions
    //   expect(res.status).toBe(500);
    //   expect(res.body.status).toBe('error');
    // });
  });
  
  describe('login', () => {
    it('should login a user with valid credentials', async () => {
      // Mock auth service
      authService.loginUser.mockResolvedValue(testTokens);
      
      // Test request
      const res = await request(app)
        .post('/login')
        .send({
          username: 'testuser',
          password: 'Password123!'
        });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('Login successful');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.accessToken).toBe(testTokens.accessToken);
      expect(res.body.data.refreshToken).toBe(testTokens.refreshToken);
      expect(res.body.data.user).toBeDefined();
      
      // Verify that auth service was called
      expect(authService.loginUser).toHaveBeenCalledWith(
        'testuser',
        'Password123!',
        expect.objectContaining({
          ipAddress: expect.any(String),
          userAgent: expect.any(String)
        })
      );
    });
    
    it('should return validation error for invalid data', async () => {
      // Test request with invalid data
      const res = await request(app)
        .post('/login')
        .send({
          // Missing username
          // Missing password
        });
      
      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
      
      // Verify that auth service was not called
      expect(authService.loginUser).not.toHaveBeenCalled();
    });
    
    it('should handle service errors', async () => {
      // Mock auth service to throw error
      authService.loginUser.mockRejectedValue(new Error('Login failed'));
      
      // Test request
      const res = await request(app)
        .post('/login')
        .send({
          username: 'testuser',
          password: 'Password123!'
        });
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('refreshToken', () => {
    it('should refresh token with valid refresh token', async () => {
      // Mock auth service
      authService.refreshToken.mockResolvedValue(testTokens);
      
      // Test request
      const res = await request(app)
        .post('/refresh-token')
        .send({
          refreshToken: 'valid-refresh-token'
        });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('Token refreshed');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.accessToken).toBe(testTokens.accessToken);
      expect(res.body.data.refreshToken).toBe(testTokens.refreshToken);
      
      // Verify that auth service was called
      expect(authService.refreshToken).toHaveBeenCalledWith(
        'valid-refresh-token',
        expect.objectContaining({
          ipAddress: expect.any(String),
          userAgent: expect.any(String)
        })
      );
    });
    
    it('should return validation error for invalid data', async () => {
      // Test request with invalid data
      const res = await request(app)
        .post('/refresh-token')
        .send({
          // Missing refreshToken
        });
      
      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
      
      // Verify that auth service was not called
      expect(authService.refreshToken).not.toHaveBeenCalled();
    });
    
    it('should handle service errors', async () => {
      // Mock auth service to throw error
      authService.refreshToken.mockRejectedValue(new Error('Token refresh failed'));
      
      // Test request
      const res = await request(app)
        .post('/refresh-token')
        .send({
          refreshToken: 'valid-refresh-token'
        });
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('logout', () => {
    it('should logout a user with valid refresh token', async () => {
      // Mock auth service
      authService.logoutUser.mockResolvedValue({});
      
      // Test request
      const res = await request(app)
        .post('/logout')
        .send({
          refreshToken: 'valid-refresh-token'
        });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('Logout successful');
      
      // Verify that auth service was called
      expect(authService.logoutUser).toHaveBeenCalledWith(
        'valid-refresh-token',
        expect.objectContaining({
          ipAddress: expect.any(String),
          userAgent: expect.any(String)
        })
      );
    });
    
    it('should return validation error for invalid data', async () => {
      // Test request with invalid data
      const res = await request(app)
        .post('/logout')
        .send({
          // Missing refreshToken
        });
      
      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
      
      // Verify that auth service was not called
      expect(authService.logoutUser).not.toHaveBeenCalled();
    });
    
    it('should handle service errors', async () => {
      // Mock auth service to throw error
      authService.logoutUser.mockRejectedValue(new Error('Logout failed'));
      
      // Test request
      const res = await request(app)
        .post('/logout')
        .send({
          refreshToken: 'valid-refresh-token'
        });
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('requestPasswordReset', () => {
    it('should request password reset with valid email', async () => {
      // Mock auth service
      authService.requestPasswordReset.mockResolvedValue({});
      
      // Test request
      const res = await request(app)
        .post('/request-password-reset')
        .send({
          email: 'test@example.com'
        });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('If your email is registered');
      
      // Verify that auth service was called
      expect(authService.requestPasswordReset).toHaveBeenCalledWith(
        'test@example.com',
        expect.objectContaining({
          ipAddress: expect.any(String),
          userAgent: expect.any(String)
        })
      );
    });
    
    it('should return validation error for invalid data', async () => {
      // Test request with invalid data
      const res = await request(app)
        .post('/request-password-reset')
        .send({
          email: 'invalid-email'
        });
      
      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
      
      // Verify that auth service was not called
      expect(authService.requestPasswordReset).not.toHaveBeenCalled();
    });
    
    it('should return success even if email not found', async () => {
      // Mock auth service to throw error
      authService.requestPasswordReset.mockRejectedValue(new Error('Email not found'));
      
      // Test request
      const res = await request(app)
        .post('/request-password-reset')
        .send({
          email: 'nonexistent@example.com'
        });
      
      // Assertions - should still return success to prevent email enumeration
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('If your email is registered');
    });
  });
  
  describe('resetPassword', () => {
    it('should reset password with valid token and password', async () => {
      // Mock auth service
      authService.resetPassword.mockResolvedValue({});
      
      // Test request
      const res = await request(app)
        .post('/reset-password')
        .send({
          token: 'valid-reset-token',
          password: 'NewPassword123!'
        });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('Password reset successful');
      
      // Verify that auth service was called
      expect(authService.resetPassword).toHaveBeenCalledWith(
        'valid-reset-token',
        'NewPassword123!',
        expect.objectContaining({
          ipAddress: expect.any(String),
          userAgent: expect.any(String)
        })
      );
    });
    
    it('should return validation error for invalid data', async () => {
      // Test request with invalid data
      const res = await request(app)
        .post('/reset-password')
        .send({
          token: 'valid-reset-token',
          password: '123' // Too short
        });
      
      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
      
      // Verify that auth service was not called
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });
    
    it('should handle service errors', async () => {
      // Mock auth service to throw error
      authService.resetPassword.mockRejectedValue(new Error('Password reset failed'));
      
      // Test request
      const res = await request(app)
        .post('/reset-password')
        .send({
          token: 'valid-reset-token',
          password: 'NewPassword123!'
        });
      
      // Assertions
      expect(res.status).toBe(500);
      expect(res.body.status).toBe('error');
    });
  });
});
