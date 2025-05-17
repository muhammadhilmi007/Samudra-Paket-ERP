/**
 * Token Service
 * Handles JWT token generation, validation, and refresh
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { redisClient } = require('../../infrastructure/database');

/**
 * Generate access token
 * @param {Object} user - User object
 * @returns {string} - Returns JWT token
 */
const generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    permissions: user.permissions
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRATION || '1h' }
  );
};

/**
 * Generate refresh token
 * @returns {string} - Returns refresh token
 */
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

/**
 * Verify access token
 * @param {string} token - JWT token
 * @returns {Object} - Returns decoded token payload
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    throw error;
  }
};

/**
 * Generate verification token
 * @returns {string} - Returns verification token
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate password reset token
 * @returns {string} - Returns password reset token
 */
const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Blacklist token
 * @param {string} token - JWT token
 * @returns {Promise<void>}
 */
const blacklistToken = async (token) => {
  try {
    // Decode token to get expiration time
    const decoded = jwt.decode(token);
    
    if (!decoded || !decoded.exp) {
      throw new Error('Invalid token');
    }
    
    // Calculate token TTL in seconds
    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - now;
    
    // Only blacklist if token is not expired
    if (ttl > 0) {
      await redisClient.blacklistToken(token, ttl);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Check if token is blacklisted
 * @param {string} token - JWT token
 * @returns {Promise<boolean>} - Returns true if token is blacklisted
 */
const isTokenBlacklisted = async (token) => {
  try {
    return await redisClient.isTokenBlacklisted(token);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  generateVerificationToken,
  generatePasswordResetToken,
  blacklistToken,
  isTokenBlacklisted
};
