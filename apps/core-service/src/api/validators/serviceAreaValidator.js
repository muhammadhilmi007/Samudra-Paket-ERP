/**
 * Service Area Validator
 * Validates request data for service area management endpoints
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
 * Base service area schema
 */
const baseServiceAreaSchema = {
  code: Joi.string().trim().max(10).required().messages({
    'string.empty': 'Service area code is required',
    'string.max': 'Service area code cannot exceed 10 characters'
  }),
  name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Service area name is required',
    'string.max': 'Service area name cannot exceed 100 characters'
  }),
  description: Joi.string().trim().max(500).allow('', null).messages({
    'string.max': 'Description cannot exceed 500 characters'
  }),
  adminCode: Joi.string().trim().allow('', null),
  adminLevel: Joi.string().valid('PROVINCE', 'CITY', 'DISTRICT', 'SUBDISTRICT').messages({
    'any.only': 'Admin level must be PROVINCE, CITY, DISTRICT, or SUBDISTRICT'
  }),
  geometry: Joi.object({
    type: Joi.string().valid('Polygon', 'MultiPolygon').required().messages({
      'string.empty': 'Geometry type is required',
      'any.only': 'Geometry type must be Polygon or MultiPolygon'
    }),
    coordinates: Joi.array().required().messages({
      'array.base': 'Coordinates must be an array'
    })
  }).required().messages({
    'object.base': 'Geometry is required'
  }),
  center: Joi.object({
    type: Joi.string().valid('Point').default('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2).messages({
      'array.length': 'Center coordinates must contain exactly 2 values [longitude, latitude]'
    })
  }),
  areaType: Joi.string().valid('INNER_CITY', 'OUT_OF_CITY', 'REMOTE_AREA').messages({
    'any.only': 'Area type must be INNER_CITY, OUT_OF_CITY, or REMOTE_AREA'
  }),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').messages({
    'any.only': 'Status must be ACTIVE or INACTIVE'
  })
};

/**
 * Create service area schema
 */
const createServiceAreaSchema = Joi.object({
  ...baseServiceAreaSchema
});

/**
 * Update service area schema
 */
const updateServiceAreaSchema = Joi.object({
  ...baseServiceAreaSchema,
  code: Joi.string().trim().max(10).messages({
    'string.max': 'Service area code cannot exceed 10 characters'
  }),
  name: Joi.string().trim().max(100).messages({
    'string.max': 'Service area name cannot exceed 100 characters'
  }),
  geometry: Joi.object({
    type: Joi.string().valid('Polygon', 'MultiPolygon').messages({
      'any.only': 'Geometry type must be Polygon or MultiPolygon'
    }),
    coordinates: Joi.array()
  }),
  reason: Joi.string().trim().max(500).messages({
    'string.max': 'Reason cannot exceed 500 characters'
  })
}).min(1);

/**
 * Service area assignment schema
 */
const serviceAreaAssignmentSchema = Joi.object({
  serviceAreaId: Joi.string().custom((value, helpers) => {
    if (!isValidObjectId(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required().messages({
    'string.empty': 'Service area ID is required',
    'any.invalid': 'Service area ID must be a valid ID'
  }),
  branchId: Joi.string().custom((value, helpers) => {
    if (!isValidObjectId(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required().messages({
    'string.empty': 'Branch ID is required',
    'any.invalid': 'Branch ID must be a valid ID'
  }),
  priorityLevel: Joi.number().integer().min(1).max(10).required().messages({
    'number.base': 'Priority level must be a number',
    'number.min': 'Priority level must be at least 1',
    'number.max': 'Priority level cannot exceed 10',
    'any.required': 'Priority level is required'
  }),
  notes: Joi.string().trim().max(500).allow('', null).messages({
    'string.max': 'Notes cannot exceed 500 characters'
  })
});

/**
 * Update service area assignment schema
 */
const updateServiceAreaAssignmentSchema = Joi.object({
  priorityLevel: Joi.number().integer().min(1).max(10).messages({
    'number.base': 'Priority level must be a number',
    'number.min': 'Priority level must be at least 1',
    'number.max': 'Priority level cannot exceed 10'
  }),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').messages({
    'any.only': 'Status must be ACTIVE or INACTIVE'
  }),
  notes: Joi.string().trim().max(500).allow('', null).messages({
    'string.max': 'Notes cannot exceed 500 characters'
  })
}).min(1);

/**
 * Service area pricing schema
 */
const serviceAreaPricingSchema = Joi.object({
  serviceArea: Joi.string().custom((value, helpers) => {
    if (!isValidObjectId(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required().messages({
    'string.empty': 'Service area ID is required',
    'any.invalid': 'Service area ID must be a valid ID'
  }),
  serviceType: Joi.string().valid('REGULAR', 'EXPRESS', 'SAME_DAY', 'NEXT_DAY', 'ECONOMY').required().messages({
    'string.empty': 'Service type is required',
    'any.only': 'Service type must be REGULAR, EXPRESS, SAME_DAY, NEXT_DAY, or ECONOMY'
  }),
  basePrice: Joi.number().min(0).required().messages({
    'number.base': 'Base price must be a number',
    'number.min': 'Base price cannot be negative',
    'any.required': 'Base price is required'
  }),
  pricePerKm: Joi.number().min(0).required().messages({
    'number.base': 'Price per kilometer must be a number',
    'number.min': 'Price per kilometer cannot be negative',
    'any.required': 'Price per kilometer is required'
  }),
  pricePerKg: Joi.number().min(0).required().messages({
    'number.base': 'Price per kilogram must be a number',
    'number.min': 'Price per kilogram cannot be negative',
    'any.required': 'Price per kilogram is required'
  }),
  minCharge: Joi.number().min(0).required().messages({
    'number.base': 'Minimum charge must be a number',
    'number.min': 'Minimum charge cannot be negative',
    'any.required': 'Minimum charge is required'
  }),
  maxCharge: Joi.number().min(0).allow(null).messages({
    'number.base': 'Maximum charge must be a number',
    'number.min': 'Maximum charge cannot be negative'
  }),
  insuranceFee: Joi.number().min(0).default(0).messages({
    'number.base': 'Insurance fee must be a number',
    'number.min': 'Insurance fee cannot be negative'
  }),
  packagingFee: Joi.number().min(0).default(0).messages({
    'number.base': 'Packaging fee must be a number',
    'number.min': 'Packaging fee cannot be negative'
  }),
  effectiveFrom: Joi.date().default(Date.now),
  effectiveTo: Joi.date().allow(null).greater(Joi.ref('effectiveFrom')).messages({
    'date.greater': 'Effective to date must be after effective from date'
  }),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE').messages({
    'any.only': 'Status must be ACTIVE or INACTIVE'
  })
});

/**
 * Update service area pricing schema
 */
const updateServiceAreaPricingSchema = Joi.object({
  basePrice: Joi.number().min(0).messages({
    'number.base': 'Base price must be a number',
    'number.min': 'Base price cannot be negative'
  }),
  pricePerKm: Joi.number().min(0).messages({
    'number.base': 'Price per kilometer must be a number',
    'number.min': 'Price per kilometer cannot be negative'
  }),
  pricePerKg: Joi.number().min(0).messages({
    'number.base': 'Price per kilogram must be a number',
    'number.min': 'Price per kilogram cannot be negative'
  }),
  minCharge: Joi.number().min(0).messages({
    'number.base': 'Minimum charge must be a number',
    'number.min': 'Minimum charge cannot be negative'
  }),
  maxCharge: Joi.number().min(0).allow(null).messages({
    'number.base': 'Maximum charge must be a number',
    'number.min': 'Maximum charge cannot be negative'
  }),
  insuranceFee: Joi.number().min(0).messages({
    'number.base': 'Insurance fee must be a number',
    'number.min': 'Insurance fee cannot be negative'
  }),
  packagingFee: Joi.number().min(0).messages({
    'number.base': 'Packaging fee must be a number',
    'number.min': 'Packaging fee cannot be negative'
  }),
  effectiveFrom: Joi.date(),
  effectiveTo: Joi.date().allow(null).greater(Joi.ref('effectiveFrom')).messages({
    'date.greater': 'Effective to date must be after effective from date'
  }),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').messages({
    'any.only': 'Status must be ACTIVE or INACTIVE'
  })
}).min(1);

/**
 * Calculate shipping price schema
 */
const calculateShippingPriceSchema = Joi.object({
  serviceAreaId: Joi.string().custom((value, helpers) => {
    if (!isValidObjectId(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required().messages({
    'string.empty': 'Service area ID is required',
    'any.invalid': 'Service area ID must be a valid ID'
  }),
  serviceType: Joi.string().valid('REGULAR', 'EXPRESS', 'SAME_DAY', 'NEXT_DAY', 'ECONOMY').required().messages({
    'string.empty': 'Service type is required',
    'any.only': 'Service type must be REGULAR, EXPRESS, SAME_DAY, NEXT_DAY, or ECONOMY'
  }),
  distance: Joi.number().min(0).required().messages({
    'number.base': 'Distance must be a number',
    'number.min': 'Distance cannot be negative',
    'any.required': 'Distance is required'
  }),
  weight: Joi.number().greater(0).required().messages({
    'number.base': 'Weight must be a number',
    'number.greater': 'Weight must be greater than zero',
    'any.required': 'Weight is required'
  })
});

/**
 * Find by location schema
 */
const findByLocationSchema = Joi.object({
  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.base': 'Longitude must be a number',
    'number.min': 'Longitude must be at least -180',
    'number.max': 'Longitude cannot exceed 180',
    'any.required': 'Longitude is required'
  }),
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.base': 'Latitude must be a number',
    'number.min': 'Latitude must be at least -90',
    'number.max': 'Latitude cannot exceed 90',
    'any.required': 'Latitude is required'
  }),
  searchType: Joi.string().valid('contains', 'near', 'polygon').default('contains').messages({
    'any.only': 'Search type must be contains, near, or polygon'
  }),
  maxDistance: Joi.number().min(0).when('searchType', {
    is: 'near',
    then: Joi.required(),
    otherwise: Joi.optional()
  }).messages({
    'number.base': 'Max distance must be a number',
    'number.min': 'Max distance cannot be negative',
    'any.required': 'Max distance is required for near search'
  }),
  polygon: Joi.object({
    type: Joi.string().valid('Polygon', 'MultiPolygon').required(),
    coordinates: Joi.array().required()
  }).when('searchType', {
    is: 'polygon',
    then: Joi.required(),
    otherwise: Joi.optional()
  }).messages({
    'object.base': 'Polygon must be an object',
    'any.required': 'Polygon is required for polygon search'
  })
});

/**
 * Validate create service area request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateCreateServiceArea = (req, res, next) => {
  const { error } = createServiceAreaSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  next();
};

/**
 * Validate update service area request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateUpdateServiceArea = (req, res, next) => {
  const { error } = updateServiceAreaSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  next();
};

/**
 * Validate service area assignment request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateServiceAreaAssignment = (req, res, next) => {
  const { error } = serviceAreaAssignmentSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  next();
};

/**
 * Validate update service area assignment request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateUpdateServiceAreaAssignment = (req, res, next) => {
  const { error } = updateServiceAreaAssignmentSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  next();
};

/**
 * Validate service area pricing request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateServiceAreaPricing = (req, res, next) => {
  const { error } = serviceAreaPricingSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  next();
};

/**
 * Validate update service area pricing request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateUpdateServiceAreaPricing = (req, res, next) => {
  const { error } = updateServiceAreaPricingSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  next();
};

/**
 * Validate calculate shipping price request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateCalculateShippingPrice = (req, res, next) => {
  const { error } = calculateShippingPriceSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  next();
};

/**
 * Validate find by location request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateFindByLocation = (req, res, next) => {
  const { error } = findByLocationSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  next();
};

module.exports = {
  validateCreateServiceArea,
  validateUpdateServiceArea,
  validateServiceAreaAssignment,
  validateUpdateServiceAreaAssignment,
  validateServiceAreaPricing,
  validateUpdateServiceAreaPricing,
  validateCalculateShippingPrice,
  validateFindByLocation
};
