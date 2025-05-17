/**
 * SecurityLog Model
 * Tracks security-related events for audit purposes
 */

const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'LOGIN_SUCCESS',
      'LOGIN_FAILURE',
      'LOGOUT',
      'PASSWORD_CHANGE',
      'PASSWORD_RESET_REQUEST',
      'PASSWORD_RESET_COMPLETE',
      'ACCOUNT_LOCK',
      'ACCOUNT_UNLOCK',
      'ACCOUNT_CREATION',
      'ACCOUNT_UPDATE',
      'ACCOUNT_VERIFICATION',
      'TOKEN_REFRESH',
      'PERMISSION_CHANGE'
    ],
    index: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  details: {
    type: Object
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE'],
    default: 'SUCCESS'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false } // Only track creation time
});

// Indexes for performance and querying
securityLogSchema.index({ eventType: 1, createdAt: -1 });
securityLogSchema.index({ userId: 1, eventType: 1, createdAt: -1 });
securityLogSchema.index({ status: 1, createdAt: -1 });

/**
 * Static method to create a new security log entry
 * @param {Object} logData - Log data
 * @returns {Promise<SecurityLog>} - Returns created log
 */
securityLogSchema.statics.createLog = async function(logData) {
  return this.create(logData);
};

/**
 * Static method to find logs by user ID
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Array<SecurityLog>>} - Returns array of logs
 */
securityLogSchema.statics.findByUserId = async function(userId, options = {}) {
  const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
  
  return this.find({ userId })
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

/**
 * Static method to find logs by event type
 * @param {string} eventType - Event type
 * @param {Object} options - Query options
 * @returns {Promise<Array<SecurityLog>>} - Returns array of logs
 */
securityLogSchema.statics.findByEventType = async function(eventType, options = {}) {
  const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
  
  return this.find({ eventType })
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

/**
 * Static method to find failed login attempts for a user
 * @param {string} userId - User ID
 * @param {number} minutes - Time window in minutes
 * @returns {Promise<number>} - Returns count of failed attempts
 */
securityLogSchema.statics.countFailedLoginAttempts = async function(userId, minutes = 30) {
  const timeWindow = new Date(Date.now() - minutes * 60 * 1000);
  
  return this.countDocuments({
    userId,
    eventType: 'LOGIN_FAILURE',
    createdAt: { $gte: timeWindow }
  });
};

const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);

module.exports = SecurityLog;
