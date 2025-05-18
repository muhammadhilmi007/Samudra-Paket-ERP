/**
 * Run Division & Position Seeder
 * Script to run the division and position seeder
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { seedDivisionsAndPositions } = require('../config/seeders/divisionAndPositionSeeder');
const { logger } = require('../utils');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sarana-erp';

// Test user ID for creating resources
const TEST_USER_ID = '000000000000000000000001';

/**
 * Run the seeder
 */
const runSeeder = async () => {
  try {
    logger.info('Starting division and position seeder...');
    
    // Connect to MongoDB
    logger.info(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to MongoDB');
    
    // Run the seeder
    await seedDivisionsAndPositions(TEST_USER_ID);
    
    logger.info('Division and position seeder completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Seeder failed:', error);
    process.exit(1);
  }
};

// Run the seeder
runSeeder();
