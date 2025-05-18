/**
 * Organizational Change Validation
 * Validation schemas for organizational change API endpoints
 */

const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;

// Helper function to validate ObjectId
const validateObjectId = (value, helpers) => {
  if (!ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

// Helper function to validate date
const validateDate = (value, helpers) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return helpers.error('date.invalid');
  }
  return date;
};

// Get changes by entity validation schema
const getChangesByEntity = {
  params: Joi.object({
    entityType: Joi.string().valid('DIVISION', 'POSITION').required()
      .messages({
        'string.base': 'Entity type must be a string',
        'any.only': 'Entity type must be one of: DIVISION, POSITION',
        'any.required': 'Entity type is required'
      }),
    entityId: Joi.string().custom(validateObjectId).required()
      .messages({
        'string.base': 'Entity ID must be a string',
        'any.invalid': 'Entity ID must be a valid ID',
        'any.required': 'Entity ID is required'
      })
  }),
  query: Joi.object({
    changeType: Joi.string().valid('CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'TRANSFER', 'RESTRUCTURE')
      .messages({
        'string.base': 'Change type must be a string',
        'any.only': 'Change type must be one of: CREATE, UPDATE, DELETE, ACTIVATE, DEACTIVATE, TRANSFER, RESTRUCTURE'
      }),
    startDate: Joi.string().custom(validateDate)
      .messages({
        'string.base': 'Start date must be a string',
        'date.invalid': 'Start date must be a valid date'
      }),
    endDate: Joi.string().custom(validateDate)
      .messages({
        'string.base': 'End date must be a string',
        'date.invalid': 'End date must be a valid date'
      }),
    page: Joi.number().integer().min(1)
      .messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
      }),
    limit: Joi.number().integer().min(1).max(100)
      .messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
      })
  })
};

// Get changes by type validation schema
const getChangesByType = {
  params: Joi.object({
    changeType: Joi.string().valid('CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'TRANSFER', 'RESTRUCTURE').required()
      .messages({
        'string.base': 'Change type must be a string',
        'any.only': 'Change type must be one of: CREATE, UPDATE, DELETE, ACTIVATE, DEACTIVATE, TRANSFER, RESTRUCTURE',
        'any.required': 'Change type is required'
      })
  }),
  query: Joi.object({
    entityType: Joi.string().valid('DIVISION', 'POSITION')
      .messages({
        'string.base': 'Entity type must be a string',
        'any.only': 'Entity type must be one of: DIVISION, POSITION'
      }),
    startDate: Joi.string().custom(validateDate)
      .messages({
        'string.base': 'Start date must be a string',
        'date.invalid': 'Start date must be a valid date'
      }),
    endDate: Joi.string().custom(validateDate)
      .messages({
        'string.base': 'End date must be a string',
        'date.invalid': 'End date must be a valid date'
      }),
    page: Joi.number().integer().min(1)
      .messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
      }),
    limit: Joi.number().integer().min(1).max(100)
      .messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
      })
  })
};

// Get changes by date range validation schema
const getChangesByDateRange = {
  params: Joi.object({
    startDate: Joi.string().custom(validateDate).required()
      .messages({
        'string.base': 'Start date must be a string',
        'date.invalid': 'Start date must be a valid date',
        'any.required': 'Start date is required'
      }),
    endDate: Joi.string().custom(validateDate).required()
      .messages({
        'string.base': 'End date must be a string',
        'date.invalid': 'End date must be a valid date',
        'any.required': 'End date is required'
      })
  }),
  query: Joi.object({
    entityType: Joi.string().valid('DIVISION', 'POSITION')
      .messages({
        'string.base': 'Entity type must be a string',
        'any.only': 'Entity type must be one of: DIVISION, POSITION'
      }),
    changeType: Joi.string().valid('CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'TRANSFER', 'RESTRUCTURE')
      .messages({
        'string.base': 'Change type must be a string',
        'any.only': 'Change type must be one of: CREATE, UPDATE, DELETE, ACTIVATE, DEACTIVATE, TRANSFER, RESTRUCTURE'
      }),
    page: Joi.number().integer().min(1)
      .messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
      }),
    limit: Joi.number().integer().min(1).max(100)
      .messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
      })
  })
};

// Search changes validation schema
const searchChanges = {
  params: Joi.object({
    query: Joi.string().required().trim().min(2)
      .messages({
        'string.base': 'Search query must be a string',
        'string.empty': 'Search query is required',
        'string.min': 'Search query must be at least 2 characters long',
        'any.required': 'Search query is required'
      })
  }),
  query: Joi.object({
    entityType: Joi.string().valid('DIVISION', 'POSITION')
      .messages({
        'string.base': 'Entity type must be a string',
        'any.only': 'Entity type must be one of: DIVISION, POSITION'
      }),
    changeType: Joi.string().valid('CREATE', 'UPDATE', 'DELETE', 'ACTIVATE', 'DEACTIVATE', 'TRANSFER', 'RESTRUCTURE')
      .messages({
        'string.base': 'Change type must be a string',
        'any.only': 'Change type must be one of: CREATE, UPDATE, DELETE, ACTIVATE, DEACTIVATE, TRANSFER, RESTRUCTURE'
      }),
    startDate: Joi.string().custom(validateDate)
      .messages({
        'string.base': 'Start date must be a string',
        'date.invalid': 'Start date must be a valid date'
      }),
    endDate: Joi.string().custom(validateDate)
      .messages({
        'string.base': 'End date must be a string',
        'date.invalid': 'End date must be a valid date'
      }),
    page: Joi.number().integer().min(1)
      .messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
      }),
    limit: Joi.number().integer().min(1).max(100)
      .messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
      })
  })
};

module.exports = {
  getChangesByEntity,
  getChangesByType,
  getChangesByDateRange,
  searchChanges
};
