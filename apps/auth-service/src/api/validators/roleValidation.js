/**
 * Role Validation
 * Validation schemas for role management endpoints
 */

const Joi = require('joi');
const { ValidationError } = require('../../utils');

/**
 * Validate create role request
 * @param {Object} data - Request data
 * @returns {Object} - Validated data
 */
const createRole = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(2).max(50)
      .message({
        'string.empty': 'Role name is required',
        'string.min': 'Role name must be at least 2 characters',
        'string.max': 'Role name cannot exceed 50 characters',
        'any.required': 'Role name is required'
      }),
    description: Joi.string().allow('').max(500)
      .message({
        'string.max': 'Description cannot exceed 500 characters'
      }),
    parent: Joi.string().allow(null, '')
      .message({
        'string.base': 'Parent role ID must be a string'
      })
  });

  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    throw new ValidationError('Validation failed', error.details);
  }
  
  return value;
};

/**
 * Validate update role request
 * @param {Object} data - Request data
 * @returns {Object} - Validated data
 */
const updateRole = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(50)
      .message({
        'string.min': 'Role name must be at least 2 characters',
        'string.max': 'Role name cannot exceed 50 characters'
      }),
    description: Joi.string().allow('').max(500)
      .message({
        'string.max': 'Description cannot exceed 500 characters'
      }),
    parent: Joi.string().allow(null, '')
      .message({
        'string.base': 'Parent role ID must be a string'
      })
  });

  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    throw new ValidationError('Validation failed', error.details);
  }
  
  return value;
};

module.exports = {
  createRole,
  updateRole
};
