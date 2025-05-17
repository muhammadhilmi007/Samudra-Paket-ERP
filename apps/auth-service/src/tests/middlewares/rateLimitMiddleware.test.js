/**
 * Rate Limit Middleware Tests
 * Tests the rate limiting middleware functionality
 */

const { rateLimiter } = require('../../api/middlewares/rateLimitMiddleware');
const redis = require('../../infrastructure/database/redis');

// Mock Redis client
jest.mock('../../infrastructure/database/redis', () => ({
  client: {
    incr: jest.fn(),
    expire: jest.fn()
  }
}));

// Mock request and response
const mockRequest = () => {
  const req = {};
  req.ip = '127.0.0.1';
  req.path = '/api/auth/login';
  req.method = 'POST';
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Rate Limit Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set environment variables
    process.env.RATE_LIMIT_WINDOW = '60'; // 60 seconds
    process.env.RATE_LIMIT_MAX_REQUESTS = '10'; // 10 requests per window
  });
  
  it('should allow requests within rate limit', async () => {
    // Mock Redis response for first request
    redis.client.incr.mockResolvedValue(1); // First request
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    await rateLimiter(req, res, next);
    
    // Assertions
    expect(next).toHaveBeenCalled();
    expect(redis.client.incr).toHaveBeenCalledWith(expect.stringContaining('ratelimit:127.0.0.1:/api/auth/login:POST'));
    expect(redis.client.expire).toHaveBeenCalledWith(
      expect.stringContaining('ratelimit:127.0.0.1:/api/auth/login:POST'),
      parseInt(process.env.RATE_LIMIT_WINDOW)
    );
  });
  
  it('should allow requests up to the limit', async () => {
    // Mock Redis response for request at the limit
    redis.client.incr.mockResolvedValue(10); // At the limit
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    await rateLimiter(req, res, next);
    
    // Assertions
    expect(next).toHaveBeenCalled();
    expect(redis.client.incr).toHaveBeenCalledWith(expect.stringContaining('ratelimit:127.0.0.1:/api/auth/login:POST'));
  });
  
  it('should block requests over the limit', async () => {
    // Mock Redis response for request over the limit
    redis.client.incr.mockResolvedValue(11); // Over the limit
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    await rateLimiter(req, res, next);
    
    // Assertions
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        code: 'TOO_MANY_REQUESTS',
        message: expect.stringContaining('Too many requests')
      })
    );
  });
  
  it('should handle Redis errors gracefully', async () => {
    // Mock Redis error
    redis.client.incr.mockRejectedValue(new Error('Redis connection error'));
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    await rateLimiter(req, res, next);
    
    // Assertions - should allow request to proceed when Redis fails
    expect(next).toHaveBeenCalled();
  });
  
  it('should use custom rate limit settings from environment variables', async () => {
    // Change environment variables
    process.env.RATE_LIMIT_WINDOW = '30'; // 30 seconds
    process.env.RATE_LIMIT_MAX_REQUESTS = '5'; // 5 requests per window
    
    // Mock Redis response for request at the new limit
    redis.client.incr.mockResolvedValue(5); // At the new limit
    
    // Setup request and response
    const req = mockRequest();
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware
    await rateLimiter(req, res, next);
    
    // Assertions
    expect(next).toHaveBeenCalled();
    expect(redis.client.expire).toHaveBeenCalledWith(
      expect.stringContaining('ratelimit:127.0.0.1:/api/auth/login:POST'),
      30 // New window value
    );
    
    // Mock Redis response for request over the new limit
    redis.client.incr.mockResolvedValue(6); // Over the new limit
    
    // Call middleware again
    await rateLimiter(req, res, next.mockClear());
    
    // Assertions
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(429);
  });
  
  it('should use different rate limit keys for different endpoints', async () => {
    // Mock Redis response
    redis.client.incr.mockResolvedValue(1);
    
    // Setup first request (login endpoint)
    const loginReq = mockRequest();
    loginReq.path = '/api/auth/login';
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware for login
    await rateLimiter(loginReq, res, next);
    
    // Assertions for login
    expect(redis.client.incr).toHaveBeenCalledWith(expect.stringContaining('ratelimit:127.0.0.1:/api/auth/login:POST'));
    
    // Reset mocks
    redis.client.incr.mockClear();
    redis.client.expire.mockClear();
    
    // Setup second request (register endpoint)
    const registerReq = mockRequest();
    registerReq.path = '/api/auth/register';
    
    // Call middleware for register
    await rateLimiter(registerReq, res, next);
    
    // Assertions for register
    expect(redis.client.incr).toHaveBeenCalledWith(expect.stringContaining('ratelimit:127.0.0.1:/api/auth/register:POST'));
  });
  
  it('should use different rate limit keys for different IPs', async () => {
    // Mock Redis response
    redis.client.incr.mockResolvedValue(1);
    
    // Setup first request (first IP)
    const firstIpReq = mockRequest();
    firstIpReq.ip = '192.168.1.1';
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware for first IP
    await rateLimiter(firstIpReq, res, next);
    
    // Assertions for first IP
    expect(redis.client.incr).toHaveBeenCalledWith(expect.stringContaining('ratelimit:192.168.1.1:/api/auth/login:POST'));
    
    // Reset mocks
    redis.client.incr.mockClear();
    redis.client.expire.mockClear();
    
    // Setup second request (second IP)
    const secondIpReq = mockRequest();
    secondIpReq.ip = '192.168.1.2';
    
    // Call middleware for second IP
    await rateLimiter(secondIpReq, res, next);
    
    // Assertions for second IP
    expect(redis.client.incr).toHaveBeenCalledWith(expect.stringContaining('ratelimit:192.168.1.2:/api/auth/login:POST'));
  });
  
  it('should use different rate limit keys for different methods', async () => {
    // Mock Redis response
    redis.client.incr.mockResolvedValue(1);
    
    // Setup first request (POST method)
    const postReq = mockRequest();
    postReq.method = 'POST';
    const res = mockResponse();
    const next = jest.fn();
    
    // Call middleware for POST
    await rateLimiter(postReq, res, next);
    
    // Assertions for POST
    expect(redis.client.incr).toHaveBeenCalledWith(expect.stringContaining('ratelimit:127.0.0.1:/api/auth/login:POST'));
    
    // Reset mocks
    redis.client.incr.mockClear();
    redis.client.expire.mockClear();
    
    // Setup second request (GET method)
    const getReq = mockRequest();
    getReq.method = 'GET';
    
    // Call middleware for GET
    await rateLimiter(getReq, res, next);
    
    // Assertions for GET
    expect(redis.client.incr).toHaveBeenCalledWith(expect.stringContaining('ratelimit:127.0.0.1:/api/auth/login:GET'));
  });
});
