/**
 * Circuit Breaker Middleware
 * Implements circuit breaker pattern for fault tolerance
 */

const CircuitBreaker = require('opossum');
const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');

// Circuit breaker configuration
const circuitBreakerOptions = {
  timeout: 5000, // 5 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 30000 // 30 seconds
};

/**
 * Creates a circuit breaker for proxy requests
 * @param {string} target - Target URL for the proxy
 * @param {Object} pathRewrite - Path rewrite rules
 * @returns {Function} Express middleware function
 */
const createCircuitBreakerProxy = (target, pathRewrite) => {
  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onError: (err, req, res) => {
      winston.error(`Proxy error: ${err.message}`);
      res.status(502).json({
        status: 'error',
        code: 'BAD_GATEWAY',
        message: 'Service temporarily unavailable'
      });
    }
  });
  
  const breaker = new CircuitBreaker((req, res, next) => {
    return new Promise((resolve, reject) => {
      proxy(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }, circuitBreakerOptions);
  
  breaker.fallback((req, res) => {
    res.status(503).json({
      status: 'error',
      code: 'SERVICE_UNAVAILABLE',
      message: 'Service temporarily unavailable. Please try again later.'
    });
  });
  
  breaker.on('open', () => {
    winston.warn(`Circuit breaker opened for ${target}`);
  });
  
  breaker.on('close', () => {
    winston.info(`Circuit breaker closed for ${target}`);
  });
  
  return (req, res, next) => {
    breaker.fire(req, res, next)
      .catch(err => {
        winston.error(`Circuit breaker error: ${err.message}`);
        next(err);
      });
  };
};

module.exports = {
  createCircuitBreakerProxy
};
