/**
 * Division Validation
 * Validation schemas for division API endpoints
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

// Create division validation schema
const createDivision = {
  body: Joi.object({
    name: Joi.string().required().trim().min(2).max(100)
      .messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),
    code: Joi.string().required().trim().min(2).max(20).uppercase()
      .pattern(/^[A-Z0-9-_]+$/)
      .messages({
        'string.base': 'Code must be a string',
        'string.empty': 'Code is required',
        'string.min': 'Code must be at least 2 characters long',
        'string.max': 'Code cannot exceed 20 characters',
        'string.pattern.base': 'Code can only contain uppercase letters, numbers, hyphens, and underscores',
        'any.required': 'Code is required'
      }),
    description: Joi.string().allow('').trim().max(500)
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description cannot exceed 500 characters'
      }),
    parent: Joi.string().custom(validateObjectId).allow(null)
      .messages({
        'string.base': 'Parent must be a string',
        'any.invalid': 'Parent must be a valid ID'
      }),
    manager: Joi.string().custom(validateObjectId).allow(null)
      .messages({
        'string.base': 'Manager must be a string',
        'any.invalid': 'Manager must be a valid ID'
      }),
    branch: Joi.string().custom(validateObjectId).allow(null)
      .messages({
        'string.base': 'Branch must be a string',
        'any.invalid': 'Branch must be a valid ID'
      }),
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVED').default('ACTIVE')
      .messages({
        'string.base': 'Status must be a string',
        'any.only': 'Status must be one of: ACTIVE, INACTIVE, PENDING, ARCHIVED'
      }),
    budget: Joi.object({
      annual: Joi.number().min(0),
      spent: Joi.number().min(0),
      remaining: Joi.number().min(0),
      currency: Joi.string().default('IDR'),
      fiscalYear: Joi.number().integer().min(2000).max(2100)
    }).optional(),
    metadata: Joi.object().pattern(Joi.string(), Joi.any()).optional()
  })
};

// Update division validation schema
const updateDivision = {
  params: Joi.object({
    id: Joi.string().custom(validateObjectId).required()
      .messages({
        'string.base': 'ID must be a string',
        'any.invalid': 'ID must be a valid ID',
        'any.required': 'ID is required'
      })
  }),
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100)
      .messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters'
      }),
    code: Joi.string().trim().min(2).max(20).uppercase()
      .pattern(/^[A-Z0-9-_]+$/)
      .messages({
        'string.base': 'Code must be a string',
        'string.min': 'Code must be at least 2 characters long',
        'string.max': 'Code cannot exceed 20 characters',
        'string.pattern.base': 'Code can only contain uppercase letters, numbers, hyphens, and underscores'
      }),
    description: Joi.string().allow('').trim().max(500)
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description cannot exceed 500 characters'
      }),
    parent: Joi.string().custom(validateObjectId).allow(null)
      .messages({
        'string.base': 'Parent must be a string',
        'any.invalid': 'Parent must be a valid ID'
      }),
    manager: Joi.string().custom(validateObjectId).allow(null)
      .messages({
        'string.base': 'Manager must be a string',
        'any.invalid': 'Manager must be a valid ID'
      }),
    branch: Joi.string().custom(validateObjectId).allow(null)
      .messages({
        'string.base': 'Branch must be a string',
        'any.invalid': 'Branch must be a valid ID'
      }),
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVED')
      .messages({
        'string.base': 'Status must be a string',
        'any.only': 'Status must be one of: ACTIVE, INACTIVE, PENDING, ARCHIVED'
      }),
    budget: Joi.object({
      annual: Joi.number().min(0),
      spent: Joi.number().min(0),
      remaining: Joi.number().min(0),
      currency: Joi.string(),
      fiscalYear: Joi.number().integer().min(2000).max(2100)
    }).optional(),
    metadata: Joi.object().pattern(Joi.string(), Joi.any()).optional()
  }).min(1)
    .messages({
      'object.min': 'At least one field must be provided for update'
    })
};

// Change division status validation schema
const changeDivisionStatus = {
  params: Joi.object({
    id: Joi.string().custom(validateObjectId).required()
      .messages({
        'string.base': 'ID must be a string',
        'any.invalid': 'ID must be a valid ID',
        'any.required': 'ID is required'
      })
  }),
  body: Joi.object({
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVED').required()
      .messages({
        'string.base': 'Status must be a string',
        'any.only': 'Status must be one of: ACTIVE, INACTIVE, PENDING, ARCHIVED',
        'any.required': 'Status is required'
      })
  })
};

// Update division budget validation schema
const updateDivisionBudget = {
  params: Joi.object({
    id: Joi.string().custom(validateObjectId).required()
      .messages({
        'string.base': 'ID must be a string',
        'any.invalid': 'ID must be a valid ID',
        'any.required': 'ID is required'
      })
  }),
  body: Joi.object({
    annual: Joi.number().min(0)
      .messages({
        'number.base': 'Annual budget must be a number',
        'number.min': 'Annual budget cannot be negative'
      }),
    spent: Joi.number().min(0)
      .messages({
        'number.base': 'Spent budget must be a number',
        'number.min': 'Spent budget cannot be negative'
      }),
    remaining: Joi.number().min(0)
      .messages({
        'number.base': 'Remaining budget must be a number',
        'number.min': 'Remaining budget cannot be negative'
      }),
    currency: Joi.string()
      .messages({
        'string.base': 'Currency must be a string'
      }),
    fiscalYear: Joi.number().integer().min(2000).max(2100)
      .messages({
        'number.base': 'Fiscal year must be a number',
        'number.integer': 'Fiscal year must be an integer',
        'number.min': 'Fiscal year must be at least 2000',
        'number.max': 'Fiscal year cannot exceed 2100'
      })
  }).min(1)
    .messages({
      'object.min': 'At least one budget field must be provided for update'
    })
};

// Transfer division to branch validation schema
const transferDivisionToBranch = {
  params: Joi.object({
    id: Joi.string().custom(validateObjectId).required()
      .messages({
        'string.base': 'ID must be a string',
        'any.invalid': 'ID must be a valid ID',
        'any.required': 'ID is required'
      })
  }),
  body: Joi.object({
    branchId: Joi.string().custom(validateObjectId).required()
      .messages({
        'string.base': 'Branch ID must be a string',
        'any.invalid': 'Branch ID must be a valid ID',
        'any.required': 'Branch ID is required'
      })
  })
};

module.exports = {
  createDivision,
  updateDivision,
  changeDivisionStatus,
  updateDivisionBudget,
  transferDivisionToBranch
};
