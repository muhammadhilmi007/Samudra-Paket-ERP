/**
 * Error Handling and Recovery Testing
 * Tests system resilience and error recovery mechanisms
 */

const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const { createLogger } = require('../../../utils/logger');
const errorHandler = require('../../../middleware/errorHandler');
const ApiError = require('../../../utils/ApiError');
const { retryWithBackoff } = require('../../../utils/retry');

// Mock Express request and response
const mockRequest = () => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    get: sinon.stub()
  };
};

const mockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

describe('Error Handling and Recovery Tests', () => {
  let sandbox;
  let logger;
  
  beforeEach(() => {
    // Create a sandbox for sinon stubs
    sandbox = sinon.createSandbox();
    
    // Mock logger
    logger = createLogger('test');
    sandbox.stub(logger, 'error');
    sandbox.stub(logger, 'warn');
    sandbox.stub(logger, 'info');
  });
  
  afterEach(() => {
    // Restore all stubs
    sandbox.restore();
  });
  
  describe('Global Error Handler', () => {
    it('should handle ApiError correctly', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.spy();
      
      const error = new ApiError(400, 'Bad request');
      
      errorHandler(error, req, res, next);
      
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property('message', 'Bad request');
      expect(res.json.firstCall.args[0]).to.have.property('statusCode', 400);
    });
    
    it('should handle validation errors correctly', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.spy();
      
      const validationError = {
        name: 'ValidationError',
        errors: {
          field1: { message: 'Field1 is required' },
          field2: { message: 'Field2 is invalid' }
        }
      };
      
      errorHandler(validationError, req, res, next);
      
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property('message', 'Validation Error');
      expect(res.json.firstCall.args[0]).to.have.property('errors');
      expect(res.json.firstCall.args[0].errors).to.have.length(2);
    });
    
    it('should handle duplicate key errors correctly', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.spy();
      
      const duplicateKeyError = {
        name: 'MongoError',
        code: 11000,
        keyValue: { email: 'test@example.com' }
      };
      
      errorHandler(duplicateKeyError, req, res, next);
      
      expect(res.status.calledWith(409)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property('message', 'Duplicate key error');
      expect(res.json.firstCall.args[0]).to.have.property('field', 'email');
    });
    
    it('should handle unknown errors correctly', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = sinon.spy();
      
      const unknownError = new Error('Something went wrong');
      
      errorHandler(unknownError, req, res, next);
      
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.have.property('message', 'Internal Server Error');
      expect(logger.error.calledOnce).to.be.true;
    });
  });
  
  describe('Retry Mechanism', () => {
    it('should retry failed operations with exponential backoff', async () => {
      const operation = sinon.stub();
      
      // Fail first two attempts, succeed on third
      operation.onCall(0).rejects(new Error('Network error'));
      operation.onCall(1).rejects(new Error('Network error'));
      operation.onCall(2).resolves('Success');
      
      const clock = sinon.useFakeTimers();
      
      // Start the retry operation
      const retryPromise = retryWithBackoff(operation, 3, 100);
      
      // Fast-forward time to trigger retries
      clock.tick(100); // First retry after 100ms
      clock.tick(200); // Second retry after 200ms (exponential backoff)
      
      const result = await retryPromise;
      
      clock.restore();
      
      expect(operation.callCount).to.equal(3);
      expect(result).to.equal('Success');
    });
    
    it('should fail after maximum retries', async () => {
      const operation = sinon.stub().rejects(new Error('Persistent error'));
      
      const clock = sinon.useFakeTimers();
      
      // Start the retry operation with 3 max retries
      const retryPromise = retryWithBackoff(operation, 3, 100);
      
      // Fast-forward time to trigger all retries
      clock.tick(100); // First retry
      clock.tick(200); // Second retry
      clock.tick(400); // Third retry
      
      try {
        await retryPromise;
        // Should not reach here
        expect.fail('Should have thrown error after max retries');
      } catch (error) {
        expect(error.message).to.equal('Persistent error');
        expect(operation.callCount).to.equal(4); // Initial + 3 retries
      }
      
      clock.restore();
    });
  });
  
  describe('Circuit Breaker Pattern', () => {
    it('should open circuit after consecutive failures', async () => {
      const circuitBreaker = require('../../../utils/circuitBreaker');
      const serviceCall = sinon.stub().rejects(new Error('Service unavailable'));
      
      // Reset circuit breaker state
      circuitBreaker.reset();
      
      // Attempt multiple calls to trigger circuit breaker
      for (let i = 0; i < circuitBreaker.threshold; i++) {
        try {
          await circuitBreaker.execute(serviceCall);
        } catch (error) {
          // Expected errors
        }
      }
      
      // Circuit should now be open
      expect(circuitBreaker.isOpen()).to.be.true;
      
      // Additional calls should fail fast without calling the service
      try {
        await circuitBreaker.execute(serviceCall);
        // Should not reach here
        expect.fail('Should have thrown circuit open error');
      } catch (error) {
        expect(error.message).to.equal('Circuit breaker is open');
        // Service should not be called when circuit is open
        expect(serviceCall.callCount).to.equal(circuitBreaker.threshold);
      }
    });
    
    it('should transition to half-open state after timeout', async () => {
      const circuitBreaker = require('../../../utils/circuitBreaker');
      const serviceCall = sinon.stub();
      
      // Reset circuit breaker state
      circuitBreaker.reset();
      
      // Force circuit to open state
      circuitBreaker.forceOpen();
      expect(circuitBreaker.isOpen()).to.be.true;
      
      // Fast-forward time past the reset timeout
      const clock = sinon.useFakeTimers();
      clock.tick(circuitBreaker.resetTimeout + 100);
      
      // Circuit should now be half-open
      expect(circuitBreaker.isHalfOpen()).to.be.true;
      
      // Service call succeeds
      serviceCall.resolves('Success');
      
      // Execute service call in half-open state
      const result = await circuitBreaker.execute(serviceCall);
      
      // Circuit should be closed after successful call
      expect(circuitBreaker.isClosed()).to.be.true;
      expect(result).to.equal('Success');
      
      clock.restore();
    });
    
    it('should reopen circuit on failure in half-open state', async () => {
      const circuitBreaker = require('../../../utils/circuitBreaker');
      const serviceCall = sinon.stub().rejects(new Error('Still unavailable'));
      
      // Reset circuit breaker state
      circuitBreaker.reset();
      
      // Force circuit to half-open state
      circuitBreaker.forceHalfOpen();
      expect(circuitBreaker.isHalfOpen()).to.be.true;
      
      // Execute service call in half-open state
      try {
        await circuitBreaker.execute(serviceCall);
        // Should not reach here
        expect.fail('Should have thrown error');
      } catch (error) {
        // Circuit should be open again after failure in half-open state
        expect(circuitBreaker.isOpen()).to.be.true;
        expect(error.message).to.equal('Still unavailable');
      }
    });
  });
  
  describe('Graceful Degradation', () => {
    it('should return cached data when service is unavailable', async () => {
      const cacheService = require('../../../services/cacheService');
      const dataService = require('../../../services/dataService');
      
      // Stub cache service
      sandbox.stub(cacheService, 'get').resolves({ data: 'cached data', timestamp: Date.now() });
      sandbox.stub(cacheService, 'set').resolves();
      
      // Stub data service to simulate failure
      sandbox.stub(dataService, 'fetchData').rejects(new Error('Service unavailable'));
      
      // Call the service with fallback to cache
      const result = await dataService.getDataWithFallback('test-key');
      
      // Should return cached data
      expect(result).to.have.property('data', 'cached data');
      expect(result).to.have.property('source', 'cache');
      
      // Verify service was called but failed
      expect(dataService.fetchData.calledOnce).to.be.true;
      expect(cacheService.get.calledOnce).to.be.true;
    });
    
    it('should handle case when both service and cache fail', async () => {
      const cacheService = require('../../../services/cacheService');
      const dataService = require('../../../services/dataService');
      
      // Stub both services to fail
      sandbox.stub(cacheService, 'get').rejects(new Error('Cache unavailable'));
      sandbox.stub(dataService, 'fetchData').rejects(new Error('Service unavailable'));
      
      // Call the service with fallback to default
      const result = await dataService.getDataWithFallback('test-key');
      
      // Should return default data
      expect(result).to.have.property('data');
      expect(result).to.have.property('source', 'default');
      
      // Verify both services were called but failed
      expect(dataService.fetchData.calledOnce).to.be.true;
      expect(cacheService.get.calledOnce).to.be.true;
    });
  });
  
  describe('API Request Timeouts', () => {
    it('should handle timeouts gracefully', async () => {
      // Stub axios to simulate timeout
      sandbox.stub(axios, 'get').rejects({ code: 'ECONNABORTED' });
      
      const apiClient = require('../../../services/apiClient');
      
      try {
        await apiClient.get('/test-endpoint');
        // Should not reach here
        expect.fail('Should have thrown timeout error');
      } catch (error) {
        expect(error.message).to.equal('Request timed out');
        expect(error.statusCode).to.equal(408);
      }
    });
  });
  
  describe('Database Connection Recovery', () => {
    it('should reconnect to database after connection loss', async () => {
      const mongoose = require('mongoose');
      const dbConnection = require('../../../config/database');
      
      // Stub mongoose connection events
      const connectionEventHandlers = {};
      sandbox.stub(mongoose.connection, 'on').callsFake((event, handler) => {
        connectionEventHandlers[event] = handler;
        return mongoose.connection;
      });
      
      // Initialize database connection
      dbConnection.init();
      
      // Verify connection event handlers are registered
      expect(mongoose.connection.on.calledWith('disconnected')).to.be.true;
      expect(mongoose.connection.on.calledWith('error')).to.be.true;
      expect(mongoose.connection.on.calledWith('connected')).to.be.true;
      
      // Stub mongoose connect method
      sandbox.stub(mongoose, 'connect').resolves();
      
      // Simulate disconnection event
      connectionEventHandlers['disconnected']();
      
      // Verify reconnection attempt
      expect(mongoose.connect.calledOnce).to.be.true;
      expect(logger.warn.calledWith('MongoDB disconnected. Attempting to reconnect...')).to.be.true;
    });
  });
  
  describe('Rate Limiting Recovery', () => {
    it('should handle rate limit errors with exponential backoff', async () => {
      const apiClient = require('../../../services/apiClient');
      
      // Stub axios to simulate rate limit error then success
      const axiosStub = sandbox.stub(axios, 'get');
      axiosStub.onCall(0).rejects({ response: { status: 429 } });
      axiosStub.onCall(1).resolves({ data: 'success' });
      
      const clock = sinon.useFakeTimers();
      
      // Call API with rate limit handling
      const apiPromise = apiClient.getWithRateLimitHandling('/test-endpoint');
      
      // Fast-forward time to trigger retry
      clock.tick(1000);
      
      const result = await apiPromise;
      
      clock.restore();
      
      expect(result).to.equal('success');
      expect(axiosStub.callCount).to.equal(2);
    });
  });
});
