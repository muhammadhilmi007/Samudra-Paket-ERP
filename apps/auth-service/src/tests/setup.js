/**
 * Test Setup
 * Configures the test environment
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.test' });

// Create in-memory MongoDB server
let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Create in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Set MongoDB URI for testing
  process.env.MONGODB_URI = mongoUri;
  
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Set JWT secret for testing
  process.env.JWT_SECRET = 'test-jwt-secret';
  
  // Set Redis mock configuration
  process.env.REDIS_HOST = 'localhost';
  process.env.REDIS_PORT = '6379';
  process.env.REDIS_PASSWORD = '';
  process.env.REDIS_URL = null;
  jest.mock('../infrastructure/database/redis', () => {
    const redisMock = {
      connectToRedis: jest.fn().mockResolvedValue(true),
      disconnectRedis: jest.fn().mockResolvedValue(true),
      getRedisClient: jest.fn().mockReturnValue({}),
      setCache: jest.fn().mockResolvedValue('OK'),
      getCache: jest.fn().mockResolvedValue(null),
      deleteCache: jest.fn().mockResolvedValue(1),
      existsInCache: jest.fn().mockResolvedValue(false),
      blacklistToken: jest.fn().mockResolvedValue('OK'),
      isTokenBlacklisted: jest.fn().mockResolvedValue(false),
      storeSession: jest.fn().mockResolvedValue('OK'),
      getSession: jest.fn().mockResolvedValue(null),
      deleteSession: jest.fn().mockResolvedValue(1),
      deleteUserSessions: jest.fn().mockResolvedValue(0)
    };
    
    return redisMock;
  });
  
  // Silence console logs during tests
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

// Cleanup after all tests
afterAll(async () => {
  // Close MongoDB connection
  await mongoose.disconnect();
  
  // Stop MongoDB server
  if (mongoServer) {
    await mongoServer.stop();
  }
  
  // Restore console functions
  console.log.mockRestore();
  console.error.mockRestore();
  console.warn.mockRestore();
});
