/**
 * Run All Seeders
 * Script to run all seeders in the correct order
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { runAllSeeders } = require('../config/seeders');
const { logger } = require('../utils');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:HpmyPloqcCXAQdHoTRXmOGbnOYRqyufP@nozomi.proxy.rlwy.net:22764';

// Test user ID for creating resources
const TEST_USER_ID = '000000000000000000000001';

/**
 * Run the seeders
 */
const runSeeders = async () => {
  try {
    logger.info('Starting all seeders...');
    
    // Connect to MongoDB
    logger.info(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to MongoDB');
    
    try {
      // Run branch seeder
      logger.info('Running branch seeder...');
      const { seedBranches } = require('../config/seeders/branchSeeder');
      await seedBranches(TEST_USER_ID);
      logger.info('Branch seeder completed successfully');
      
      // Run divisions and positions seeder
      logger.info('Running divisions and positions seeder...');
      const { seedDivisionsAndPositions } = require('../config/seeders/divisionAndPositionSeeder');
      await seedDivisionsAndPositions(TEST_USER_ID);
      logger.info('Divisions and positions seeder completed successfully');
      
      // Run employee seeder
      logger.info('Running employee seeder...');
      const { seedEmployees } = require('../config/seeders/employeeSeeder');
      await seedEmployees(TEST_USER_ID);
      logger.info('Employee seeder completed successfully');
      
      // Run attendance seeder
      logger.info('Running attendance seeder...');
      const { seedAttendanceData } = require('../config/seeders/attendanceSeeder');
      await seedAttendanceData();
      logger.info('Attendance seeder completed successfully');
      
      logger.info('All seeders completed successfully');
    } catch (seedError) {
      logger.error('Error in seeder execution:', seedError);
      if (seedError.stack) {
        logger.error('Stack trace:', seedError.stack);
      }
      throw seedError;
    }
    
    process.exit(0);
  } catch (error) {
    logger.error('Seeders failed:', error);
    if (error.stack) {
      logger.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
};

// Run the seeders
runSeeders();
