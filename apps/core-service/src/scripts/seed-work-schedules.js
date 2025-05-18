/**
 * Seed Work Schedules
 * Script to seed work schedules only
 */

require('dotenv').config();
const mongoose = require('mongoose');
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
    // Import WorkSchedule model
    const WorkSchedule = require('../domain/models/WorkSchedule');
    
    // Delete existing work schedules
    await WorkSchedule.deleteMany({});
    logger.info('Deleted existing work schedules');
    
    // Create work schedules
    const workSchedules = [
      {
        name: 'Regular Office Hours',
        code: 'REG-01',
        description: 'Standard 8-hour work schedule from Monday to Friday',
        type: 'REGULAR',
        status: 'ACTIVE',
        workingDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        workingHours: {
          regular: {
            startTime: '08:00',
            endTime: '17:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
            lateGracePeriod: 15,
            totalHours: 8
          }
        },
        overtimeSettings: {
          isAllowed: true,
          maxDailyHours: 3,
          maxWeeklyHours: 15,
          minimumDuration: 30,
          requiresApproval: true
        },
        effectiveStartDate: new Date('2025-01-01'),
        createdBy: mongoose.Types.ObjectId(TEST_USER_ID),
        updatedBy: mongoose.Types.ObjectId(TEST_USER_ID)
      },
      {
        name: 'Shift Work Schedule',
        code: 'SHIFT-01',
        description: 'Rotating shift schedule for warehouse operations',
        type: 'SHIFT',
        status: 'ACTIVE',
        workingDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true
        },
        workingHours: {
          regular: {
            startTime: '08:00',
            endTime: '17:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
            lateGracePeriod: 15,
            totalHours: 8
          },
          shifts: [
            {
              code: 'MORNING',
              name: 'Morning Shift',
              startTime: '06:00',
              endTime: '14:00',
              totalHours: 8,
              breakDuration: 60,
              lateGracePeriod: 15,
              isOvernight: false
            },
            {
              code: 'AFTERNOON',
              name: 'Afternoon Shift',
              startTime: '14:00',
              endTime: '22:00',
              totalHours: 8,
              breakDuration: 60,
              lateGracePeriod: 15,
              isOvernight: false
            },
            {
              code: 'NIGHT',
              name: 'Night Shift',
              startTime: '22:00',
              endTime: '06:00',
              totalHours: 8,
              breakDuration: 60,
              lateGracePeriod: 15,
              isOvernight: true
            }
          ]
        },
        overtimeSettings: {
          isAllowed: true,
          maxDailyHours: 4,
          maxWeeklyHours: 20,
          minimumDuration: 30,
          requiresApproval: true
        },
        effectiveStartDate: new Date('2025-01-01'),
        createdBy: mongoose.Types.ObjectId(TEST_USER_ID),
        updatedBy: mongoose.Types.ObjectId(TEST_USER_ID)
      },
      {
        name: 'Flexible Hours',
        code: 'FLEX-01',
        description: 'Flexible working hours with core hours',
        type: 'FLEXIBLE',
        status: 'ACTIVE',
        workingDays: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        },
        workingHours: {
          regular: {
            startTime: '09:00',
            endTime: '17:00',
            breakStartTime: '12:00',
            breakEndTime: '13:00',
            lateGracePeriod: 15,
            totalHours: 8
          }
        },
        flexibleSettings: {
          coreStartTime: '10:00',
          coreEndTime: '15:00',
          flexStartTimeMin: '07:00',
          flexStartTimeMax: '10:00',
          flexEndTimeMin: '15:00',
          flexEndTimeMax: '19:00',
          minWorkingHours: 8
        },
        effectiveStartDate: new Date('2025-01-01'),
        createdBy: mongoose.Types.ObjectId(TEST_USER_ID),
        updatedBy: mongoose.Types.ObjectId(TEST_USER_ID)
      }
    ];
    
    // Insert work schedules
    const createdSchedules = await WorkSchedule.insertMany(workSchedules);
    logger.info(`${createdSchedules.length} work schedules seeded successfully`);
    
    logger.info('Work schedule seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding work schedules:', error);
    process.exit(1);
  }
})
.catch(err => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});
