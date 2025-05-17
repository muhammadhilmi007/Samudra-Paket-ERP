/**
 * Configuration
 * Centralizes all configuration settings
 */

const dotenv = require('dotenv');
const path = require('path');


// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

// Default configuration
const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
    apiPrefix: '/api'
  },
  
  // MongoDB configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://mongo:HpmyPloqcCXAQdHoTRXmOGbnOYRqyufP@nozomi.proxy.rlwy.net:22764',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  
  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'default',
    port: parseInt(process.env.REDIS_PORT || '59026', 10),
    password: process.env.REDIS_PASSWORD || 'KpJvwiHgufgzaiZEYCyNAgSRjiJJXgQE',
    url: process.env.REDIS_URL || 'redis://default:KpJvwiHgufgzaiZEYCyNAgSRjiJJXgQE@yamabiko.proxy.rlwy.net:59026',
    keyPrefix: 'auth:',
    ttl: parseInt(process.env.REDIS_TTL || '86400', 10) // 24 hours in seconds
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    directory: process.env.LOG_DIR || 'logs'
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'samudra-paket-erp',
    audience: process.env.JWT_AUDIENCE || 'samudra-paket-users'
  },
  
  // Email configuration
  email: {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'user@example.com',
      pass: process.env.SMTP_PASSWORD || 'password'
    },
    from: process.env.EMAIL_FROM || 'Samudra Paket <no-reply@samudrapaket.com>',
    verificationExpires: process.env.EMAIL_VERIFICATION_EXPIRES || '24h',
    resetPasswordExpires: process.env.RESET_PASSWORD_EXPIRES || '1h'
  },
  
  // Security configuration
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
    passwordHistory: parseInt(process.env.PASSWORD_HISTORY || '5', 10),
    maxFailedLoginAttempts: parseInt(process.env.MAX_FAILED_LOGIN_ATTEMPTS || '5', 10),
    accountLockDuration: parseInt(process.env.ACCOUNT_LOCK_DURATION || '30', 10) * 60 * 1000, // minutes to ms
    tokenBlacklistExpiry: parseInt(process.env.TOKEN_BLACKLIST_EXPIRY || '86400', 10) // 24 hours in seconds
  },
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per windowMs
    loginWindowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    loginMax: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '5', 10), // 5 login attempts per windowMs
    passwordResetWindowMs: parseInt(process.env.PASSWORD_RESET_RATE_LIMIT_WINDOW_MS || '3600000', 10), // 1 hour
    passwordResetMax: parseInt(process.env.PASSWORD_RESET_RATE_LIMIT_MAX || '3', 10) // 3 password reset requests per windowMs
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filename: process.env.LOG_FILENAME || 'auth-service.log'
  },
  
  // Cors configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};

// Import Redis client
const { getRedisClient } = require('./redis');

module.exports = {
  ...config,
  getRedisClient
};
