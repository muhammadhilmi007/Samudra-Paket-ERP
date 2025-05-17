/**
 * Branch Seeder
 * Seeds initial branch data
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Branch } = require('../domain/models');
const { logger } = require('../utils');

/**
 * Initial branch data
 */
const branchData = [
  {
    code: 'HO',
    name: 'Head Office',
    type: 'HEAD_OFFICE',
    parent: null,
    level: 0,
    path: 'HO',
    status: 'ACTIVE',
    address: {
      street: 'Jl. Sudirman No. 123',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      postalCode: '10110',
      country: 'Indonesia',
      coordinates: {
        latitude: -6.2088,
        longitude: 106.8456
      }
    },
    contactInfo: {
      phone: '+6221-5555-1234',
      email: 'headoffice@samudrapp.com',
      fax: '+6221-5555-5678',
      website: 'https://samudrapp.com'
    },
    operationalHours: [
      { day: 'MONDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'TUESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'WEDNESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'THURSDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'FRIDAY', isOpen: true, openTime: '08:00', closeTime: '16:00' },
      { day: 'SATURDAY', isOpen: true, openTime: '09:00', closeTime: '13:00' },
      { day: 'SUNDAY', isOpen: false }
    ],
    resources: {
      employeeCount: 50,
      vehicleCount: 10,
      storageCapacity: 1000
    },
    metrics: {
      monthlyShipmentVolume: 5000,
      monthlyRevenue: 500000000,
      customerSatisfactionScore: 4.8,
      deliverySuccessRate: 98.5
    },
    createdBy: '60d21b4667d0d8992e610c00' // Admin user ID
  },
  {
    code: 'JKT',
    name: 'Jakarta Regional',
    type: 'REGIONAL',
    status: 'ACTIVE',
    address: {
      street: 'Jl. Gatot Subroto No. 456',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12930',
      country: 'Indonesia',
      coordinates: {
        latitude: -6.2356,
        longitude: 106.8269
      }
    },
    contactInfo: {
      phone: '+6221-5555-2345',
      email: 'jakarta@samudrapp.com',
      fax: '+6221-5555-6789',
      website: 'https://jakarta.samudrapp.com'
    },
    operationalHours: [
      { day: 'MONDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'TUESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'WEDNESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'THURSDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'FRIDAY', isOpen: true, openTime: '08:00', closeTime: '16:00' },
      { day: 'SATURDAY', isOpen: true, openTime: '09:00', closeTime: '13:00' },
      { day: 'SUNDAY', isOpen: false }
    ],
    resources: {
      employeeCount: 30,
      vehicleCount: 15,
      storageCapacity: 800
    },
    metrics: {
      monthlyShipmentVolume: 3000,
      monthlyRevenue: 300000000,
      customerSatisfactionScore: 4.7,
      deliverySuccessRate: 97.8
    },
    createdBy: '60d21b4667d0d8992e610c00' // Admin user ID
  },
  {
    code: 'BDG',
    name: 'Bandung Regional',
    type: 'REGIONAL',
    status: 'ACTIVE',
    address: {
      street: 'Jl. Asia Afrika No. 789',
      city: 'Bandung',
      province: 'Jawa Barat',
      postalCode: '40112',
      country: 'Indonesia',
      coordinates: {
        latitude: -6.9175,
        longitude: 107.6191
      }
    },
    contactInfo: {
      phone: '+6222-4444-1234',
      email: 'bandung@samudrapp.com',
      fax: '+6222-4444-5678',
      website: 'https://bandung.samudrapp.com'
    },
    operationalHours: [
      { day: 'MONDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'TUESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'WEDNESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'THURSDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
      { day: 'FRIDAY', isOpen: true, openTime: '08:00', closeTime: '16:00' },
      { day: 'SATURDAY', isOpen: true, openTime: '09:00', closeTime: '13:00' },
      { day: 'SUNDAY', isOpen: false }
    ],
    resources: {
      employeeCount: 25,
      vehicleCount: 12,
      storageCapacity: 600
    },
    metrics: {
      monthlyShipmentVolume: 2000,
      monthlyRevenue: 200000000,
      customerSatisfactionScore: 4.6,
      deliverySuccessRate: 97.2
    },
    createdBy: '60d21b4667d0d8992e610c00' // Admin user ID
  }
];

/**
 * Import branch data
 */
const importData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    logger.info('MongoDB Connected');
    
    // Clear existing data
    await Branch.deleteMany();
    logger.info('Existing branch data cleared');
    
    // Create head office
    const headOffice = await Branch.create(branchData[0]);
    logger.info(`Head Office created: ${headOffice.name}`);
    
    // Create regional branches with parent reference and level
    const regionalBranches = branchData.slice(1).map(branch => ({
      ...branch,
      parent: headOffice._id,
      level: 1, // Regional branches are at level 1
      path: `${headOffice.code}.${branch.code}` // Set the path based on parent
    }));
    
    await Branch.create(regionalBranches);
    logger.info(`${regionalBranches.length} regional branches created`);
    
    logger.info('Branch data import completed');
    process.exit();
  } catch (error) {
    logger.error(`Error importing branch data: ${error.message}`, { error });
    process.exit(1);
  }
};

/**
 * Delete all branch data
 */
const destroyData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    logger.info('MongoDB Connected');
    
    // Clear all branch data
    await Branch.deleteMany();
    logger.info('All branch data deleted');
    
    process.exit();
  } catch (error) {
    logger.error(`Error deleting branch data: ${error.message}`, { error });
    process.exit(1);
  }
};

// Run seeder based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
