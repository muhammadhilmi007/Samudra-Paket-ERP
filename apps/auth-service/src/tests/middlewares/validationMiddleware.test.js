/**
 * Validation Middleware Tests
 * Tests the validation middleware functionality
 */

const { validate } = require('../../api/middlewares/validationMiddleware');
const Joi = require('joi');

// Mock request and response
const mockRequest = () => {
  const req = {};
  req.body = {};
  req.query = {};
  req.params = {};
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Validation Middleware', () => {
  describe('validate', () => {
    it('should pass validation with valid data', () => {
      // Create validation schema
      const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(8).required()
      });
      
      // Setup request with valid data
      const req = mockRequest();
      req.body = {
        username: 'testuser',
        password: 'Password123!'
      };
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      validate(schema)(req, res, next);
      
      // Assertions
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    
    it('should return 400 with invalid data', () => {
      // Create validation schema
      const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(8).required()
      });
      
      // Setup request with invalid data
      const req = mockRequest();
      req.body = {
        username: 'te', // Too short
        password: '123' // Too short
      };
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      validate(schema)(req, res, next);
      
      // Assertions
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('Validation failed'),
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: 'username',
              message: expect.stringContaining('length must be at least 3 characters')
            }),
            expect.objectContaining({
              field: 'password',
              message: expect.stringContaining('length must be at least 8 characters')
            })
          ])
        })
      );
    });
    
    it('should return 400 with missing required fields', () => {
      // Create validation schema
      const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(8).required()
      });
      
      // Setup request with missing fields
      const req = mockRequest();
      req.body = {
        // Missing username and password
      };
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      validate(schema)(req, res, next);
      
      // Assertions
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('Validation failed'),
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: 'username',
              message: expect.stringContaining('required')
            }),
            expect.objectContaining({
              field: 'password',
              message: expect.stringContaining('required')
            })
          ])
        })
      );
    });
    
    it('should validate query parameters', () => {
      // Create validation schema for query
      const schema = Joi.object({
        page: Joi.number().integer().min(1).required(),
        limit: Joi.number().integer().min(1).max(100).required()
      });
      
      // Setup request with valid query
      const req = mockRequest();
      req.query = {
        page: 1,
        limit: 20
      };
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      validate(schema, 'query')(req, res, next);
      
      // Assertions
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    
    it('should validate params', () => {
      // Create validation schema for params
      const schema = Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
      });
      
      // Setup request with valid params
      const req = mockRequest();
      req.params = {
        id: '60d21b4667d0d8992e610c85' // Valid MongoDB ObjectId
      };
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      validate(schema, 'params')(req, res, next);
      
      // Assertions
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    
    it('should handle Joi validation options', () => {
      // Create validation schema with custom options
      const schema = Joi.object({
        email: Joi.string().email().required()
      });
      
      // Setup request with data that needs conversion
      const req = mockRequest();
      req.body = {
        email: 'TEST@EXAMPLE.COM' // Will be converted to lowercase with abortEarly: false
      };
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware with custom options
      validate(schema, 'body', { abortEarly: false, convert: true })(req, res, next);
      
      // Assertions
      expect(next).toHaveBeenCalled();
      expect(req.body.email).toBe('test@example.com'); // Converted to lowercase
    });
    
    it('should handle complex validation schemas', () => {
      // Create complex validation schema
      const addressSchema = Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().length(2).required(),
        zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required()
      });
      
      const userSchema = Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        age: Joi.number().integer().min(18).required(),
        address: addressSchema.required(),
        tags: Joi.array().items(Joi.string()).min(1)
      });
      
      // Setup request with valid complex data
      const req = mockRequest();
      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345'
        },
        tags: ['customer', 'premium']
      };
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      validate(userSchema)(req, res, next);
      
      // Assertions
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    
    it('should handle custom error messages', () => {
      // Create validation schema with custom error messages
      const schema = Joi.object({
        username: Joi.string().min(3).max(30).required().messages({
          'string.min': 'Username must be at least {#limit} characters',
          'any.required': 'Username is required'
        }),
        password: Joi.string().min(8).required().messages({
          'string.min': 'Password must be at least {#limit} characters',
          'any.required': 'Password is required'
        })
      });
      
      // Setup request with invalid data
      const req = mockRequest();
      req.body = {
        username: 'te', // Too short
        // Missing password
      };
      
      const res = mockResponse();
      const next = jest.fn();
      
      // Call middleware
      validate(schema)(req, res, next);
      
      // Assertions
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          code: 'VALIDATION_ERROR',
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: 'username',
              message: 'Username must be at least 3 characters'
            }),
            expect.objectContaining({
              field: 'password',
              message: 'Password is required'
            })
          ])
        })
      );
    });
  });
});
