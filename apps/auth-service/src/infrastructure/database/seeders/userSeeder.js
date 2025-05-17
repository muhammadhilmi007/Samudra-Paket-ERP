/**
 * User Seeder
 * Creates initial admin user and roles
 */

const { User } = require('../../../domain/models');
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
 * Seed admin user
 * @returns {Promise<void>}
 */
const seedAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      logger.info('Admin user already exists, skipping seeder');
      return;
    }
    
    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@samudrapaket.com',
      phoneNumber: '+628123456789',
      username: 'admin',
      password: 'Admin@123', // Will be hashed by pre-save hook
      role: 'admin',
      isActive: true,
      isVerified: true,
      permissions: [
        'user:read',
        'user:create',
        'user:update',
        'user:delete',
        'role:read',
        'role:create',
        'role:update',
        'role:delete'
      ]
    });
    
    await adminUser.save();
    logger.info('Admin user created successfully');
    
    // Create manager user
    const managerUser = new User({
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@samudrapaket.com',
      phoneNumber: '+628123456788',
      username: 'manager',
      password: 'Manager@123', // Will be hashed by pre-save hook
      role: 'manager',
      isActive: true,
      isVerified: true,
      permissions: [
        'user:read',
        'user:create',
        'user:update',
        'role:read'
      ]
    });
    
    await managerUser.save();
    logger.info('Manager user created successfully');
    
  } catch (error) {
    logger.error('Error seeding admin user:', error);
    throw error;
  }
};

module.exports = {
  seedAdminUser
};
