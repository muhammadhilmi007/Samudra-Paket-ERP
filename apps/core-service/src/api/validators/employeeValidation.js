/**
 * Employee Validation
 * Validation schemas for employee-related requests
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

// Custom validation for phone numbers (Indonesian format)
const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;

// Create employee validation schema
const createEmployeeSchema = Joi.object({
  // Personal Information
  employeeId: Joi.string().required().trim().uppercase().min(3).max(20)
    .pattern(/^[A-Z0-9-_]+$/)
    .message('Employee ID must contain only uppercase letters, numbers, hyphens, and underscores'),
  firstName: Joi.string().required().trim().min(2).max(50),
  lastName: Joi.string().required().trim().min(2).max(50),
  gender: Joi.string().required().valid('MALE', 'FEMALE', 'OTHER'),
  dateOfBirth: Joi.date().required().max('now').iso(),
  placeOfBirth: Joi.string().required().trim().min(2).max(100),
  nationality: Joi.string().trim().min(2).max(50).default('Indonesia'),
  maritalStatus: Joi.string().required().valid('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER'),
  religion: Joi.string().required().valid('ISLAM', 'CHRISTIAN', 'CATHOLIC', 'HINDU', 'BUDDHIST', 'CONFUCIAN', 'OTHER'),
  
  // Contact Information
  addresses: Joi.array().items(
    Joi.object({
      street: Joi.string().required().trim().min(3).max(200),
      city: Joi.string().required().trim().min(2).max(100),
      district: Joi.string().required().trim().min(2).max(100),
      province: Joi.string().required().trim().min(2).max(100),
      postalCode: Joi.string().required().trim().pattern(/^[0-9]{5}$/).message('Postal code must be 5 digits'),
      country: Joi.string().trim().min(2).max(50).default('Indonesia'),
      isPrimary: Joi.boolean().default(false),
      coordinates: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: Joi.array().length(2).items(Joi.number()).default([0, 0])
      }).default({ type: 'Point', coordinates: [0, 0] })
    })
  ).min(1).message('At least one address is required'),
  
  contacts: Joi.array().items(
    Joi.object({
      type: Joi.string().required().valid('PHONE', 'EMAIL', 'WHATSAPP', 'OTHER'),
      value: Joi.string().required().trim().min(5).max(100)
        .when('type', {
          is: 'PHONE',
          then: Joi.string().pattern(phoneRegex).message('Invalid phone number format')
        })
        .when('type', {
          is: 'EMAIL',
          then: Joi.string().email().message('Invalid email format')
        })
        .when('type', {
          is: 'WHATSAPP',
          then: Joi.string().pattern(phoneRegex).message('Invalid WhatsApp number format')
        }),
      isPrimary: Joi.boolean().default(false)
    })
  ).min(1).message('At least one contact is required'),
  
  emergencyContacts: Joi.array().items(
    Joi.object({
      name: Joi.string().required().trim().min(2).max(100),
      relationship: Joi.string().required().trim().min(2).max(50),
      contacts: Joi.array().items(
        Joi.object({
          type: Joi.string().required().valid('PHONE', 'EMAIL', 'WHATSAPP', 'OTHER'),
          value: Joi.string().required().trim().min(5).max(100)
            .when('type', {
              is: 'PHONE',
              then: Joi.string().pattern(phoneRegex).message('Invalid phone number format')
            })
            .when('type', {
              is: 'EMAIL',
              then: Joi.string().email().message('Invalid email format')
            })
            .when('type', {
              is: 'WHATSAPP',
              then: Joi.string().pattern(phoneRegex).message('Invalid WhatsApp number format')
            }),
          isPrimary: Joi.boolean().default(false)
        })
      ).min(1).message('At least one contact is required for emergency contact'),
      address: Joi.object({
        street: Joi.string().required().trim().min(3).max(200),
        city: Joi.string().required().trim().min(2).max(100),
        district: Joi.string().required().trim().min(2).max(100),
        province: Joi.string().required().trim().min(2).max(100),
        postalCode: Joi.string().required().trim().pattern(/^[0-9]{5}$/).message('Postal code must be 5 digits'),
        country: Joi.string().trim().min(2).max(50).default('Indonesia'),
        isPrimary: Joi.boolean().default(false),
        coordinates: Joi.object({
          type: Joi.string().valid('Point').default('Point'),
          coordinates: Joi.array().length(2).items(Joi.number()).default([0, 0])
        }).default({ type: 'Point', coordinates: [0, 0] })
      }).required()
    })
  ).min(1).message('At least one emergency contact is required'),
  
  // Employment Information
  joinDate: Joi.date().required().iso(),
  employmentStatus: Joi.string().required().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'OUTSOURCED'),
  currentStatus: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED', 'SUSPENDED', 'PROBATION').default('ACTIVE'),
  
  // Current Assignment
  currentBranch: Joi.string().required().custom(validateObjectId, 'valid ObjectId'),
  currentDivision: Joi.string().required().custom(validateObjectId, 'valid ObjectId'),
  currentPosition: Joi.string().required().custom(validateObjectId, 'valid ObjectId'),
  
  // User Account Association
  userId: Joi.string().custom(validateObjectId, 'valid ObjectId').allow(null),
  
  // Financial Information
  bankName: Joi.string().trim().min(2).max(100).allow('', null),
  bankAccountNumber: Joi.string().trim().min(5).max(50).allow('', null),
  bankAccountName: Joi.string().trim().min(2).max(100).allow('', null),
  taxIdentificationNumber: Joi.string().trim().min(5).max(50).allow('', null),
  
  // Education
  education: Joi.array().items(
    Joi.object({
      level: Joi.string().required().valid('SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3', 'OTHER'),
      institution: Joi.string().required().trim().min(2).max(200),
      major: Joi.string().trim().min(2).max(200).allow('', null),
      startYear: Joi.number().required().integer().min(1950).max(new Date().getFullYear()),
      endYear: Joi.number().required().integer().min(1950).max(new Date().getFullYear() + 10),
      gpa: Joi.number().min(0).max(4).allow(null),
      documentId: Joi.string().custom(validateObjectId, 'valid ObjectId').allow(null)
    })
  ),
  
  // Tracking Collections
  documents: Joi.array().items(
    Joi.object({
      type: Joi.string().required().valid('KTP', 'NPWP', 'IJAZAH', 'SERTIFIKAT', 'SIM', 'PASSPORT', 'BPJS_KESEHATAN', 'BPJS_KETENAGAKERJAAN', 'CONTRACT', 'OTHER'),
      number: Joi.string().required().trim().min(2).max(100),
      issuedBy: Joi.string().trim().min(2).max(200).allow('', null),
      issuedDate: Joi.date().iso().allow(null),
      expiryDate: Joi.date().iso().allow(null),
      fileUrl: Joi.string().uri().allow('', null),
      verificationStatus: Joi.string().valid('PENDING', 'VERIFIED', 'REJECTED').default('PENDING'),
      notes: Joi.string().trim().max(500).allow('', null)
    })
  ),
  
  // Metadata
  metadata: Joi.object().pattern(
    Joi.string(),
    Joi.any()
  )
});

// Update employee validation schema
const updateEmployeeSchema = Joi.object({
  // Personal Information
  firstName: Joi.string().trim().min(2).max(50),
  lastName: Joi.string().trim().min(2).max(50),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
  dateOfBirth: Joi.date().max('now').iso(),
  placeOfBirth: Joi.string().trim().min(2).max(100),
  nationality: Joi.string().trim().min(2).max(50),
  maritalStatus: Joi.string().valid('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER'),
  religion: Joi.string().valid('ISLAM', 'CHRISTIAN', 'CATHOLIC', 'HINDU', 'BUDDHIST', 'CONFUCIAN', 'OTHER'),
  
  // Contact Information
  addresses: Joi.array().items(
    Joi.object({
      street: Joi.string().required().trim().min(3).max(200),
      city: Joi.string().required().trim().min(2).max(100),
      district: Joi.string().required().trim().min(2).max(100),
      province: Joi.string().required().trim().min(2).max(100),
      postalCode: Joi.string().required().trim().pattern(/^[0-9]{5}$/).message('Postal code must be 5 digits'),
      country: Joi.string().trim().min(2).max(50).default('Indonesia'),
      isPrimary: Joi.boolean().default(false),
      coordinates: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: Joi.array().length(2).items(Joi.number()).default([0, 0])
      }).default({ type: 'Point', coordinates: [0, 0] })
    })
  ),
  
  contacts: Joi.array().items(
    Joi.object({
      type: Joi.string().required().valid('PHONE', 'EMAIL', 'WHATSAPP', 'OTHER'),
      value: Joi.string().required().trim().min(5).max(100)
        .when('type', {
          is: 'PHONE',
          then: Joi.string().pattern(phoneRegex).message('Invalid phone number format')
        })
        .when('type', {
          is: 'EMAIL',
          then: Joi.string().email().message('Invalid email format')
        })
        .when('type', {
          is: 'WHATSAPP',
          then: Joi.string().pattern(phoneRegex).message('Invalid WhatsApp number format')
        }),
      isPrimary: Joi.boolean().default(false)
    })
  ),
  
  emergencyContacts: Joi.array().items(
    Joi.object({
      name: Joi.string().required().trim().min(2).max(100),
      relationship: Joi.string().required().trim().min(2).max(50),
      contacts: Joi.array().items(
        Joi.object({
          type: Joi.string().required().valid('PHONE', 'EMAIL', 'WHATSAPP', 'OTHER'),
          value: Joi.string().required().trim().min(5).max(100)
            .when('type', {
              is: 'PHONE',
              then: Joi.string().pattern(phoneRegex).message('Invalid phone number format')
            })
            .when('type', {
              is: 'EMAIL',
              then: Joi.string().email().message('Invalid email format')
            })
            .when('type', {
              is: 'WHATSAPP',
              then: Joi.string().pattern(phoneRegex).message('Invalid WhatsApp number format')
            }),
          isPrimary: Joi.boolean().default(false)
        })
      ).min(1).message('At least one contact is required for emergency contact'),
      address: Joi.object({
        street: Joi.string().required().trim().min(3).max(200),
        city: Joi.string().required().trim().min(2).max(100),
        district: Joi.string().required().trim().min(2).max(100),
        province: Joi.string().required().trim().min(2).max(100),
        postalCode: Joi.string().required().trim().pattern(/^[0-9]{5}$/).message('Postal code must be 5 digits'),
        country: Joi.string().trim().min(2).max(50).default('Indonesia'),
        isPrimary: Joi.boolean().default(false),
        coordinates: Joi.object({
          type: Joi.string().valid('Point').default('Point'),
          coordinates: Joi.array().length(2).items(Joi.number()).default([0, 0])
        }).default({ type: 'Point', coordinates: [0, 0] })
      }).required()
    })
  ),
  
  // Employment Information
  joinDate: Joi.date().iso(),
  employmentStatus: Joi.string().valid('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'OUTSOURCED'),
  
  // Financial Information
  bankName: Joi.string().trim().min(2).max(100).allow('', null),
  bankAccountNumber: Joi.string().trim().min(5).max(50).allow('', null),
  bankAccountName: Joi.string().trim().min(2).max(100).allow('', null),
  taxIdentificationNumber: Joi.string().trim().min(5).max(50).allow('', null),
  
  // Education
  education: Joi.array().items(
    Joi.object({
      level: Joi.string().required().valid('SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3', 'OTHER'),
      institution: Joi.string().required().trim().min(2).max(200),
      major: Joi.string().trim().min(2).max(200).allow('', null),
      startYear: Joi.number().required().integer().min(1950).max(new Date().getFullYear()),
      endYear: Joi.number().required().integer().min(1950).max(new Date().getFullYear() + 10),
      gpa: Joi.number().min(0).max(4).allow(null),
      documentId: Joi.string().custom(validateObjectId, 'valid ObjectId').allow(null)
    })
  ),
  
  // Metadata
  metadata: Joi.object().pattern(
    Joi.string(),
    Joi.any()
  )
});

// Document validation schema
const documentSchema = Joi.object({
  type: Joi.string().required().valid('KTP', 'NPWP', 'IJAZAH', 'SERTIFIKAT', 'SIM', 'PASSPORT', 'BPJS_KESEHATAN', 'BPJS_KETENAGAKERJAAN', 'CONTRACT', 'OTHER'),
  number: Joi.string().required().trim().min(2).max(100),
  issuedBy: Joi.string().trim().min(2).max(200).allow('', null),
  issuedDate: Joi.date().iso().allow(null),
  expiryDate: Joi.date().iso().allow(null),
  fileUrl: Joi.string().uri().allow('', null),
  notes: Joi.string().trim().max(500).allow('', null)
});

// Document verification schema
const documentVerificationSchema = Joi.object({
  status: Joi.string().required().valid('VERIFIED', 'REJECTED'),
  notes: Joi.string().trim().max(500).allow('', null)
});

// Assignment schema
const assignmentSchema = Joi.object({
  branch: Joi.string().required().custom(validateObjectId, 'valid ObjectId'),
  division: Joi.string().required().custom(validateObjectId, 'valid ObjectId'),
  position: Joi.string().required().custom(validateObjectId, 'valid ObjectId'),
  startDate: Joi.date().required().iso(),
  endDate: Joi.date().iso().allow(null),
  notes: Joi.string().trim().max(500).allow('', null)
});

// Status update schema
const statusUpdateSchema = Joi.object({
  status: Joi.string().required().valid('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED', 'SUSPENDED', 'PROBATION'),
  startDate: Joi.date().required().iso(),
  endDate: Joi.date().iso().allow(null),
  reason: Joi.string().trim().min(2).max(200).allow('', null),
  notes: Joi.string().trim().max(500).allow('', null)
});

// User account linking schema
const userLinkSchema = Joi.object({
  userId: Joi.string().required().custom(validateObjectId, 'valid ObjectId')
});

// Skill schema
const skillSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  category: Joi.string().trim().min(2).max(100).allow('', null),
  proficiencyLevel: Joi.number().integer().min(1).max(5).default(1),
  yearsOfExperience: Joi.number().min(0).default(0),
  notes: Joi.string().trim().max(500).allow('', null)
});

// Training schema
const trainingSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(200),
  provider: Joi.string().trim().min(2).max(200).allow('', null),
  type: Joi.string().required().valid('INTERNAL', 'EXTERNAL', 'ONLINE', 'CERTIFICATION', 'WORKSHOP', 'SEMINAR', 'OTHER'),
  startDate: Joi.date().required().iso(),
  endDate: Joi.date().required().iso(),
  duration: Joi.object({
    value: Joi.number().required().min(1),
    unit: Joi.string().valid('HOURS', 'DAYS', 'WEEKS', 'MONTHS').default('HOURS')
  }).required(),
  description: Joi.string().trim().max(1000).allow('', null),
  status: Joi.string().valid('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED').default('PLANNED'),
  certificateUrl: Joi.string().uri().allow('', null),
  expiryDate: Joi.date().iso().allow(null),
  cost: Joi.object({
    amount: Joi.number().min(0).allow(null),
    currency: Joi.string().default('IDR')
  }).allow(null),
  notes: Joi.string().trim().max(500).allow('', null)
});

// Performance evaluation schema
const performanceEvaluationSchema = Joi.object({
  evaluationDate: Joi.date().required().iso(),
  evaluationType: Joi.string().required().valid('QUARTERLY', 'ANNUAL', 'PROBATION', 'PROJECT', 'OTHER'),
  evaluator: Joi.string().required().custom(validateObjectId, 'valid ObjectId'),
  position: Joi.string().required().custom(validateObjectId, 'valid ObjectId'),
  overallRating: Joi.number().required().min(1).max(5),
  strengths: Joi.array().items(Joi.string().trim().min(2).max(200)),
  areasForImprovement: Joi.array().items(Joi.string().trim().min(2).max(200)),
  goals: Joi.array().items(Joi.string().trim().min(2).max(200)),
  notes: Joi.string().trim().max(1000).allow('', null)
});

// Career development schema
const careerDevelopmentSchema = Joi.object({
  targetPosition: Joi.string().required().custom(validateObjectId, 'valid ObjectId'),
  startDate: Joi.date().required().iso(),
  targetDate: Joi.date().required().iso(),
  developmentPlan: Joi.string().trim().min(10).max(2000).allow('', null),
  requiredTrainings: Joi.array().items(Joi.string().custom(validateObjectId, 'valid ObjectId')),
  requiredSkills: Joi.array().items(Joi.string().custom(validateObjectId, 'valid ObjectId')),
  mentor: Joi.string().custom(validateObjectId, 'valid ObjectId').allow(null),
  status: Joi.string().valid('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED').default('PLANNED'),
  notes: Joi.string().trim().max(500).allow('', null)
});

// Contract schema
const contractSchema = Joi.object({
  type: Joi.string().required().valid('PROBATION', 'FIXED_TERM', 'PERMANENT', 'OUTSOURCED', 'INTERNSHIP', 'OTHER'),
  number: Joi.string().required().trim().min(2).max(100),
  startDate: Joi.date().required().iso(),
  endDate: Joi.date().iso().allow(null),
  position: Joi.string().required().custom(validateObjectId, 'valid ObjectId'),
  fileUrl: Joi.string().uri().allow('', null),
  terms: Joi.string().trim().min(10).max(5000).allow('', null),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED', 'RENEWED').default('DRAFT'),
  terminationReason: Joi.string().trim().min(2).max(500).allow('', null),
  notes: Joi.string().trim().max(500).allow('', null)
});

module.exports = {
  employeeValidation: {
    createEmployeeSchema,
    updateEmployeeSchema,
    documentSchema,
    documentVerificationSchema,
    assignmentSchema,
    statusUpdateSchema,
    userLinkSchema,
    skillSchema,
    trainingSchema,
    performanceEvaluationSchema,
    careerDevelopmentSchema,
    contractSchema
  }
};
