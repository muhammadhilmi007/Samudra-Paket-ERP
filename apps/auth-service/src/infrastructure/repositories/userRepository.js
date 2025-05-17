/**
 * User Repository
 * Implements data access methods for the User model
 */

const { User } = require('../../domain/models');

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<User>} - Returns created user
 */
const createUser = async (userData) => {
  const user = new User(userData);
  return user.save();
};

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Promise<User>} - Returns user if found
 */
const findById = async (id) => {
  return User.findById(id);
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<User>} - Returns user if found
 */
const findByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Find user by username
 * @param {string} username - Username
 * @returns {Promise<User>} - Returns user if found
 */
const findByUsername = async (username) => {
  return User.findOne({ username });
};

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<User>} - Returns updated user
 */
const updateUser = async (id, updateData) => {
  return User.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {Promise<User>} - Returns deleted user
 */
const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};

/**
 * Find users by role
 * @param {string} role - User role
 * @param {Object} options - Query options
 * @returns {Promise<Array<User>>} - Returns array of users
 */
const findByRole = async (role, options = {}) => {
  const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
  
  return User.find({ role })
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

/**
 * Find users by active status
 * @param {boolean} isActive - Active status
 * @param {Object} options - Query options
 * @returns {Promise<Array<User>>} - Returns array of users
 */
const findByActiveStatus = async (isActive, options = {}) => {
  const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
  
  return User.find({ isActive })
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

/**
 * Find all users
 * @param {Object} options - Query options
 * @returns {Promise<Array<User>>} - Returns array of users
 */
const findAll = async (options = {}) => {
  const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;
  
  return User.find()
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

/**
 * Count users
 * @param {Object} filter - Filter criteria
 * @returns {Promise<number>} - Returns count of users
 */
const countUsers = async (filter = {}) => {
  return User.countDocuments(filter);
};

/**
 * Set verification token
 * @param {string} userId - User ID
 * @param {string} token - Verification token
 * @param {Date} expires - Token expiration date
 * @returns {Promise<User>} - Returns updated user
 */
const setVerificationToken = async (userId, token, expires) => {
  return User.findByIdAndUpdate(
    userId,
    {
      verificationToken: token,
      verificationTokenExpires: expires,
      updatedAt: new Date()
    },
    { new: true }
  );
};

/**
 * Verify user
 * @param {string} token - Verification token
 * @returns {Promise<User>} - Returns verified user
 */
const verifyUser = async (token) => {
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: new Date() }
  });
  
  if (!user) {
    return null;
  }
  
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  user.updatedAt = new Date();
  
  return user.save();
};

/**
 * Set password reset token
 * @param {string} userId - User ID
 * @param {string} token - Reset token
 * @param {Date} expires - Token expiration date
 * @returns {Promise<User>} - Returns updated user
 */
const setPasswordResetToken = async (userId, token, expires) => {
  return User.findByIdAndUpdate(
    userId,
    {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
      updatedAt: new Date()
    },
    { new: true }
  );
};

/**
 * Find user by reset token
 * @param {string} token - Reset token
 * @returns {Promise<User>} - Returns user if found
 */
const findByResetToken = async (token) => {
  return User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });
};

/**
 * Reset password
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<User>} - Returns user with updated password
 */
const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });
  
  if (!user) {
    return null;
  }
  
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.failedLoginAttempts = 0;
  user.isLocked = false;
  user.lockedUntil = null;
  user.updatedAt = new Date();
  
  return user.save();
};

/**
 * Change password
 * @param {string} userId - User ID
 * @param {string} newPassword - New password
 * @returns {Promise<User>} - Returns user with updated password
 */
const changePassword = async (userId, newPassword) => {
  const user = await User.findById(userId);
  
  if (!user) {
    return null;
  }
  
  user.password = newPassword;
  user.updatedAt = new Date();
  
  return user.save();
};

/**
 * Lock user account
 * @param {string} userId - User ID
 * @param {Date} lockedUntil - Lock expiration date
 * @returns {Promise<User>} - Returns locked user
 */
const lockAccount = async (userId, lockedUntil) => {
  return User.findByIdAndUpdate(
    userId,
    {
      isLocked: true,
      lockedUntil,
      updatedAt: new Date()
    },
    { new: true }
  );
};

/**
 * Unlock user account
 * @param {string} userId - User ID
 * @returns {Promise<User>} - Returns unlocked user
 */
const unlockAccount = async (userId) => {
  return User.findByIdAndUpdate(
    userId,
    {
      isLocked: false,
      lockedUntil: null,
      failedLoginAttempts: 0,
      updatedAt: new Date()
    },
    { new: true }
  );
};

module.exports = {
  createUser,
  findById,
  findByEmail,
  findByUsername,
  updateUser,
  deleteUser,
  findByRole,
  findByActiveStatus,
  findAll,
  countUsers,
  setVerificationToken,
  verifyUser,
  setPasswordResetToken,
  findByResetToken,
  resetPassword,
  changePassword,
  lockAccount,
  unlockAccount
};
