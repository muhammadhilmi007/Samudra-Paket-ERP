/**
 * Request Tracing Middleware
 * Adds unique request ID to each request for tracing
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Add request ID to request and response
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const requestTracing = (req, res, next) => {
  // Generate request ID if not already present
  req.id = req.headers['x-request-id'] || uuidv4();
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.id);
  
  // Add request metadata
  req.metadata = {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    requestId: req.id
  };
  
  next();
};

module.exports = requestTracing;
