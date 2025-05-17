/**
 * Password Service
 * Handles password validation, strength checking, and history management
 */

const zxcvbn = require('zxcvbn');

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {Object} - Returns password strength analysis
 */
const checkPasswordStrength = (password) => {
  return zxcvbn(password);
};

/**
 * Validate password complexity
 * @param {string} password - Password to validate
 * @returns {Object} - Returns validation result
 */
const validatePasswordComplexity = (password) => {
  // Check minimum length
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }
  
  // Check for number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character'
    };
  }
  
  // Check password strength
  const strength = checkPasswordStrength(password);
  
  if (strength.score < 3) {
    return {
      isValid: false,
      message: 'Password is too weak. Please choose a stronger password.',
      suggestions: strength.feedback.suggestions
    };
  }
  
  return {
    isValid: true,
    message: 'Password meets complexity requirements',
    score: strength.score
  };
};

/**
 * Check if password is in common password list
 * @param {string} password - Password to check
 * @returns {boolean} - Returns true if password is common
 */
const isCommonPassword = (password) => {
  const commonPasswords = [
    'password', 'password123', '123456', '12345678', 'qwerty',
    'admin', 'admin123', 'welcome', 'welcome123', 'letmein',
    'abc123', 'monkey', 'dragon', 'baseball', 'football',
    'superman', 'batman', 'trustno1', 'sunshine', 'iloveyou'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
};

/**
 * Check if password contains personal information
 * @param {string} password - Password to check
 * @param {Object} user - User object
 * @returns {boolean} - Returns true if password contains personal info
 */
const containsPersonalInfo = (password, user) => {
  const passwordLower = password.toLowerCase();
  const personalInfo = [
    user.firstName,
    user.lastName,
    user.username,
    user.email.split('@')[0]
  ].filter(Boolean).map(info => info.toLowerCase());
  
  return personalInfo.some(info => 
    info.length > 2 && passwordLower.includes(info)
  );
};

/**
 * Check if password is reused
 * @param {string} password - Password to check
 * @param {Object} user - User object
 * @returns {Promise<boolean>} - Returns true if password is reused
 */
const isPasswordReused = async (password, user) => {
  if (!user || !user.isPasswordInHistory) {
    return false;
  }
  
  return user.isPasswordInHistory(password);
};

/**
 * Validate password for user
 * @param {string} password - Password to validate
 * @param {Object} user - User object
 * @returns {Promise<Object>} - Returns validation result
 */
const validatePassword = async (password, user = null) => {
  // Check complexity
  const complexityResult = validatePasswordComplexity(password);
  if (!complexityResult.isValid) {
    return complexityResult;
  }
  
  // Check if password is common
  if (isCommonPassword(password)) {
    return {
      isValid: false,
      message: 'Password is too common. Please choose a more unique password.'
    };
  }
  
  // Check if password contains personal info
  if (user && containsPersonalInfo(password, user)) {
    return {
      isValid: false,
      message: 'Password contains personal information. Please choose a different password.'
    };
  }
  
  // Check if password is reused
  if (user && await isPasswordReused(password, user)) {
    return {
      isValid: false,
      message: 'Password has been used recently. Please choose a different password.'
    };
  }
  
  return {
    isValid: true,
    message: 'Password is valid',
    score: complexityResult.score
  };
};

module.exports = {
  checkPasswordStrength,
  validatePasswordComplexity,
  isCommonPassword,
  containsPersonalInfo,
  isPasswordReused,
  validatePassword
};
