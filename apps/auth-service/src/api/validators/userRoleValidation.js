/**
 * User Role Validation
 * Validation schemas for user role management endpoints
 */

const Joi = require('joi');
const { ValidationError } = require('../../utils');

/**
 * Validate assign role request
 * @param {Object} data - Request data
 * @returns {Object} - Validated data
 */
const assignRole = (data) => {
  const schema = Joi.object({
    scope: Joi.object().allow(null)
      .message({
        'object.base': 'Scope must be an object'
      }),
    expiresAt: Joi.date().allow(null).greater('now')
      .message({
        'date.base': 'Expiration date must be a valid date',
        'date.greater': 'Expiration date must be in the future'
      }),
    isActive: Joi.boolean().default(true)
      .message({
        'boolean.base': 'isActive must be a boolean'
      })
  });

  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    throw new ValidationError('Validation failed', error.details);
  }
  
  return value;
};

/**
 * Validate update user role request
 * @param {Object} data - Request data
 * @returns {Object} - Validated data
 */
const updateUserRole = (data) => {
  const schema = Joi.object({
    scope: Joi.object().allow(null)
      .message({
        'object.base': 'Scope must be an object'
      }),
    expiresAt: Joi.date().allow(null).greater('now')
      .message({
        'date.base': 'Expiration date must be a valid date',
        'date.greater': 'Expiration date must be in the future'
      }),
    isActive: Joi.boolean()
      .message({
        'boolean.base': 'isActive must be a boolean'
      })
  });

  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    throw new ValidationError('Validation failed', error.details);
  }
  
  return value;
};

module.exports = {
  assignRole,
  updateUserRole
};
