/**
 * Auth Validators
 * Validates authentication-related requests
 */

const Joi = require('joi');

// Register user validation schema
const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters'
    }),
  lastName: Joi.string().trim().min(2).max(50).required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters'
    }),
  email: Joi.string().trim().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  phoneNumber: Joi.string().trim().pattern(/^\+?[0-9]{10,15}$/).allow('').optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  username: Joi.string().trim().alphanum().min(3).max(30).required()
    .messages({
      'string.empty': 'Username is required',
      'string.alphanum': 'Username must only contain alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 30 characters'
    }),
  password: Joi.string().min(8).required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long'
    }),
  role: Joi.string().valid('admin', 'manager', 'courier', 'driver', 'collector', 'warehouse', 'customer')
    .default('customer')
    .messages({
      'any.only': 'Role must be one of: admin, manager, courier, driver, collector, warehouse, customer'
    })
});

// Login validation schema
const loginSchema = Joi.object({
  username: Joi.string().trim().required()
    .messages({
      'string.empty': 'Username or email is required'
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required'
    })
});

// Refresh token validation schema
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
    .messages({
      'string.empty': 'Refresh token is required'
    })
});

// Email verification validation schema
const verifyEmailSchema = Joi.object({
  token: Joi.string().required()
    .messages({
      'string.empty': 'Verification token is required'
    })
});

// Password reset request validation schema
const passwordResetRequestSchema = Joi.object({
  email: Joi.string().trim().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    })
});

// Password reset validation schema
const passwordResetSchema = Joi.object({
  token: Joi.string().required()
    .messages({
      'string.empty': 'Reset token is required'
    }),
  password: Joi.string().min(8).required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 8 characters long'
    })
});

// Password change validation schema
const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().required()
    .messages({
      'string.empty': 'Current password is required'
    }),
  newPassword: Joi.string().min(8).required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 8 characters long'
    })
});

// Logout validation schema
const logoutSchema = Joi.object({
  refreshToken: Joi.string().required()
    .messages({
      'string.empty': 'Refresh token is required'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  passwordChangeSchema,
  logoutSchema
};
