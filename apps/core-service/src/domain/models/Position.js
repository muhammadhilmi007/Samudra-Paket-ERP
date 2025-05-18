/**
 * Position Model
 * Represents a position in the organizational structure
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const positionSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Position name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Position code is required'],
    trim: true,
    unique: true,
    uppercase: true
  },
  division: {
    type: Schema.Types.ObjectId,
    ref: 'Division',
    required: [true, 'Division is required']
  },
  description: {
    type: String,
    trim: true
  },
  responsibilities: [{
    type: String,
    trim: true
  }],
  reportTo: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    default: null
  },
  level: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVED'],
    default: 'ACTIVE'
  },
  requirements: {
    education: [{
      degree: {
        type: String,
        enum: ['HIGH_SCHOOL', 'DIPLOMA', 'BACHELOR', 'MASTER', 'DOCTORATE', 'OTHER'],
        default: 'BACHELOR'
      },
      field: {
        type: String,
        trim: true
      },
      isRequired: {
        type: Boolean,
        default: true
      }
    }],
    experience: [{
      years: {
        type: Number,
        min: 0
      },
      description: {
        type: String,
        trim: true
      },
      isRequired: {
        type: Boolean,
        default: true
      }
    }],
    skills: [{
      name: {
        type: String,
        trim: true
      },
      level: {
        type: String,
        enum: ['BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
        default: 'INTERMEDIATE'
      },
      isRequired: {
        type: Boolean,
        default: true
      }
    }],
    certifications: [{
      name: {
        type: String,
        trim: true
      },
      isRequired: {
        type: Boolean,
        default: false
      }
    }],
    physical: {
      type: String,
      trim: true,
      default: ''
    }
  },
  compensation: {
    salaryGrade: {
      type: String,
      trim: true
    },
    salaryRange: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'IDR'
      }
    },
    benefits: [{
      name: {
        type: String,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      value: {
        type: Schema.Types.Mixed
      }
    }],
    allowances: [{
      name: {
        type: String,
        trim: true
      },
      amount: {
        type: Number,
        default: 0
      },
      frequency: {
        type: String,
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ONE_TIME'],
        default: 'MONTHLY'
      }
    }],
    overtimeEligible: {
      type: Boolean,
      default: false
    },
    bonusEligible: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId
  }
}, {
  timestamps: true
});

// Create indexes
positionSchema.index({ code: 1 }, { unique: true });
positionSchema.index({ division: 1 });
positionSchema.index({ reportTo: 1 });
positionSchema.index({ status: 1 });
positionSchema.index({ 'compensation.salaryGrade': 1 });

// Pre-save middleware to validate reporting structure
positionSchema.pre('save', async function(next) {
  try {
    // If this position reports to another position
    if (this.reportTo) {
      // Check if the reportTo position exists
      const reportToPosition = await this.constructor.findById(this.reportTo);
      if (!reportToPosition) {
        throw new Error('Reporting position not found');
      }
      
      // Check for circular reporting relationship
      let currentPosition = reportToPosition;
      const visitedPositions = new Set([this._id.toString()]);
      
      while (currentPosition.reportTo) {
        const currentPositionId = currentPosition._id.toString();
        
        // If we've already visited this position, we have a circular reference
        if (visitedPositions.has(currentPositionId)) {
          throw new Error('Circular reporting relationship detected');
        }
        
        visitedPositions.add(currentPositionId);
        
        // Get the next position in the chain
        currentPosition = await this.constructor.findById(currentPosition.reportTo);
        if (!currentPosition) {
          break;
        }
      }
      
      // Set the level based on the reporting structure
      this.level = reportToPosition.level + 1;
    } else {
      // This is a top-level position
      this.level = 0;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to get all positions in a division
positionSchema.statics.findByDivision = function(divisionId) {
  return this.find({ division: divisionId });
};

// Static method to get all positions reporting to a position
positionSchema.statics.findReportingPositions = function(positionId) {
  return this.find({ reportTo: positionId });
};

// Static method to get position with its division
positionSchema.statics.findWithDivision = function(positionId) {
  return this.findById(positionId).populate('division');
};

// Static method to get position with its reporting position
positionSchema.statics.findWithReportTo = function(positionId) {
  return this.findById(positionId).populate('reportTo');
};

// Static method to get the reporting chain for a position
positionSchema.statics.getReportingChain = async function(positionId) {
  const chain = [];
  let currentPosition = await this.findById(positionId);
  
  if (!currentPosition) {
    return chain;
  }
  
  chain.push(currentPosition);
  
  while (currentPosition.reportTo) {
    currentPosition = await this.findById(currentPosition.reportTo);
    if (!currentPosition) {
      break;
    }
    
    chain.push(currentPosition);
  }
  
  return chain;
};

// Static method to get organization chart
positionSchema.statics.getOrganizationChart = async function() {
  // Get all positions
  const positions = await this.find({}).sort({ level: 1, code: 1 });
  
  // Create a map of positions by ID for quick lookup
  const positionsMap = {};
  positions.forEach(position => {
    positionsMap[position._id.toString()] = {
      ...position.toObject(),
      directReports: []
    };
  });
  
  // Build the hierarchy
  const chart = [];
  positions.forEach(position => {
    const positionId = position._id.toString();
    
    // If this position reports to another position, add it to the reportTo's directReports
    if (position.reportTo) {
      const reportToId = position.reportTo.toString();
      if (positionsMap[reportToId]) {
        positionsMap[reportToId].directReports.push(positionsMap[positionId]);
      }
    } else {
      // This is a top-level position, add it to the chart
      chart.push(positionsMap[positionId]);
    }
  });
  
  return chart;
};

const Position = mongoose.model('Position', positionSchema);

module.exports = Position;
