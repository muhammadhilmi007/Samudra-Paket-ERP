/**
 * Session Model
 * Manages user sessions and refresh tokens
 */

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userAgent: {
    type: String
  },
  ipAddress: {
    type: String
  },
  isValid: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Indexes for performance
sessionSchema.index({ refreshToken: 1 }, { unique: true });
sessionSchema.index({ userId: 1, isValid: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for automatic cleanup

/**
 * Invalidate session
 * @returns {Promise<void>}
 */
sessionSchema.methods.invalidate = async function() {
  this.isValid = false;
  await this.save();
};

/**
 * Extend session expiration
 * @param {number} days - Number of days to extend
 * @returns {Promise<void>}
 */
sessionSchema.methods.extend = async function(days = 7) {
  this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await this.save();
};

/**
 * Static method to invalidate all sessions for a user
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
sessionSchema.statics.invalidateAllForUser = async function(userId) {
  await this.updateMany(
    { userId, isValid: true },
    { isValid: false }
  );
};

/**
 * Static method to find valid session by refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Session>} - Returns session if found and valid
 */
sessionSchema.statics.findValidByToken = async function(refreshToken) {
  return this.findOne({
    refreshToken,
    isValid: true,
    expiresAt: { $gt: new Date() }
  });
};

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
