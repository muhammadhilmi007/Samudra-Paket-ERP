/**
 * Auth Middleware Tests
 * Tests the authentication middleware functionality
 */

const jwt = require('jsonwebtoken');
const { authenticateJWT, hasRole } = require('../../api/middlewares/authMiddleware');
const { sessionRepository } = require('../../infrastructure/repositories');

// Mock repositories
jest.mock('../../infrastructure/repositories/sessionRepository');

// Mock request and response
const mockRequest = () => {
  const req = {};
  req.headers = {};
  req.cookies = {};
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set environment variables
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';
  });
  
  describe('authenticateJWT', () => {
    it('should authenticate with valid token in Authorization header', async () => {
      // Create valid token
      const user = {
        id: '60d21b4667d0d8992e610c85',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin'
      };
      
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Mock session repository
      sessionRepository.findById.mockResolvedValue({
        userId: user.id,
        isActive: true
      });
      
      // Setup request with token
      const req = mockRequest();
      req.headers.authorization = `Bearer ${token}`;
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      await authenticateJWT(req, res, next);
      
      // Assertions
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(user.id);
      expect(req.user.username).toBe(user.username);
      expect(req.user.role).toBe(user.role);
    });
    
    it('should authenticate with valid token in cookie', async () => {
      // Create valid token
      const user = {
        id: '60d21b4667d0d8992e610c85',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin'
      };
      
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Mock session repository
      sessionRepository.findById.mockResolvedValue({
        userId: user.id,
        isActive: true
      });
      
      // Setup request with token in cookie
      const req = mockRequest();
      req.cookies.accessToken = token;
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      await authenticateJWT(req, res, next);
      
      // Assertions
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(user.id);
      expect(req.user.username).toBe(user.username);
      expect(req.user.role).toBe(user.role);
    });
    
    it('should return 401 if no token provided', async () => {
      // Setup request without token
      const req = mockRequest();
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      await authenticateJWT(req, res, next);
      
      // Assertions
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        })
      );
    });
    
    it('should return 401 if token is invalid', async () => {
      // Setup request with invalid token
      const req = mockRequest();
      req.headers.authorization = 'Bearer invalid-token';
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      await authenticateJWT(req, res, next);
      
      // Assertions
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          code: 'INVALID_TOKEN',
          message: expect.stringContaining('Invalid token')
        })
      );
    });
    
    it('should return 401 if token is expired', async () => {
      // Create expired token
      const user = {
        id: '60d21b4667d0d8992e610c85',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin'
      };
      
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '0s' });
      
      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Setup request with expired token
      const req = mockRequest();
      req.headers.authorization = `Bearer ${token}`;
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      await authenticateJWT(req, res, next);
      
      // Assertions
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          code: 'TOKEN_EXPIRED',
          message: expect.stringContaining('expired')
        })
      );
    });
    
    it('should return 401 if session is not found', async () => {
      // Create valid token
      const user = {
        id: '60d21b4667d0d8992e610c85',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
        sessionId: '60d21b4667d0d8992e610c86'
      };
      
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Mock session repository to return null
      sessionRepository.findById.mockResolvedValue(null);
      
      // Setup request with token
      const req = mockRequest();
      req.headers.authorization = `Bearer ${token}`;
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      await authenticateJWT(req, res, next);
      
      // Assertions
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          code: 'SESSION_NOT_FOUND',
          message: expect.stringContaining('Session not found')
        })
      );
    });
    
    it('should return 401 if session is inactive', async () => {
      // Create valid token
      const user = {
        id: '60d21b4667d0d8992e610c85',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
        sessionId: '60d21b4667d0d8992e610c86'
      };
      
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Mock session repository to return inactive session
      sessionRepository.findById.mockResolvedValue({
        userId: user.id,
        isActive: false
      });
      
      // Setup request with token
      const req = mockRequest();
      req.headers.authorization = `Bearer ${token}`;
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      await authenticateJWT(req, res, next);
      
      // Assertions
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          code: 'SESSION_INACTIVE',
          message: expect.stringContaining('Session is inactive')
        })
      );
    });
  });
  
  describe('hasRole', () => {
    it('should allow access if user has required role', () => {
      // Setup request with user
      const req = mockRequest();
      req.user = {
        id: '60d21b4667d0d8992e610c85',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin'
      };
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      const middleware = hasRole('admin');
      middleware(req, res, next);
      
      // Assertions
      expect(next).toHaveBeenCalled();
    });
    
    it('should allow access if user has one of required roles', () => {
      // Setup request with user
      const req = mockRequest();
      req.user = {
        id: '60d21b4667d0d8992e610c85',
        username: 'testuser',
        email: 'test@example.com',
        role: 'manager'
      };
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      const middleware = hasRole(['admin', 'manager']);
      middleware(req, res, next);
      
      // Assertions
      expect(next).toHaveBeenCalled();
    });
    
    it('should deny access if user does not have required role', () => {
      // Setup request with user
      const req = mockRequest();
      req.user = {
        id: '60d21b4667d0d8992e610c85',
        username: 'testuser',
        email: 'test@example.com',
        role: 'customer'
      };
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      const middleware = hasRole('admin');
      middleware(req, res, next);
      
      // Assertions
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          code: 'FORBIDDEN',
          message: expect.stringContaining('Insufficient permissions')
        })
      );
    });
    
    it('should deny access if user does not have any of required roles', () => {
      // Setup request with user
      const req = mockRequest();
      req.user = {
        id: '60d21b4667d0d8992e610c85',
        username: 'testuser',
        email: 'test@example.com',
        role: 'customer'
      };
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      const middleware = hasRole(['admin', 'manager']);
      middleware(req, res, next);
      
      // Assertions
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          code: 'FORBIDDEN',
          message: expect.stringContaining('Insufficient permissions')
        })
      );
    });
    
    it('should deny access if user is not authenticated', () => {
      // Setup request without user
      const req = mockRequest();
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      const middleware = hasRole('admin');
      middleware(req, res, next);
      
      // Assertions
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          code: 'UNAUTHORIZED',
          message: expect.stringContaining('Authentication required')
        })
      );
    });
  });
});
