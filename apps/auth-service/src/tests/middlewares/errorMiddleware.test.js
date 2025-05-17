/**
 * Error Middleware Tests
 * Tests the error handling middleware functionality
 */

const { errorHandler } = require('../../api/middlewares/errorMiddleware');
const { 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ConflictError, 
  RateLimitError,
  ServerError
} = require('../../utils/errorHandler');

// Mock request and response
const mockRequest = () => {
  const req = {};
  req.method = 'GET';
  req.path = '/api/test';
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock logger
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
}));

describe('Error Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should handle ValidationError', () => {
    // Create error
    const error = new ValidationError('Validation failed', [
      { field: 'username', message: 'Username is required' },
      { field: 'password', message: 'Password must be at least 8 characters' }
    ]);
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    errorHandler(error, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: [
        { field: 'username', message: 'Username is required' },
        { field: 'password', message: 'Password must be at least 8 characters' }
      ]
    });
  });
  
  it('should handle AuthenticationError', () => {
    // Create error
    const error = new AuthenticationError('Invalid credentials');
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    errorHandler(error, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid credentials'
    });
  });
  
  it('should handle AuthorizationError', () => {
    // Create error
    const error = new AuthorizationError('Insufficient permissions');
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    errorHandler(error, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      code: 'FORBIDDEN',
      message: 'Insufficient permissions'
    });
  });
  
  it('should handle NotFoundError', () => {
    // Create error
    const error = new NotFoundError('User not found');
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    errorHandler(error, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      code: 'NOT_FOUND',
      message: 'User not found'
    });
  });
  
  it('should handle ConflictError', () => {
    // Create error
    const error = new ConflictError('Email already exists');
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    errorHandler(error, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      code: 'CONFLICT',
      message: 'Email already exists'
    });
  });
  
  it('should handle RateLimitError', () => {
    // Create error
    const error = new RateLimitError('Too many requests');
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    errorHandler(error, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests'
    });
  });
  
  it('should handle ServerError', () => {
    // Create error
    const error = new ServerError('Internal server error');
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    errorHandler(error, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      code: 'SERVER_ERROR',
      message: 'Internal server error'
    });
  });
  
  it('should handle generic Error in production', () => {
    // Set NODE_ENV to production
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    // Create error
    const error = new Error('Something went wrong');
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    errorHandler(error, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      code: 'SERVER_ERROR',
      message: 'An unexpected error occurred'
    });
    
    // Restore NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });
  
  it('should handle generic Error in development', () => {
    // Set NODE_ENV to development
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    // Create error with stack trace
    const error = new Error('Something went wrong');
    error.stack = 'Error: Something went wrong\n    at Test.it (/test/file.js:123:45)';
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    errorHandler(error, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      code: 'SERVER_ERROR',
      message: 'Something went wrong',
      stack: error.stack
    });
    
    // Restore NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });
  
  it('should handle errors with custom status code', () => {
    // Create error with custom status
    const error = new Error('Payment required');
    error.statusCode = 402;
    error.code = 'PAYMENT_REQUIRED';
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    errorHandler(error, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(402);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      code: 'PAYMENT_REQUIRED',
      message: 'Payment required'
    });
  });
  
  it('should log errors appropriately', () => {
    const logger = require('../../utils/logger');
    
    // Create error
    const error = new ServerError('Database connection failed');
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    errorHandler(error, req, res, next);
    
    // Assertions
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Database connection failed'),
      expect.objectContaining({
        method: 'GET',
        path: '/api/test',
        statusCode: 500
      })
    );
  });
});
