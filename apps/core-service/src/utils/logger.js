/**
 * Logger Utility
 * Provides logging functionality for the application
 */

const winston = require('winston');
const { format, transports } = winston;

// Define log format
// Custom replacer function to handle circular references
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  };
};

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format((info) => {
    // Handle circular references in the meta object
    if (info.message && info.message instanceof Error) {
      const error = info.message;
      info.message = error.message;
      info.stack = error.stack;
    }
    return info;
  })(),
  format.json({
    replacer: getCircularReplacer()
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'core-service' },
  transports: [
    // Write logs to console
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, ...meta }) => {
          // Handle circular references in meta
          let metaString = '';
          try {
            metaString = Object.keys(meta).length 
              ? JSON.stringify(meta, getCircularReplacer(), 2) 
              : '';
          } catch (error) {
            metaString = '[Error processing meta data]';
          }
          return `${timestamp} ${level}: ${message} ${metaString}`;
        })
      )
    }),
    // Write logs to file
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    new transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    })
  ]
});

// Add stream for Morgan HTTP logger
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

module.exports = logger;
