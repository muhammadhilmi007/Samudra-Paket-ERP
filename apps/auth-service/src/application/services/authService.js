/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */

const { userRepository, sessionRepository, securityLogRepository } = require('../../infrastructure/repositories');
const tokenService = require('./tokenService');
const passwordService = require('./passwordService');
const emailService = require('../../infrastructure/external/emailService');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Returns registered user
 */
const registerUser = async (userData) => {
  // Check if email already exists
  const existingEmail = await userRepository.findByEmail(userData.email);
  if (existingEmail) {
    throw new Error('Email already in use');
  }
  
  // Check if username already exists
  const existingUsername = await userRepository.findByUsername(userData.username);
  if (existingUsername) {
    throw new Error('Username already in use');
  }
  
  // Validate password
  const passwordValidation = await passwordService.validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.message);
  }
  
  // Create user
  const user = await userRepository.createUser(userData);
  
  // Generate verification token
  const verificationToken = tokenService.generateVerificationToken();
  const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  // Set verification token
  await userRepository.setVerificationToken(user._id, verificationToken, tokenExpires);
  
  // Send verification email
  await emailService.sendVerificationEmail(user, verificationToken);
  
  // Log security event
  await securityLogRepository.createLog({
    userId: user._id,
    eventType: 'ACCOUNT_CREATION',
    ipAddress: userData.ipAddress,
    userAgent: userData.userAgent,
    status: 'SUCCESS'
  });
  
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    role: user.role,
    isVerified: user.isVerified
  };
};

/**
 * Verify user email
 * @param {string} token - Verification token
 * @returns {Promise<Object>} - Returns verification result
 */
const verifyEmail = async (token) => {
  // Verify token
  const user = await userRepository.verifyUser(token);
  
  if (!user) {
    throw new Error('Invalid or expired verification token');
  }
  
  // Log security event
  await securityLogRepository.createLog({
    userId: user._id,
    eventType: 'ACCOUNT_VERIFICATION',
    status: 'SUCCESS'
  });
  
  return {
    id: user._id,
    email: user.email,
    isVerified: user.isVerified
  };
};

/**
 * Login user
 * @param {string} username - Username or email
 * @param {string} password - Password
 * @param {Object} metadata - Request metadata
 * @returns {Promise<Object>} - Returns login result with tokens
 */
const loginUser = async (username, password, metadata = {}) => {
  // Find user by username or email
  let user = await userRepository.findByUsername(username);
  
  if (!user) {
    user = await userRepository.findByEmail(username);
  }
  
  if (!user) {
    // Log failed login attempt
    await securityLogRepository.createLog({
      eventType: 'LOGIN_FAILURE',
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      details: { username },
      status: 'FAILURE'
    });
    
    throw new Error('Invalid credentials');
  }
  
  // Check if account is active
  if (!user.isActive) {
    await securityLogRepository.createLog({
      userId: user._id,
      eventType: 'LOGIN_FAILURE',
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      details: { reason: 'Account inactive' },
      status: 'FAILURE'
    });
    
    throw new Error('Account is inactive');
  }
  
  // Check if account is locked
  if (user.isLocked) {
    const now = new Date();
    
    if (user.lockedUntil && user.lockedUntil > now) {
      await securityLogRepository.createLog({
        userId: user._id,
        eventType: 'LOGIN_FAILURE',
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        details: { reason: 'Account locked' },
        status: 'FAILURE'
      });
      
      throw new Error(`Account is locked until ${user.lockedUntil.toISOString()}`);
    } else {
      // Unlock account if lock has expired
      user.isLocked = false;
      user.lockedUntil = null;
      user.failedLoginAttempts = 0;
      await user.save();
    }
  }
  
  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    // Increment failed login attempts
    await user.incrementFailedLoginAttempts();
    
    // Log failed login attempt
    await securityLogRepository.createLog({
      userId: user._id,
      eventType: 'LOGIN_FAILURE',
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      details: { reason: 'Invalid password' },
      status: 'FAILURE'
    });
    
    // Check if account is now locked
    if (user.isLocked) {
      // Send account locked email
      await emailService.sendAccountLockedEmail(user);
      
      // Log account lock event
      await securityLogRepository.createLog({
        userId: user._id,
        eventType: 'ACCOUNT_LOCK',
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        status: 'SUCCESS'
      });
      
      throw new Error('Account has been locked due to too many failed login attempts');
    }
    
    throw new Error('Invalid credentials');
  }
  
  // Reset failed login attempts
  await user.resetFailedLoginAttempts();
  
  // Update last login
  await user.updateLastLogin();
  
  // Generate tokens
  const accessToken = tokenService.generateAccessToken(user);
  const refreshToken = tokenService.generateRefreshToken();
  
  // Create session
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await sessionRepository.createSession({
    userId: user._id,
    refreshToken,
    userAgent: metadata.userAgent,
    ipAddress: metadata.ipAddress,
    expiresAt
  });
  
  // Log successful login
  await securityLogRepository.createLog({
    userId: user._id,
    eventType: 'LOGIN_SUCCESS',
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
    status: 'SUCCESS'
  });
  
  return {
    accessToken,
    refreshToken,
    expiresIn: parseInt(process.env.JWT_EXPIRATION || '3600', 10),
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      role: user.role,
      isVerified: user.isVerified
    }
  };
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @param {Object} metadata - Request metadata
 * @returns {Promise<Object>} - Returns new tokens
 */
const refreshToken = async (refreshToken, metadata = {}) => {
  // Find valid session by refresh token
  const session = await sessionRepository.findValidByRefreshToken(refreshToken);
  
  if (!session) {
    throw new Error('Invalid or expired refresh token');
  }
  
  // Find user
  const user = await userRepository.findById(session.userId);
  
  if (!user || !user.isActive) {
    // Invalidate session
    await sessionRepository.invalidateSession(session._id);
    
    throw new Error('User not found or inactive');
  }
  
  // Generate new access token
  const accessToken = tokenService.generateAccessToken(user);
  
  // Generate new refresh token (token rotation)
  const newRefreshToken = tokenService.generateRefreshToken();
  
  // Update session with new refresh token
  await sessionRepository.invalidateSession(session._id);
  
  // Create new session
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await sessionRepository.createSession({
    userId: user._id,
    refreshToken: newRefreshToken,
    userAgent: metadata.userAgent || session.userAgent,
    ipAddress: metadata.ipAddress || session.ipAddress,
    expiresAt
  });
  
  // Log token refresh
  await securityLogRepository.createLog({
    userId: user._id,
    eventType: 'TOKEN_REFRESH',
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
    status: 'SUCCESS'
  });
  
  return {
    accessToken,
    refreshToken: newRefreshToken,
    expiresIn: parseInt(process.env.JWT_EXPIRATION || '3600', 10)
  };
};

/**
 * Logout user
 * @param {string} refreshToken - Refresh token
 * @param {Object} metadata - Request metadata
 * @returns {Promise<boolean>} - Returns logout success
 */
const logoutUser = async (refreshToken, metadata = {}) => {
  // Find session by refresh token
  const session = await sessionRepository.findByRefreshToken(refreshToken);
  
  if (!session) {
    return true; // Session already invalid
  }
  
  // Invalidate session
  await sessionRepository.invalidateSession(session._id);
  
  // Log logout
  await securityLogRepository.createLog({
    userId: session.userId,
    eventType: 'LOGOUT',
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
    status: 'SUCCESS'
  });
  
  return true;
};

/**
 * Request password reset
 * @param {string} email - User email
 * @param {Object} metadata - Request metadata
 * @returns {Promise<boolean>} - Returns request success
 */
const requestPasswordReset = async (email, metadata = {}) => {
  // Find user by email
  const user = await userRepository.findByEmail(email);
  
  if (!user) {
    // Don't reveal that email doesn't exist
    return true;
  }
  
  // Generate reset token
  const resetToken = tokenService.generatePasswordResetToken();
  const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
  // Set reset token
  await userRepository.setPasswordResetToken(user._id, resetToken, tokenExpires);
  
  // Send password reset email
  await emailService.sendPasswordResetEmail(user, resetToken);
  
  // Log password reset request
  await securityLogRepository.createLog({
    userId: user._id,
    eventType: 'PASSWORD_RESET_REQUEST',
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
    status: 'SUCCESS'
  });
  
  return true;
};

/**
 * Reset password
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @param {Object} metadata - Request metadata
 * @returns {Promise<boolean>} - Returns reset success
 */
const resetPassword = async (token, newPassword, metadata = {}) => {
  // Find user by reset token
  const user = await userRepository.findByResetToken(token);
  
  if (!user) {
    throw new Error('Invalid or expired reset token');
  }
  
  // Validate password
  const passwordValidation = await passwordService.validatePassword(newPassword, user);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.message);
  }
  
  // Reset password
  const updatedUser = await userRepository.resetPassword(token, newPassword);
  
  if (!updatedUser) {
    throw new Error('Failed to reset password');
  }
  
  // Invalidate all sessions for user
  await sessionRepository.invalidateAllForUser(user._id);
  
  // Send password changed email
  await emailService.sendPasswordChangedEmail(updatedUser);
  
  // Log password reset
  await securityLogRepository.createLog({
    userId: user._id,
    eventType: 'PASSWORD_RESET_COMPLETE',
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
    status: 'SUCCESS'
  });
  
  return true;
};

/**
 * Change password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @param {Object} metadata - Request metadata
 * @returns {Promise<boolean>} - Returns change success
 */
const changePassword = async (userId, currentPassword, newPassword, metadata = {}) => {
  // Find user
  const user = await userRepository.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isPasswordValid) {
    // Log failed password change
    await securityLogRepository.createLog({
      userId: user._id,
      eventType: 'PASSWORD_CHANGE',
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      details: { reason: 'Invalid current password' },
      status: 'FAILURE'
    });
    
    throw new Error('Current password is incorrect');
  }
  
  // Validate new password
  const passwordValidation = await passwordService.validatePassword(newPassword, user);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.message);
  }
  
  // Change password
  await userRepository.changePassword(userId, newPassword);
  
  // Invalidate all sessions except current
  const currentSession = metadata.sessionId ? 
    await sessionRepository.findById(metadata.sessionId) : null;
  
  if (currentSession) {
    // Invalidate all other sessions
    const sessions = await sessionRepository.findByUserId(userId, true);
    
    for (const session of sessions) {
      if (session._id.toString() !== currentSession._id.toString()) {
        await sessionRepository.invalidateSession(session._id);
      }
    }
  } else {
    // Invalidate all sessions
    await sessionRepository.invalidateAllForUser(userId);
  }
  
  // Send password changed email
  await emailService.sendPasswordChangedEmail(user);
  
  // Log password change
  await securityLogRepository.createLog({
    userId: user._id,
    eventType: 'PASSWORD_CHANGE',
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
    status: 'SUCCESS'
  });
  
  return true;
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  refreshToken,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  changePassword
};
