/**
 * Seeders Index
 * Runs all seeders
 */

const mongoose = require('mongoose');
const { seedAdminUser } = require('./userSeeder');
const winston = require('winston');

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'auth-service-seeder' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/seeder-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/seeder.log' })
  ]
});

/**
 * Run all seeders
 */
const runSeeders = async () => {
  try {
    // Connect to MongoDB
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-service', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    logger.info('Connected to MongoDB');
    
    // Run seeders
    await seedAdminUser();
    
    logger.info('All seeders completed successfully');
    
    // Disconnect from MongoDB
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error running seeders:', error);
    process.exit(1);
  }
};

// Run seeders if this file is executed directly
if (require.main === module) {
  runSeeders();
}

module.exports = {
  runSeeders
};
