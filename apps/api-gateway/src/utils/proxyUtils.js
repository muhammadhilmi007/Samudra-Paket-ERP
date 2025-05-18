/**
 * Proxy Utilities
 * Utilities for creating service proxies in the API Gateway
 */

const axios = require('axios');
const CircuitBreaker = require('opossum');
const { logger } = require('./logger');

/**
 * Create a service proxy with circuit breaker
 * @param {string} baseUrl - Base URL of the service
 * @param {Object} circuitBreakerOptions - Circuit breaker options
 * @returns {Function} Proxy middleware function
 */
const createServiceProxy = (baseUrl, circuitBreakerOptions = {}) => {
  // Default circuit breaker options
  const options = {
    failureThreshold: circuitBreakerOptions.failureThreshold || 5,
    resetTimeout: circuitBreakerOptions.resetTimeout || 30000, // 30 seconds
    timeout: circuitBreakerOptions.timeout || 10000, // 10 seconds
    errorThresholdPercentage: 50,
    rollingCountTimeout: 60000 // 1 minute
  };

  /**
   * Proxy request to the service
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {string} endpoint - Service endpoint
   */
  const proxyRequest = async (req, res, endpoint) => {
    try {
      // Build the target URL
      const targetUrl = `${baseUrl}${endpoint}`;
      
      // Prepare request options
      const requestOptions = {
        method: req.method,
        url: targetUrl,
        headers: {
          ...req.headers,
          host: new URL(baseUrl).host
        },
        params: req.query,
        data: req.body,
        timeout: options.timeout
      };
      
      // Remove content-length header to avoid conflicts
      delete requestOptions.headers['content-length'];
      
      // Forward user ID and role from JWT token if available
      if (req.user) {
        requestOptions.headers['x-user-id'] = req.user.id;
        requestOptions.headers['x-user-role'] = req.user.role;
      }
      
      // Log the proxy request
      logger.debug(`Proxying request to ${targetUrl}`, {
        method: req.method,
        originalUrl: req.originalUrl,
        targetUrl
      });
      
      // Send the request to the service
      const response = await axios(requestOptions);
      
      // Set response headers
      Object.keys(response.headers).forEach(header => {
        res.set(header, response.headers[header]);
      });
      
      // Send the response
      res.status(response.status).send(response.data);
    } catch (error) {
      // Handle errors
      logger.error(`Error proxying request to ${baseUrl}${endpoint}`, {
        error: error.message,
        stack: error.stack
      });
      
      // Handle Axios errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        res.status(error.response.status).send(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        res.status(503).json({
          success: false,
          message: 'Service unavailable',
          error: 'No response received from service'
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: error.message
        });
      }
    }
  };

  // Create circuit breaker
  const breaker = new CircuitBreaker(proxyRequest, options);
  
  // Circuit breaker event handlers
  breaker.on('open', () => {
    logger.warn(`Circuit breaker for ${baseUrl} is open`);
  });
  
  breaker.on('halfOpen', () => {
    logger.info(`Circuit breaker for ${baseUrl} is half open`);
  });
  
  breaker.on('close', () => {
    logger.info(`Circuit breaker for ${baseUrl} is closed`);
  });
  
  breaker.on('fallback', () => {
    logger.warn(`Circuit breaker fallback for ${baseUrl}`);
  });

  /**
   * Proxy middleware function
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   * @param {string} endpoint - Service endpoint
   */
  return (req, res, next, endpoint) => {
    // Replace path parameters in the endpoint
    let targetEndpoint = endpoint;
    const pathParams = endpoint.match(/:[a-zA-Z0-9_]+/g);
    
    if (pathParams) {
      pathParams.forEach(param => {
        const paramName = param.substring(1); // Remove the leading ':'
        const paramValue = req.params[paramName];
        
        if (paramValue) {
          targetEndpoint = targetEndpoint.replace(param, paramValue);
        }
      });
    }
    
    // Execute the request with circuit breaker
    breaker.fire(req, res, targetEndpoint)
      .catch(error => {
        logger.error(`Circuit breaker error for ${baseUrl}${targetEndpoint}`, {
          error: error.message,
          stack: error.stack
        });
        
        // Send fallback response
        res.status(503).json({
          success: false,
          message: 'Service temporarily unavailable',
          error: 'Circuit breaker is open'
        });
      });
  };
};

/**
 * Create a circuit breaker proxy for a service
 * @param {string} baseUrl - Base URL of the service
 * @param {Object} pathRewrite - Path rewrite rules
 * @param {Object} options - Circuit breaker options
 * @returns {Function} Express middleware function
 */
const createCircuitBreakerProxy = (baseUrl, pathRewrite = {}, options = {}) => {
  const serviceProxy = createServiceProxy(baseUrl, options);
  
  return (req, res, next) => {
    // Rewrite the path
    let targetPath = req.path;
    
    // Apply path rewrite rules
    Object.keys(pathRewrite).forEach(pattern => {
      const regex = new RegExp(pattern);
      if (regex.test(req.originalUrl)) {
        targetPath = req.originalUrl.replace(regex, pathRewrite[pattern]);
      }
    });
    
    // Proxy the request
    serviceProxy(req, res, next, targetPath);
  };
};

module.exports = {
  createServiceProxy,
  createCircuitBreakerProxy
};
