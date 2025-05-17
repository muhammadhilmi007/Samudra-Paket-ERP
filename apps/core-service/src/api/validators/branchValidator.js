/**
 * Branch Validator
 * Validates request data for branch management endpoints
 */

const Joi = require('joi');
const mongoose = require('mongoose');

/**
 * Validate ObjectId
 * @param {string} value - Value to validate
 * @returns {boolean} - Returns true if valid ObjectId
 */
const isValidObjectId = (value) => {
  return value === null || value === 'null' || mongoose.Types.ObjectId.isValid(value);
};

/**
 * Base branch schema
 */
const baseBranchSchema = {
  code: Joi.string().trim().max(10).required().messages({
    'string.empty': 'Branch code is required',
    'string.max': 'Branch code cannot exceed 10 characters'
  }),
  name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Branch name is required',
    'string.max': 'Branch name cannot exceed 100 characters'
  }),
  type: Joi.string().valid('HEAD_OFFICE', 'REGIONAL', 'BRANCH').required().messages({
    'string.empty': 'Branch type is required',
    'any.only': 'Branch type must be HEAD_OFFICE, REGIONAL, or BRANCH'
  }),
  parent: Joi.alternatives().try(
    Joi.string().custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }),
    Joi.allow(null)
  ).messages({
    'any.invalid': 'Parent must be a valid ID or null'
  }),
  level: Joi.number().integer().min(0).max(10).required().messages({
    'number.base': 'Level must be a number',
    'number.min': 'Level must be at least 0',
    'number.max': 'Level cannot exceed 10',
    'any.required': 'Level is required'
  }),
  path: Joi.string().allow('', null),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'PENDING', 'CLOSED').default('ACTIVE').messages({
    'any.only': 'Status must be ACTIVE, INACTIVE, PENDING, or CLOSED'
  }),
  address: Joi.object({
    street: Joi.string().trim().required().messages({
      'string.empty': 'Street address is required'
    }),
    city: Joi.string().trim().required().messages({
      'string.empty': 'City is required'
    }),
    province: Joi.string().trim().required().messages({
      'string.empty': 'Province is required'
    }),
    postalCode: Joi.string().trim().required().messages({
      'string.empty': 'Postal code is required'
    }),
    country: Joi.string().trim().default('Indonesia'),
    coordinates: Joi.object({
      latitude: Joi.number().allow(null),
      longitude: Joi.number().allow(null)
    })
  }).required().messages({
    'object.base': 'Address is required'
  }),
  contactInfo: Joi.object({
    phone: Joi.string().trim().required().messages({
      'string.empty': 'Phone number is required'
    }),
    email: Joi.string().trim().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email'
    }),
    fax: Joi.string().trim().allow(null, ''),
    website: Joi.string().trim().allow(null, '')
  }).required().messages({
    'object.base': 'Contact information is required'
  })
};

/**
 * Create branch schema
 */
const createBranchSchema = Joi.object({
  ...baseBranchSchema,
  operationalHours: Joi.array().items(
    Joi.object({
      day: Joi.string().valid('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY').required(),
      isOpen: Joi.boolean().default(true),
      openTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).when('isOpen', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.allow(null, '')
      }),
      closeTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).when('isOpen', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.allow(null, '')
      })
    })
  ).min(7).max(7).messages({
    'array.min': 'Operational hours must be specified for all 7 days of the week',
    'array.max': 'Operational hours must be specified for all 7 days of the week'
  }),
  resources: Joi.object({
    employeeCount: Joi.number().min(0).default(0),
    vehicleCount: Joi.number().min(0).default(0),
    storageCapacity: Joi.number().min(0).default(0)
  }).default({
    employeeCount: 0,
    vehicleCount: 0,
    storageCapacity: 0
  })
});

/**
 * Update branch schema
 */
const updateBranchSchema = Joi.object({
  ...baseBranchSchema,
  code: Joi.string().trim().max(10).messages({
    'string.max': 'Branch code cannot exceed 10 characters'
  }),
  name: Joi.string().trim().max(100).messages({
    'string.max': 'Branch name cannot exceed 100 characters'
  }),
  type: Joi.string().valid('HEAD_OFFICE', 'REGIONAL', 'BRANCH').messages({
    'any.only': 'Branch type must be HEAD_OFFICE, REGIONAL, or BRANCH'
  }),
  address: Joi.object({
    street: Joi.string().trim(),
    city: Joi.string().trim(),
    province: Joi.string().trim(),
    postalCode: Joi.string().trim(),
    country: Joi.string().trim(),
    coordinates: Joi.object({
      latitude: Joi.number().allow(null),
      longitude: Joi.number().allow(null)
    })
  }),
  contactInfo: Joi.object({
    phone: Joi.string().trim(),
    email: Joi.string().trim().email().messages({
      'string.email': 'Please provide a valid email'
    }),
    fax: Joi.string().trim().allow(null, ''),
    website: Joi.string().trim().allow(null, '')
  })
}).min(1).messages({
  'object.min': 'At least one field is required for update'
});

/**
 * Update status schema
 */
const updateStatusSchema = Joi.object({
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'PENDING', 'CLOSED').required().messages({
    'string.empty': 'Status is required',
    'any.only': 'Status must be ACTIVE, INACTIVE, PENDING, or CLOSED'
  }),
  reason: Joi.string().trim().required().messages({
    'string.empty': 'Reason for status change is required'
  })
});

/**
 * Update metrics schema
 */
const updateMetricsSchema = Joi.object({
  monthlyShipmentVolume: Joi.number().min(0),
  monthlyRevenue: Joi.number().min(0),
  customerSatisfactionScore: Joi.number().min(0).max(5).messages({
    'number.min': 'Customer satisfaction score cannot be negative',
    'number.max': 'Customer satisfaction score cannot exceed 5'
  }),
  deliverySuccessRate: Joi.number().min(0).max(100).messages({
    'number.min': 'Delivery success rate cannot be negative',
    'number.max': 'Delivery success rate cannot exceed 100'
  })
}).min(1).messages({
  'object.min': 'At least one metric is required for update'
});

/**
 * Update resources schema
 */
const updateResourcesSchema = Joi.object({
  employeeCount: Joi.number().min(0).messages({
    'number.min': 'Employee count cannot be negative'
  }),
  vehicleCount: Joi.number().min(0).messages({
    'number.min': 'Vehicle count cannot be negative'
  }),
  storageCapacity: Joi.number().min(0).messages({
    'number.min': 'Storage capacity cannot be negative'
  })
}).min(1).messages({
  'object.min': 'At least one resource is required for update'
});

/**
 * Add document schema
 */
const addDocumentSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Document name is required'
  }),
  type: Joi.string().valid('LICENSE', 'PERMIT', 'CERTIFICATE', 'CONTRACT', 'OTHER').required().messages({
    'string.empty': 'Document type is required',
    'any.only': 'Document type must be LICENSE, PERMIT, CERTIFICATE, CONTRACT, or OTHER'
  }),
  fileUrl: Joi.string().trim().required().messages({
    'string.empty': 'File URL is required'
  }),
  expiryDate: Joi.date().allow(null).greater('now').messages({
    'date.greater': 'Expiry date must be in the future'
  })
});

/**
 * Update operational hours schema
 */
const updateOperationalHoursSchema = Joi.array().items(
  Joi.object({
    day: Joi.string().valid('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY').required().messages({
      'string.empty': 'Day is required',
      'any.only': 'Day must be MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, or SUNDAY'
    }),
    isOpen: Joi.boolean().required(),
    openTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).when('isOpen', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow(null, '')
    }).messages({
      'string.pattern.base': 'Open time must be in format HH:MM'
    }),
    closeTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).when('isOpen', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow(null, '')
    }).messages({
      'string.pattern.base': 'Close time must be in format HH:MM'
    })
  })
).min(7).max(7).messages({
  'array.min': 'Operational hours must be specified for all 7 days of the week',
  'array.max': 'Operational hours must be specified for all 7 days of the week'
});

/**
 * Validate create branch request
 */
const validateCreateBranch = (req, res, next) => {
  const { error, value } = createBranchSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorMessage
    });
  }
  
  req.body = value;
  next();
};

/**
 * Validate update branch request
 */
const validateUpdateBranch = (req, res, next) => {
  const { error, value } = updateBranchSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorMessage
    });
  }
  
  req.body = value;
  next();
};

/**
 * Validate update status request
 */
const validateUpdateStatus = (req, res, next) => {
  const { error, value } = updateStatusSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorMessage
    });
  }
  
  req.body = value;
  next();
};

/**
 * Validate update metrics request
 */
const validateUpdateMetrics = (req, res, next) => {
  const { error, value } = updateMetricsSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorMessage
    });
  }
  
  req.body = value;
  next();
};

/**
 * Validate update resources request
 */
const validateUpdateResources = (req, res, next) => {
  const { error, value } = updateResourcesSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorMessage
    });
  }
  
  req.body = value;
  next();
};

/**
 * Validate add document request
 */
const validateAddDocument = (req, res, next) => {
  const { error, value } = addDocumentSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorMessage
    });
  }
  
  req.body = value;
  next();
};

/**
 * Validate update operational hours request
 */
const validateUpdateOperationalHours = (req, res, next) => {
  const { error, value } = updateOperationalHoursSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errorMessage
    });
  }
  
  req.body = value;
  next();
};

module.exports = {
  validateCreateBranch,
  validateUpdateBranch,
  validateUpdateStatus,
  validateUpdateMetrics,
  validateUpdateResources,
  validateAddDocument,
  validateUpdateOperationalHours
};
