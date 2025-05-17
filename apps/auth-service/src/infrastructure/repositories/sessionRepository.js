/**
 * Session Repository
 * Implements data access methods for the Session model
 */

const { Session } = require('../../domain/models');

/**
 * Create a new session
 * @param {Object} sessionData - Session data
 * @returns {Promise<Session>} - Returns created session
 */
const createSession = async (sessionData) => {
  const session = new Session(sessionData);
  return session.save();
};

/**
 * Find session by ID
 * @param {string} id - Session ID
 * @returns {Promise<Session>} - Returns session if found
 */
const findById = async (id) => {
  return Session.findById(id);
};

/**
 * Find session by refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Session>} - Returns session if found
 */
const findByRefreshToken = async (refreshToken) => {
  return Session.findOne({ refreshToken });
};

/**
 * Find valid session by refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Session>} - Returns valid session if found
 */
const findValidByRefreshToken = async (refreshToken) => {
  return Session.findValidByToken(refreshToken);
};

/**
 * Find sessions by user ID
 * @param {string} userId - User ID
 * @param {boolean} onlyValid - Only return valid sessions
 * @returns {Promise<Array<Session>>} - Returns array of sessions
 */
const findByUserId = async (userId, onlyValid = true) => {
  const query = { userId };
  
  if (onlyValid) {
    query.isValid = true;
    query.expiresAt = { $gt: new Date() };
  }
  
  return Session.find(query).sort({ createdAt: -1 });
};

/**
 * Invalidate session
 * @param {string} id - Session ID
 * @returns {Promise<Session>} - Returns invalidated session
 */
const invalidateSession = async (id) => {
  return Session.findByIdAndUpdate(
    id,
    {
      isValid: false,
      updatedAt: new Date()
    },
    { new: true }
  );
};

/**
 * Invalidate session by refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Session>} - Returns invalidated session
 */
const invalidateByRefreshToken = async (refreshToken) => {
  return Session.findOneAndUpdate(
    { refreshToken },
    {
      isValid: false,
      updatedAt: new Date()
    },
    { new: true }
  );
};

/**
 * Invalidate all sessions for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Returns update result
 */
const invalidateAllForUser = async (userId) => {
  return Session.invalidateAllForUser(userId);
};

/**
 * Extend session expiration
 * @param {string} id - Session ID
 * @param {number} days - Number of days to extend
 * @returns {Promise<Session>} - Returns updated session
 */
const extendSession = async (id, days = 7) => {
  return Session.findByIdAndUpdate(
    id,
    {
      expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    },
    { new: true }
  );
};

/**
 * Delete expired sessions
 * @returns {Promise<Object>} - Returns delete result
 */
const deleteExpiredSessions = async () => {
  return Session.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isValid: false }
    ]
  });
};

/**
 * Count active sessions for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Returns count of active sessions
 */
const countActiveSessions = async (userId) => {
  return Session.countDocuments({
    userId,
    isValid: true,
    expiresAt: { $gt: new Date() }
  });
};

module.exports = {
  createSession,
  findById,
  findByRefreshToken,
  findValidByRefreshToken,
  findByUserId,
  invalidateSession,
  invalidateByRefreshToken,
  invalidateAllForUser,
  extendSession,
  deleteExpiredSessions,
  countActiveSessions
};
