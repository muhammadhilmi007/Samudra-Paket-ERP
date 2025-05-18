/**
 * Division and Position Seeder
 * Populates the database with initial division and position data
 */

const { Division, Position } = require('../../domain/models');
const { logger } = require('../../utils');
const mongoose = require('mongoose');

// Sample division data
const divisionData = [
  {
    name: 'Executive Office',
    code: 'EXO',
    description: 'Executive leadership and management',
    level: 0,
    path: 'EXO',
    status: 'ACTIVE',
    budget: {
      annual: 1000000000,
      spent: 0,
      remaining: 1000000000,
      currency: 'IDR',
      fiscalYear: new Date().getFullYear()
    }
  },
  {
    name: 'Operations',
    code: 'OPS',
    description: 'Manages all operational activities including pickup, delivery, and sorting',
    parent: null, // Will be set to Executive Office
    level: 1,
    path: 'EXO.OPS',
    status: 'ACTIVE',
    budget: {
      annual: 500000000,
      spent: 0,
      remaining: 500000000,
      currency: 'IDR',
      fiscalYear: new Date().getFullYear()
    }
  },
  {
    name: 'Finance',
    code: 'FIN',
    description: 'Manages financial operations, accounting, and reporting',
    parent: null, // Will be set to Executive Office
    level: 1,
    path: 'EXO.FIN',
    status: 'ACTIVE',
    budget: {
      annual: 300000000,
      spent: 0,
      remaining: 300000000,
      currency: 'IDR',
      fiscalYear: new Date().getFullYear()
    }
  },
  {
    name: 'Human Resources',
    code: 'HR',
    description: 'Manages recruitment, employee relations, and development',
    parent: null, // Will be set to Executive Office
    level: 1,
    path: 'EXO.HR',
    status: 'ACTIVE',
    budget: {
      annual: 200000000,
      spent: 0,
      remaining: 200000000,
      currency: 'IDR',
      fiscalYear: new Date().getFullYear()
    }
  },
  {
    name: 'Information Technology',
    code: 'IT',
    description: 'Manages IT infrastructure, software development, and support',
    parent: null, // Will be set to Executive Office
    level: 1,
    path: 'EXO.IT',
    status: 'ACTIVE',
    budget: {
      annual: 250000000,
      spent: 0,
      remaining: 250000000,
      currency: 'IDR',
      fiscalYear: new Date().getFullYear()
    }
  },
  {
    name: 'Pickup Operations',
    code: 'PICKUP',
    description: 'Manages pickup operations and courier management',
    parent: null, // Will be set to Operations
    level: 2,
    path: 'EXO.OPS.PICKUP',
    status: 'ACTIVE',
    budget: {
      annual: 150000000,
      spent: 0,
      remaining: 150000000,
      currency: 'IDR',
      fiscalYear: new Date().getFullYear()
    }
  },
  {
    name: 'Delivery Operations',
    code: 'DELIVERY',
    description: 'Manages delivery operations and driver management',
    parent: null, // Will be set to Operations
    level: 2,
    path: 'EXO.OPS.DELIVERY',
    status: 'ACTIVE',
    budget: {
      annual: 150000000,
      spent: 0,
      remaining: 150000000,
      currency: 'IDR',
      fiscalYear: new Date().getFullYear()
    }
  },
  {
    name: 'Warehouse Operations',
    code: 'WAREHOUSE',
    description: 'Manages warehouse operations, sorting, and inventory',
    parent: null, // Will be set to Operations
    level: 2,
    path: 'EXO.OPS.WAREHOUSE',
    status: 'ACTIVE',
    budget: {
      annual: 120000000,
      spent: 0,
      remaining: 120000000,
      currency: 'IDR',
      fiscalYear: new Date().getFullYear()
    }
  }
];

// Sample position data
const positionData = [
  {
    name: 'Chief Executive Officer',
    code: 'CEO',
    description: 'Leads the company and makes strategic decisions',
    responsibilities: [
      'Develop and execute company strategy',
      'Oversee all operations and business activities',
      'Report to the board of directors',
      'Lead the executive team'
    ],
    reportTo: null,
    level: 0,
    status: 'ACTIVE',
    requirements: {
      education: [{
        degree: 'MASTER',
        field: 'Business Administration or related field',
        isRequired: true
      }],
      experience: [{
        years: 10,
        description: 'Executive leadership experience',
        isRequired: true
      }],
      skills: [{
        name: 'Strategic Planning',
        level: 'EXPERT',
        isRequired: true
      }, {
        name: 'Leadership',
        level: 'EXPERT',
        isRequired: true
      }]
    },
    compensation: {
      salaryGrade: 'E1',
      salaryRange: {
        min: 50000000,
        max: 100000000,
        currency: 'IDR'
      },
      overtimeEligible: false,
      bonusEligible: true
    }
  },
  {
    name: 'Chief Operations Officer',
    code: 'COO',
    description: 'Oversees all operational activities',
    responsibilities: [
      'Oversee day-to-day operations',
      'Optimize operational processes',
      'Manage operational budgets',
      'Ensure operational excellence'
    ],
    reportTo: null, // Will be set to CEO
    level: 1,
    status: 'ACTIVE',
    requirements: {
      education: [{
        degree: 'MASTER',
        field: 'Business, Operations Management, or related field',
        isRequired: true
      }],
      experience: [{
        years: 8,
        description: 'Operations management experience',
        isRequired: true
      }],
      skills: [{
        name: 'Operations Management',
        level: 'EXPERT',
        isRequired: true
      }, {
        name: 'Process Optimization',
        level: 'EXPERT',
        isRequired: true
      }]
    },
    compensation: {
      salaryGrade: 'E2',
      salaryRange: {
        min: 40000000,
        max: 80000000,
        currency: 'IDR'
      },
      overtimeEligible: false,
      bonusEligible: true
    }
  },
  {
    name: 'Chief Financial Officer',
    code: 'CFO',
    description: 'Oversees all financial activities',
    responsibilities: [
      'Manage financial planning and strategy',
      'Oversee accounting and financial reporting',
      'Manage financial risks',
      'Ensure compliance with financial regulations'
    ],
    reportTo: null, // Will be set to CEO
    level: 1,
    status: 'ACTIVE',
    requirements: {
      education: [{
        degree: 'MASTER',
        field: 'Finance, Accounting, or related field',
        isRequired: true
      }],
      experience: [{
        years: 8,
        description: 'Financial management experience',
        isRequired: true
      }],
      skills: [{
        name: 'Financial Planning',
        level: 'EXPERT',
        isRequired: true
      }, {
        name: 'Financial Analysis',
        level: 'EXPERT',
        isRequired: true
      }]
    },
    compensation: {
      salaryGrade: 'E2',
      salaryRange: {
        min: 40000000,
        max: 80000000,
        currency: 'IDR'
      },
      overtimeEligible: false,
      bonusEligible: true
    }
  },
  {
    name: 'Human Resources Director',
    code: 'HRD',
    description: 'Leads the human resources department',
    responsibilities: [
      'Develop HR strategies and initiatives',
      'Oversee recruitment and employee relations',
      'Manage HR policies and procedures',
      'Ensure compliance with labor laws'
    ],
    reportTo: null, // Will be set to CEO
    level: 1,
    status: 'ACTIVE',
    requirements: {
      education: [{
        degree: 'MASTER',
        field: 'Human Resources, Business, or related field',
        isRequired: true
      }],
      experience: [{
        years: 8,
        description: 'HR management experience',
        isRequired: true
      }],
      skills: [{
        name: 'HR Management',
        level: 'EXPERT',
        isRequired: true
      }, {
        name: 'Employee Relations',
        level: 'EXPERT',
        isRequired: true
      }]
    },
    compensation: {
      salaryGrade: 'E2',
      salaryRange: {
        min: 35000000,
        max: 70000000,
        currency: 'IDR'
      },
      overtimeEligible: false,
      bonusEligible: true
    }
  },
  {
    name: 'IT Director',
    code: 'ITD',
    description: 'Leads the information technology department',
    responsibilities: [
      'Develop IT strategies and initiatives',
      'Oversee IT infrastructure and systems',
      'Manage IT projects and resources',
      'Ensure IT security and compliance'
    ],
    reportTo: null, // Will be set to CEO
    level: 1,
    status: 'ACTIVE',
    requirements: {
      education: [{
        degree: 'MASTER',
        field: 'Computer Science, Information Technology, or related field',
        isRequired: true
      }],
      experience: [{
        years: 8,
        description: 'IT management experience',
        isRequired: true
      }],
      skills: [{
        name: 'IT Management',
        level: 'EXPERT',
        isRequired: true
      }, {
        name: 'IT Strategy',
        level: 'EXPERT',
        isRequired: true
      }]
    },
    compensation: {
      salaryGrade: 'E2',
      salaryRange: {
        min: 38000000,
        max: 75000000,
        currency: 'IDR'
      },
      overtimeEligible: false,
      bonusEligible: true
    }
  },
  {
    name: 'Pickup Operations Manager',
    code: 'POM',
    description: 'Manages pickup operations',
    responsibilities: [
      'Oversee pickup operations',
      'Manage courier teams',
      'Optimize pickup routes',
      'Ensure pickup service quality'
    ],
    reportTo: null, // Will be set to COO
    level: 2,
    status: 'ACTIVE',
    requirements: {
      education: [{
        degree: 'BACHELOR',
        field: 'Business, Logistics, or related field',
        isRequired: true
      }],
      experience: [{
        years: 5,
        description: 'Logistics or operations management experience',
        isRequired: true
      }],
      skills: [{
        name: 'Operations Management',
        level: 'ADVANCED',
        isRequired: true
      }, {
        name: 'Team Leadership',
        level: 'ADVANCED',
        isRequired: true
      }]
    },
    compensation: {
      salaryGrade: 'M1',
      salaryRange: {
        min: 20000000,
        max: 35000000,
        currency: 'IDR'
      },
      overtimeEligible: false,
      bonusEligible: true
    }
  },
  {
    name: 'Delivery Operations Manager',
    code: 'DOM',
    description: 'Manages delivery operations',
    responsibilities: [
      'Oversee delivery operations',
      'Manage driver teams',
      'Optimize delivery routes',
      'Ensure delivery service quality'
    ],
    reportTo: null, // Will be set to COO
    level: 2,
    status: 'ACTIVE',
    requirements: {
      education: [{
        degree: 'BACHELOR',
        field: 'Business, Logistics, or related field',
        isRequired: true
      }],
      experience: [{
        years: 5,
        description: 'Logistics or operations management experience',
        isRequired: true
      }],
      skills: [{
        name: 'Operations Management',
        level: 'ADVANCED',
        isRequired: true
      }, {
        name: 'Team Leadership',
        level: 'ADVANCED',
        isRequired: true
      }]
    },
    compensation: {
      salaryGrade: 'M1',
      salaryRange: {
        min: 20000000,
        max: 35000000,
        currency: 'IDR'
      },
      overtimeEligible: false,
      bonusEligible: true
    }
  },
  {
    name: 'Warehouse Manager',
    code: 'WM',
    description: 'Manages warehouse operations',
    responsibilities: [
      'Oversee warehouse operations',
      'Manage warehouse staff',
      'Optimize warehouse processes',
      'Ensure inventory accuracy'
    ],
    reportTo: null, // Will be set to COO
    level: 2,
    status: 'ACTIVE',
    requirements: {
      education: [{
        degree: 'BACHELOR',
        field: 'Business, Logistics, or related field',
        isRequired: true
      }],
      experience: [{
        years: 5,
        description: 'Warehouse management experience',
        isRequired: true
      }],
      skills: [{
        name: 'Warehouse Management',
        level: 'ADVANCED',
        isRequired: true
      }, {
        name: 'Inventory Management',
        level: 'ADVANCED',
        isRequired: true
      }]
    },
    compensation: {
      salaryGrade: 'M1',
      salaryRange: {
        min: 20000000,
        max: 35000000,
        currency: 'IDR'
      },
      overtimeEligible: false,
      bonusEligible: true
    }
  }
];

/**
 * Seed divisions and positions
 * @param {string} userId - The ID of the user creating the seed data
 */
const seedDivisionsAndPositions = async (userId) => {
  try {
    logger.info('Starting division and position seeding...');
    
    // Create a default user ID if not provided
    const createdBy = userId || new mongoose.Types.ObjectId('000000000000000000000001');
    
    // Check if divisions already exist
    const divisionCount = await Division.countDocuments();
    if (divisionCount > 0) {
      logger.info(`Divisions already exist (${divisionCount} found). Skipping division seeding.`);
    } else {
      // Create divisions
      logger.info('Creating divisions...');
      
      // Create Executive Office first
      const exo = await Division.create({
        ...divisionData[0],
        createdBy
      });
      
      // Create level 1 divisions with parent set to Executive Office
      const ops = await Division.create({
        ...divisionData[1],
        parent: exo._id,
        createdBy
      });
      
      const fin = await Division.create({
        ...divisionData[2],
        parent: exo._id,
        createdBy
      });
      
      const hr = await Division.create({
        ...divisionData[3],
        parent: exo._id,
        createdBy
      });
      
      const it = await Division.create({
        ...divisionData[4],
        parent: exo._id,
        createdBy
      });
      
      // Create level 2 divisions with parent set to Operations
      await Division.create({
        ...divisionData[5],
        parent: ops._id,
        createdBy
      });
      
      await Division.create({
        ...divisionData[6],
        parent: ops._id,
        createdBy
      });
      
      await Division.create({
        ...divisionData[7],
        parent: ops._id,
        createdBy
      });
      
      logger.info('Divisions created successfully');
    }
    
    // Check if positions already exist
    const positionCount = await Position.countDocuments();
    if (positionCount > 0) {
      logger.info(`Positions already exist (${positionCount} found). Skipping position seeding.`);
    } else {
      // Create positions
      logger.info('Creating positions...');
      
      // Get divisions
      const exo = await Division.findOne({ code: 'EXO' });
      const ops = await Division.findOne({ code: 'OPS' });
      const fin = await Division.findOne({ code: 'FIN' });
      const hr = await Division.findOne({ code: 'HR' });
      const it = await Division.findOne({ code: 'IT' });
      const pickup = await Division.findOne({ code: 'PICKUP' });
      const delivery = await Division.findOne({ code: 'DELIVERY' });
      const warehouse = await Division.findOne({ code: 'WAREHOUSE' });
      
      // Create CEO first
      const ceo = await Position.create({
        ...positionData[0],
        division: exo._id,
        createdBy
      });
      
      // Create C-level positions reporting to CEO
      const coo = await Position.create({
        ...positionData[1],
        division: ops._id,
        reportTo: ceo._id,
        createdBy
      });
      
      const cfo = await Position.create({
        ...positionData[2],
        division: fin._id,
        reportTo: ceo._id,
        createdBy
      });
      
      const hrd = await Position.create({
        ...positionData[3],
        division: hr._id,
        reportTo: ceo._id,
        createdBy
      });
      
      const itd = await Position.create({
        ...positionData[4],
        division: it._id,
        reportTo: ceo._id,
        createdBy
      });
      
      // Create manager positions reporting to COO
      await Position.create({
        ...positionData[5],
        division: pickup._id,
        reportTo: coo._id,
        createdBy
      });
      
      await Position.create({
        ...positionData[6],
        division: delivery._id,
        reportTo: coo._id,
        createdBy
      });
      
      await Position.create({
        ...positionData[7],
        division: warehouse._id,
        reportTo: coo._id,
        createdBy
      });
      
      logger.info('Positions created successfully');
    }
    
    logger.info('Division and position seeding completed successfully');
  } catch (error) {
    logger.error('Error seeding divisions and positions:', error);
    throw error;
  }
};

module.exports = {
  seedDivisionsAndPositions
};
