/**
 * Run Attendance Seeder
 * Script to run the attendance seeder independently
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { seedAttendanceData, destroyAttendanceData } = require('../config/seeders/attendanceSeeder');
const { logger } = require('../utils');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:HpmyPloqcCXAQdHoTRXmOGbnOYRqyufP@nozomi.proxy.rlwy.net:22764', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  logger.info('MongoDB connected successfully');
  
  try {
    // Check command line arguments
    const args = process.argv.slice(2);
    const destroy = args.includes('-d') || args.includes('--destroy');
    
    if (destroy) {
      // Destroy attendance data
      await destroyAttendanceData();
    } else {
      // Seed attendance data with test user ID
      const TEST_USER_ID = '65f2d6d09d85a36c1e21517d'; // Use the same test user ID as in run-all-seeders.js
      await seedAttendanceData(TEST_USER_ID);
    }
    
    logger.info('Attendance seeder script completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error running attendance seeder:', error);
    process.exit(1);
  }
})
.catch(err => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});
