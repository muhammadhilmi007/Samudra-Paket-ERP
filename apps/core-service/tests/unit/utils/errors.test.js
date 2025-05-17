const {
  ApplicationError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ServiceUnavailableError,
  BadGatewayError,
  errorHandler
} = require('../../../src/utils/errors');

describe('Error Utilities', () => {
  describe('Custom Error Classes', () => {
    test('ApplicationError should have correct properties', () => {
      const message = 'Test application error';
      const statusCode = 500;
      const error = new ApplicationError(message, statusCode);

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ApplicationError');
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.stack).toBeDefined();
    });

    test('ValidationError should have correct properties', () => {
      const message = 'Test validation error';
      const error = new ValidationError(message);

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(400);
    });

    test('ValidationError should have default message', () => {
      const error = new ValidationError();
      expect(error.message).toBe('Validation failed');
    });

    test('NotFoundError should have correct properties', () => {
      const message = 'Test not found error';
      const error = new NotFoundError(message);

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error.name).toBe('NotFoundError');
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(404);
    });

    test('NotFoundError should have default message', () => {
      const error = new NotFoundError();
      expect(error.message).toBe('Resource not found');
    });

    test('UnauthorizedError should have correct properties', () => {
      const message = 'Test unauthorized error';
      const error = new UnauthorizedError(message);

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error.name).toBe('UnauthorizedError');
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(401);
    });

    test('UnauthorizedError should have default message', () => {
      const error = new UnauthorizedError();
      expect(error.message).toBe('Unauthorized access');
    });

    test('ForbiddenError should have correct properties', () => {
      const message = 'Test forbidden error';
      const error = new ForbiddenError(message);

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error.name).toBe('ForbiddenError');
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(403);
    });

    test('ForbiddenError should have default message', () => {
      const error = new ForbiddenError();
      expect(error.message).toBe('Forbidden access');
    });

    test('ConflictError should have correct properties', () => {
      const message = 'Test conflict error';
      const error = new ConflictError(message);

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error.name).toBe('ConflictError');
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(409);
    });

    test('ConflictError should have default message', () => {
      const error = new ConflictError();
      expect(error.message).toBe('Resource conflict');
    });

    test('ServiceUnavailableError should have correct properties', () => {
      const message = 'Test service unavailable error';
      const error = new ServiceUnavailableError(message);

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error.name).toBe('ServiceUnavailableError');
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(503);
    });

    test('ServiceUnavailableError should have default message', () => {
      const error = new ServiceUnavailableError();
      expect(error.message).toBe('Service unavailable');
    });

    test('BadGatewayError should have correct properties', () => {
      const message = 'Test bad gateway error';
      const error = new BadGatewayError(message);

      expect(error).toBeInstanceOf(ApplicationError);
      expect(error.name).toBe('BadGatewayError');
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(502);
    });

    test('BadGatewayError should have default message', () => {
      const error = new BadGatewayError();
      expect(error.message).toBe('Bad gateway');
    });
  });

  describe('Error Handler Middleware', () => {
    let req;
    let res;
    let next;
    let consoleErrorSpy;

    beforeEach(() => {
      req = {};
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    test('should handle ApplicationError with correct status code', () => {
      const error = new ValidationError('Invalid input');
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid input'
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    test('should handle regular Error with 500 status code', () => {
      const error = new Error('Something went wrong');
      
      errorHandler(error, req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Something went wrong'
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    test('should include stack trace in development environment', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const error = new Error('Development error');
      error.stack = 'Stack trace';
      
      errorHandler(error, req, res, next);
      
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Development error',
        stack: 'Stack trace'
      });
      
      process.env.NODE_ENV = originalNodeEnv;
    });

    test('should use default message if error message is not provided', () => {
      const error = new Error();
      error.message = null;
      
      errorHandler(error, req, res, next);
      
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal Server Error'
      });
    });
  });
});
