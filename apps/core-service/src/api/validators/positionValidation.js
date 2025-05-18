/**
 * Position Validation
 * Validation schemas for position API endpoints
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

// Create position validation schema
const createPosition = {
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
    division: Joi.string().custom(validateObjectId).required()
      .messages({
        'string.base': 'Division must be a string',
        'any.invalid': 'Division must be a valid ID',
        'any.required': 'Division is required'
      }),
    description: Joi.string().allow('').trim().max(500)
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description cannot exceed 500 characters'
      }),
    responsibilities: Joi.array().items(Joi.string().trim())
      .messages({
        'array.base': 'Responsibilities must be an array'
      }),
    reportTo: Joi.string().custom(validateObjectId).allow(null)
      .messages({
        'string.base': 'ReportTo must be a string',
        'any.invalid': 'ReportTo must be a valid ID'
      }),
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVED').default('ACTIVE')
      .messages({
        'string.base': 'Status must be a string',
        'any.only': 'Status must be one of: ACTIVE, INACTIVE, PENDING, ARCHIVED'
      }),
    requirements: Joi.object({
      education: Joi.array().items(Joi.object({
        degree: Joi.string().valid('HIGH_SCHOOL', 'DIPLOMA', 'BACHELOR', 'MASTER', 'DOCTORATE', 'OTHER'),
        field: Joi.string().allow(''),
        isRequired: Joi.boolean().default(true)
      })),
      experience: Joi.array().items(Joi.object({
        years: Joi.number().min(0),
        description: Joi.string().allow(''),
        isRequired: Joi.boolean().default(true)
      })),
      skills: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        level: Joi.string().valid('BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'),
        isRequired: Joi.boolean().default(true)
      })),
      certifications: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        isRequired: Joi.boolean().default(false)
      })),
      physical: Joi.string().allow('')
    }).optional(),
    compensation: Joi.object({
      salaryGrade: Joi.string().allow(''),
      salaryRange: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0),
        currency: Joi.string().default('IDR')
      }),
      benefits: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(''),
        value: Joi.any()
      })),
      allowances: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        amount: Joi.number().min(0),
        frequency: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ONE_TIME')
      })),
      overtimeEligible: Joi.boolean().default(false),
      bonusEligible: Joi.boolean().default(false)
    }).optional(),
    metadata: Joi.object().pattern(Joi.string(), Joi.any()).optional()
  })
};

// Update position validation schema
const updatePosition = {
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
    division: Joi.string().custom(validateObjectId)
      .messages({
        'string.base': 'Division must be a string',
        'any.invalid': 'Division must be a valid ID'
      }),
    description: Joi.string().allow('').trim().max(500)
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description cannot exceed 500 characters'
      }),
    responsibilities: Joi.array().items(Joi.string().trim())
      .messages({
        'array.base': 'Responsibilities must be an array'
      }),
    reportTo: Joi.string().custom(validateObjectId).allow(null)
      .messages({
        'string.base': 'ReportTo must be a string',
        'any.invalid': 'ReportTo must be a valid ID'
      }),
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVED')
      .messages({
        'string.base': 'Status must be a string',
        'any.only': 'Status must be one of: ACTIVE, INACTIVE, PENDING, ARCHIVED'
      }),
    requirements: Joi.object({
      education: Joi.array().items(Joi.object({
        degree: Joi.string().valid('HIGH_SCHOOL', 'DIPLOMA', 'BACHELOR', 'MASTER', 'DOCTORATE', 'OTHER'),
        field: Joi.string().allow(''),
        isRequired: Joi.boolean()
      })),
      experience: Joi.array().items(Joi.object({
        years: Joi.number().min(0),
        description: Joi.string().allow(''),
        isRequired: Joi.boolean()
      })),
      skills: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        level: Joi.string().valid('BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'),
        isRequired: Joi.boolean()
      })),
      certifications: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        isRequired: Joi.boolean()
      })),
      physical: Joi.string().allow('')
    }).optional(),
    compensation: Joi.object({
      salaryGrade: Joi.string().allow(''),
      salaryRange: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0),
        currency: Joi.string()
      }),
      benefits: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(''),
        value: Joi.any()
      })),
      allowances: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        amount: Joi.number().min(0),
        frequency: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ONE_TIME')
      })),
      overtimeEligible: Joi.boolean(),
      bonusEligible: Joi.boolean()
    }).optional(),
    metadata: Joi.object().pattern(Joi.string(), Joi.any()).optional()
  }).min(1)
    .messages({
      'object.min': 'At least one field must be provided for update'
    })
};

// Change position status validation schema
const changePositionStatus = {
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

// Update position requirements validation schema
const updatePositionRequirements = {
  params: Joi.object({
    id: Joi.string().custom(validateObjectId).required()
      .messages({
        'string.base': 'ID must be a string',
        'any.invalid': 'ID must be a valid ID',
        'any.required': 'ID is required'
      })
  }),
  body: Joi.object({
    education: Joi.array().items(Joi.object({
      degree: Joi.string().valid('HIGH_SCHOOL', 'DIPLOMA', 'BACHELOR', 'MASTER', 'DOCTORATE', 'OTHER'),
      field: Joi.string().allow(''),
      isRequired: Joi.boolean().default(true)
    })),
    experience: Joi.array().items(Joi.object({
      years: Joi.number().min(0),
      description: Joi.string().allow(''),
      isRequired: Joi.boolean().default(true)
    })),
    skills: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      level: Joi.string().valid('BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'),
      isRequired: Joi.boolean().default(true)
    })),
    certifications: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      isRequired: Joi.boolean().default(false)
    })),
    physical: Joi.string().allow('')
  }).min(1)
    .messages({
      'object.min': 'At least one requirements field must be provided for update'
    })
};

// Update position compensation validation schema
const updatePositionCompensation = {
  params: Joi.object({
    id: Joi.string().custom(validateObjectId).required()
      .messages({
        'string.base': 'ID must be a string',
        'any.invalid': 'ID must be a valid ID',
        'any.required': 'ID is required'
      })
  }),
  body: Joi.object({
    salaryGrade: Joi.string().allow(''),
    salaryRange: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
      currency: Joi.string().default('IDR')
    }),
    benefits: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      description: Joi.string().allow(''),
      value: Joi.any()
    })),
    allowances: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      amount: Joi.number().min(0),
      frequency: Joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ONE_TIME')
    })),
    overtimeEligible: Joi.boolean(),
    bonusEligible: Joi.boolean()
  }).min(1)
    .messages({
      'object.min': 'At least one compensation field must be provided for update'
    })
};

// Update position responsibilities validation schema
const updatePositionResponsibilities = {
  params: Joi.object({
    id: Joi.string().custom(validateObjectId).required()
      .messages({
        'string.base': 'ID must be a string',
        'any.invalid': 'ID must be a valid ID',
        'any.required': 'ID is required'
      })
  }),
  body: Joi.array().items(Joi.string().trim()).min(1).required()
    .messages({
      'array.base': 'Responsibilities must be an array',
      'array.min': 'At least one responsibility must be provided',
      'any.required': 'Responsibilities are required'
    })
};

// Transfer position to division validation schema
const transferPositionToDivision = {
  params: Joi.object({
    id: Joi.string().custom(validateObjectId).required()
      .messages({
        'string.base': 'ID must be a string',
        'any.invalid': 'ID must be a valid ID',
        'any.required': 'ID is required'
      })
  }),
  body: Joi.object({
    divisionId: Joi.string().custom(validateObjectId).required()
      .messages({
        'string.base': 'Division ID must be a string',
        'any.invalid': 'Division ID must be a valid ID',
        'any.required': 'Division ID is required'
      })
  })
};

module.exports = {
  createPosition,
  updatePosition,
  changePositionStatus,
  updatePositionRequirements,
  updatePositionCompensation,
  updatePositionResponsibilities,
  transferPositionToDivision
};
