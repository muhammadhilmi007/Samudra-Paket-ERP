/**
 * Permission Validation
 * Validation schemas for permission management endpoints
 */

const Joi = require('joi');
const { ValidationError } = require('../../utils');

/**
 * Validate create permission request
 * @param {Object} data - Request data
 * @returns {Object} - Validated data
 */
const createPermission = (data) => {
  const schema = Joi.object({
    resource: Joi.string().required().trim().min(2).max(50)
      .message({
        'string.empty': 'Resource name is required',
        'string.min': 'Resource name must be at least 2 characters',
        'string.max': 'Resource name cannot exceed 50 characters',
        'any.required': 'Resource name is required'
      }),
    action: Joi.string().required().trim().min(2).max(50)
      .message({
        'string.empty': 'Action name is required',
        'string.min': 'Action name must be at least 2 characters',
        'string.max': 'Action name cannot exceed 50 characters',
        'any.required': 'Action name is required'
      }),
    attributes: Joi.object().allow(null)
      .message({
        'object.base': 'Attributes must be an object'
      }),
    description: Joi.string().allow('').max(500)
      .message({
        'string.max': 'Description cannot exceed 500 characters'
      })
  });

  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    throw new ValidationError('Validation failed', error.details);
  }
  
  return value;
};

/**
 * Validate update permission request
 * @param {Object} data - Request data
 * @returns {Object} - Validated data
 */
const updatePermission = (data) => {
  const schema = Joi.object({
    resource: Joi.string().trim().min(2).max(50)
      .message({
        'string.min': 'Resource name must be at least 2 characters',
        'string.max': 'Resource name cannot exceed 50 characters'
      }),
    action: Joi.string().trim().min(2).max(50)
      .message({
        'string.min': 'Action name must be at least 2 characters',
        'string.max': 'Action name cannot exceed 50 characters'
      }),
    attributes: Joi.object().allow(null)
      .message({
        'object.base': 'Attributes must be an object'
      }),
    description: Joi.string().allow('').max(500)
      .message({
        'string.max': 'Description cannot exceed 500 characters'
      })
  });

  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    throw new ValidationError('Validation failed', error.details);
  }
  
  return value;
};

/**
 * Validate assign permission request
 * @param {Object} data - Request data
 * @returns {Object} - Validated data
 */
const assignPermission = (data) => {
  const schema = Joi.object({
    constraints: Joi.object().allow(null)
      .message({
        'object.base': 'Constraints must be an object'
      }),
    granted: Joi.boolean().default(true)
      .message({
        'boolean.base': 'Granted must be a boolean'
      })
  });

  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    throw new ValidationError('Validation failed', error.details);
  }
  
  return value;
};

module.exports = {
  createPermission,
  updatePermission,
  assignPermission
};
