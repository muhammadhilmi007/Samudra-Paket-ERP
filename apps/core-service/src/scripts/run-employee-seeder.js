/**
 * Run Employee Seeder
 * Script to run the employee seeder
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { seedEmployees } = require('../config/seeders/employeeSeeder');
const { logger } = require('../utils');

// MongoDB connection URI - Use local MongoDB for testing
const MONGODB_URI = 'mongodb://localhost:27017/sarana-erp';

// Test user ID for creating resources
const TEST_USER_ID = '000000000000000000000001';

/**
 * Run the seeder
 */
const runSeeder = async () => {
  try {
    logger.info('Starting employee seeder...');
    
    // Connect to MongoDB
    logger.info(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to MongoDB');
    
    // Run the seeder
    await seedEmployees(TEST_USER_ID);
    
    logger.info('Employee seeder completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Seeder failed:', error);
    process.exit(1);
  }
};

// Run the seeder
runSeeder();
