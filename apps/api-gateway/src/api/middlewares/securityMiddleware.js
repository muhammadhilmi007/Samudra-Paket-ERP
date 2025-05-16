/**
 * Security Middleware
 * Implements security headers and rate limiting
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

/**
 * Security headers middleware using Helmet
 */
const securityHeadersMiddleware = helmet();

/**
 * Rate limiting middleware
 */
const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many requests, please try again later.'
  }
});

/**
 * CORS middleware with proper settings for web and mobile clients
 */
const corsMiddleware = cors({
  origin: (origin, callback) => {
    const webClientUrl = process.env.WEB_CLIENT_URL || 'http://localhost:3001';
    const mobileClientUrl = process.env.MOBILE_CLIENT_URL || '*';
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || origin === 'null' || origin === webClientUrl || mobileClientUrl === '*') {
      return callback(null, true);
    }
    
    // Check if the origin is allowed
    if (mobileClientUrl !== '*' && origin !== mobileClientUrl) {
      return callback(new Error('CORS not allowed'), false);
    }
    
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  credentials: true,
  maxAge: 86400 // 24 hours
});

module.exports = {
  securityHeadersMiddleware,
  rateLimitMiddleware,
  corsMiddleware
};
