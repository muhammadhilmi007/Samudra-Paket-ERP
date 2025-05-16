/**
 * Logging Middleware
 * Implements structured logging with Winston
 */

const winston = require('winston');
const expressWinston = require('express-winston');
const { v4: uuidv4 } = require('uuid');

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-gateway' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
});

/**
 * Request tracing middleware
 * Adds a unique request ID to each request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requestTracingMiddleware = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

/**
 * Request logging middleware
 * Logs incoming requests with Winston
 */
const requestLoggingMiddleware = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  dynamicMeta: (req, res) => {
    return {
      requestId: req.id,
      userId: req.user ? req.user.id : null,
    };
  }
});

/**
 * Error logging middleware
 * Logs errors with Winston
 */
const errorLoggingMiddleware = expressWinston.errorLogger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}} {{err.message}}',
  expressFormat: true,
  colorize: false,
  dynamicMeta: (req, res, err) => {
    return {
      requestId: req.id,
      userId: req.user ? req.user.id : null,
      errorCode: err.code || 'INTERNAL_SERVER_ERROR'
    };
  }
});

module.exports = {
  logger,
  requestTracingMiddleware,
  requestLoggingMiddleware,
  errorLoggingMiddleware
};
