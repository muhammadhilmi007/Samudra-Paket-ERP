/**
 * Seed Holidays
 * Script to seed holidays only
 */

require('dotenv').config();
const mongoose = require('mongoose');
const moment = require('moment');
const { logger } = require('../utils');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:HpmyPloqcCXAQdHoTRXmOGbnOYRqyufP@nozomi.proxy.rlwy.net:22764';

// Test user ID for creating resources
const TEST_USER_ID = '65f2d6d09d85a36c1e21517d';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  logger.info('MongoDB connected successfully');
  
  try {
    // Import Holiday model
    const Holiday = require('../domain/models/Holiday');
    
    // Delete existing holidays
    await Holiday.deleteMany({});
    logger.info('Deleted existing holidays');
    
    // Create holidays for 2025
    const holidays = [
      {
        name: 'New Year\'s Day',
        date: new Date('2025-01-01'),
        type: 'NATIONAL',
        description: 'New Year\'s Day celebration',
        isRecurring: true,
        status: 'ACTIVE',
        createdBy: mongoose.Types.ObjectId(TEST_USER_ID),
        updatedBy: mongoose.Types.ObjectId(TEST_USER_ID)
      },
      {
        name: 'Independence Day',
        date: new Date('2025-08-17'),
        type: 'NATIONAL',
        description: 'Indonesian Independence Day',
        isRecurring: true,
        status: 'ACTIVE',
        createdBy: mongoose.Types.ObjectId(TEST_USER_ID),
        updatedBy: mongoose.Types.ObjectId(TEST_USER_ID)
      },
      {
        name: 'Eid al-Fitr',
        date: new Date('2025-04-03'),
        type: 'RELIGIOUS',
        description: 'Eid al-Fitr celebration',
        isRecurring: false,
        status: 'ACTIVE',
        createdBy: mongoose.Types.ObjectId(TEST_USER_ID),
        updatedBy: mongoose.Types.ObjectId(TEST_USER_ID)
      },
      {
        name: 'Eid al-Adha',
        date: new Date('2025-06-10'),
        type: 'RELIGIOUS',
        description: 'Eid al-Adha celebration',
        isRecurring: false,
        status: 'ACTIVE',
        createdBy: mongoose.Types.ObjectId(TEST_USER_ID),
        updatedBy: mongoose.Types.ObjectId(TEST_USER_ID)
      },
      {
        name: 'Christmas Day',
        date: new Date('2025-12-25'),
        type: 'RELIGIOUS',
        description: 'Christmas Day celebration',
        isRecurring: true,
        status: 'ACTIVE',
        createdBy: mongoose.Types.ObjectId(TEST_USER_ID),
        updatedBy: mongoose.Types.ObjectId(TEST_USER_ID)
      }
    ];
    
    // Insert holidays
    const createdHolidays = await Holiday.insertMany(holidays);
    logger.info(`${createdHolidays.length} holidays seeded successfully`);
    
    logger.info('Holiday seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding holidays:', error);
    process.exit(1);
  }
})
.catch(err => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});
