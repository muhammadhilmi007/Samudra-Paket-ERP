/**
 * Employee Model
 * Defines the Employee entity for employee management
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define sub-schemas
const addressSchema = new Schema({
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  province: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    default: 'Indonesia',
    trim: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  }
});

const contactSchema = new Schema({
  type: {
    type: String,
    enum: ['PHONE', 'EMAIL', 'WHATSAPP', 'OTHER'],
    required: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  }
});

const emergencyContactSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  relationship: {
    type: String,
    required: true,
    trim: true
  },
  contacts: [contactSchema],
  address: addressSchema
});

const documentSchema = new Schema({
  type: {
    type: String,
    enum: ['KTP', 'NPWP', 'IJAZAH', 'SERTIFIKAT', 'SIM', 'PASSPORT', 'BPJS_KESEHATAN', 'BPJS_KETENAGAKERJAAN', 'CONTRACT', 'OTHER'],
    required: true
  },
  number: {
    type: String,
    required: true,
    trim: true
  },
  issuedBy: {
    type: String,
    trim: true
  },
  issuedDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  fileUrl: {
    type: String,
    trim: true
  },
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING'
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
});

const assignmentSchema = new Schema({
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  division: {
    type: Schema.Types.ObjectId,
    ref: 'Division',
    required: true
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  }
});

const statusHistorySchema = new Schema({
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED', 'SUSPENDED', 'PROBATION'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  reason: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  changedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const skillSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  proficiencyLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  }
});

const performanceEvaluationSchema = new Schema({
  evaluationDate: {
    type: Date,
    required: true
  },
  evaluationType: {
    type: String,
    enum: ['QUARTERLY', 'ANNUAL', 'PROBATION', 'PROJECT', 'OTHER'],
    required: true
  },
  evaluator: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  overallRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  strengths: [String],
  areasForImprovement: [String],
  goals: [String],
  notes: {
    type: String,
    trim: true
  },
  acknowledgement: {
    acknowledged: {
      type: Boolean,
      default: false
    },
    acknowledgedAt: {
      type: Date
    },
    comments: {
      type: String,
      trim: true
    }
  }
});

const trainingSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  provider: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['INTERNAL', 'EXTERNAL', 'ONLINE', 'CERTIFICATION', 'WORKSHOP', 'SEMINAR', 'OTHER'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['HOURS', 'DAYS', 'WEEKS', 'MONTHS'],
      default: 'HOURS'
    }
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PLANNED'
  },
  certificateUrl: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date
  },
  cost: {
    amount: {
      type: Number
    },
    currency: {
      type: String,
      default: 'IDR'
    }
  },
  notes: {
    type: String,
    trim: true
  }
});

const careerDevelopmentSchema = new Schema({
  targetPosition: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  targetDate: {
    type: Date,
    required: true
  },
  developmentPlan: {
    type: String,
    trim: true
  },
  requiredTrainings: [{
    type: Schema.Types.ObjectId,
    ref: 'Employee.trainings'
  }],
  requiredSkills: [{
    type: Schema.Types.ObjectId,
    ref: 'Employee.skills'
  }],
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  progressReviews: [{
    date: {
      type: Date,
      required: true
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  status: {
    type: String,
    enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PLANNED'
  },
  completionDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
});

const contractSchema = new Schema({
  type: {
    type: String,
    enum: ['PROBATION', 'FIXED_TERM', 'PERMANENT', 'OUTSOURCED', 'INTERNSHIP', 'OTHER'],
    required: true
  },
  number: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  fileUrl: {
    type: String,
    trim: true
  },
  terms: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED', 'RENEWED'],
    default: 'DRAFT'
  },
  terminationReason: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
});

// Main Employee Schema
const employeeSchema = new Schema({
  // Personal Information
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  placeOfBirth: {
    type: String,
    required: true,
    trim: true
  },
  nationality: {
    type: String,
    default: 'Indonesia',
    trim: true
  },
  maritalStatus: {
    type: String,
    enum: ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER'],
    required: true
  },
  religion: {
    type: String,
    enum: ['ISLAM', 'CHRISTIAN', 'CATHOLIC', 'HINDU', 'BUDDHIST', 'CONFUCIAN', 'OTHER'],
    required: true
  },
  
  // Contact Information
  addresses: [addressSchema],
  contacts: [contactSchema],
  emergencyContacts: [emergencyContactSchema],
  
  // Employment Information
  joinDate: {
    type: Date,
    required: true
  },
  employmentStatus: {
    type: String,
    enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'OUTSOURCED'],
    required: true
  },
  currentStatus: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED', 'SUSPENDED', 'PROBATION'],
    default: 'ACTIVE'
  },
  
  // Current Assignment
  currentBranch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  currentDivision: {
    type: Schema.Types.ObjectId,
    ref: 'Division',
    required: true
  },
  currentPosition: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  
  // User Account Association
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    sparse: true
  },
  
  // Financial Information
  bankName: {
    type: String,
    trim: true
  },
  bankAccountNumber: {
    type: String,
    trim: true
  },
  bankAccountName: {
    type: String,
    trim: true
  },
  taxIdentificationNumber: {
    type: String,
    trim: true
  },
  
  // Education
  education: [{
    level: {
      type: String,
      enum: ['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3', 'OTHER'],
      required: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    major: {
      type: String,
      trim: true
    },
    startYear: {
      type: Number,
      required: true
    },
    endYear: {
      type: Number,
      required: true
    },
    gpa: {
      type: Number
    },
    documentId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee.documents'
    }
  }],
  
  // Tracking Collections
  documents: [documentSchema],
  assignmentHistory: [assignmentSchema],
  statusHistory: [statusHistorySchema],
  skills: [skillSchema],
  performanceEvaluations: [performanceEvaluationSchema],
  trainings: [trainingSchema],
  careerDevelopment: [careerDevelopmentSchema],
  contracts: [contractSchema],
  
  // Metadata
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Virtual for age
employeeSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Virtual for years of service
employeeSchema.virtual('yearsOfService').get(function() {
  if (!this.joinDate) return null;
  const today = new Date();
  const joinDate = new Date(this.joinDate);
  let years = today.getFullYear() - joinDate.getFullYear();
  const monthDiff = today.getMonth() - joinDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < joinDate.getDate())) {
    years--;
  }
  return years;
});

// Pre-save middleware to set fullName
employeeSchema.pre('save', function(next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  
  // Update timestamps
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  
  next();
});

// Index for text search
employeeSchema.index({ 
  employeeId: 'text', 
  firstName: 'text', 
  lastName: 'text', 
  fullName: 'text'
});

// Geospatial index for addresses
employeeSchema.index({ 'addresses.coordinates': '2dsphere' });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
