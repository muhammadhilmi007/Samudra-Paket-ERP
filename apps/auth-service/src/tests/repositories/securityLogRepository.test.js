/**
 * Security Log Repository Tests
 * Tests the SecurityLog repository functionality
 */

const mongoose = require('mongoose');
const { SecurityLog } = require('../../domain/models/SecurityLog');
const { User } = require('../../domain/models/User');
const securityLogRepository = require('../../infrastructure/repositories/securityLogRepository');

// Test user data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  username: 'testuser',
  password: 'Password123!',
  role: 'customer'
};

// Test log data
const testLog = {
  eventType: 'LOGIN_SUCCESS',
  ipAddress: '127.0.0.1',
  userAgent: 'Test User Agent',
  details: { source: 'web' },
  status: 'SUCCESS'
};

// Store user ID for tests
let userId;

// Setup before tests
beforeAll(async () => {
  // Create test user
  const user = new User(testUser);
  const savedUser = await user.save();
  userId = savedUser._id;
});

// Clear test data after tests
afterEach(async () => {
  await SecurityLog.deleteMany({});
});

// Clean up after all tests
afterAll(async () => {
  await User.deleteMany({});
});

describe('Security Log Repository', () => {
  it('should create a new security log', async () => {
    const logData = {
      ...testLog,
      userId
    };
    
    const log = await securityLogRepository.createLog(logData);
    
    expect(log._id).toBeDefined();
    expect(log.userId.toString()).toBe(userId.toString());
    expect(log.eventType).toBe(testLog.eventType);
    expect(log.ipAddress).toBe(testLog.ipAddress);
    expect(log.userAgent).toBe(testLog.userAgent);
    expect(log.details).toEqual(testLog.details);
    expect(log.status).toBe(testLog.status);
    expect(log.createdAt).toBeDefined();
  });
  
  it('should find log by ID', async () => {
    // Create log
    const logData = {
      ...testLog,
      userId
    };
    
    const createdLog = await securityLogRepository.createLog(logData);
    
    // Find log by ID
    const foundLog = await securityLogRepository.findById(createdLog._id);
    
    expect(foundLog).toBeDefined();
    expect(foundLog._id.toString()).toBe(createdLog._id.toString());
    expect(foundLog.eventType).toBe(testLog.eventType);
  });
  
  it('should find logs by user ID', async () => {
    // Create multiple logs for the same user
    const log1 = {
      ...testLog,
      userId,
      eventType: 'LOGIN_SUCCESS'
    };
    
    const log2 = {
      ...testLog,
      userId,
      eventType: 'PASSWORD_CHANGE'
    };
    
    await securityLogRepository.createLog(log1);
    await securityLogRepository.createLog(log2);
    
    // Find logs by user ID
    const options = { skip: 0, limit: 10, sort: 'createdAt' };
    const logs = await securityLogRepository.findByUserId(userId, options);
    
    expect(logs).toBeDefined();
    expect(logs.length).toBe(2);
    expect(logs[0].userId.toString()).toBe(userId.toString());
    expect(logs[1].userId.toString()).toBe(userId.toString());
  });
  
  it('should find logs by event type', async () => {
    // Create logs with different event types
    const log1 = {
      ...testLog,
      userId,
      eventType: 'LOGIN_SUCCESS'
    };
    
    const log2 = {
      ...testLog,
      userId,
      eventType: 'LOGIN_FAILURE'
    };
    
    await securityLogRepository.createLog(log1);
    await securityLogRepository.createLog(log2);
    
    // Find logs by event type
    const options = { skip: 0, limit: 10, sort: 'createdAt' };
    const logs = await securityLogRepository.findByEventType('LOGIN_SUCCESS', options);
    
    expect(logs).toBeDefined();
    expect(logs.length).toBe(1);
    expect(logs[0].eventType).toBe('LOGIN_SUCCESS');
  });
  
  it('should find logs by status', async () => {
    // Create logs with different statuses
    const log1 = {
      ...testLog,
      userId,
      status: 'SUCCESS'
    };
    
    const log2 = {
      ...testLog,
      userId,
      status: 'FAILURE'
    };
    
    await securityLogRepository.createLog(log1);
    await securityLogRepository.createLog(log2);
    
    // Find logs by status
    const options = { skip: 0, limit: 10, sort: 'createdAt' };
    const logs = await securityLogRepository.findByStatus('SUCCESS', options);
    
    expect(logs).toBeDefined();
    expect(logs.length).toBe(1);
    expect(logs[0].status).toBe('SUCCESS');
  });
  
  it('should find logs by date range', async () => {
    // Create log with specific date
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7); // 7 days ago
    
    const oldLog = {
      ...testLog,
      userId,
      createdAt: pastDate
    };
    
    const newLog = {
      ...testLog,
      userId
    };
    
    await securityLogRepository.createLog(oldLog);
    await securityLogRepository.createLog(newLog);
    
    // Find logs from last 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const options = { skip: 0, limit: 10, sort: 'createdAt' };
    const logs = await securityLogRepository.findByDateRange(threeDaysAgo, new Date(), options);
    
    expect(logs).toBeDefined();
    expect(logs.length).toBe(1);
  });
  
  it('should find all logs with pagination', async () => {
    // Create multiple logs
    await securityLogRepository.createLog({
      ...testLog,
      userId,
      eventType: 'LOGIN_SUCCESS'
    });
    
    await securityLogRepository.createLog({
      ...testLog,
      userId,
      eventType: 'PASSWORD_CHANGE'
    });
    
    await securityLogRepository.createLog({
      ...testLog,
      userId,
      eventType: 'LOGOUT'
    });
    
    // Find all logs with pagination
    const options = { skip: 0, limit: 2, sort: 'createdAt' };
    const logs = await securityLogRepository.findAll(options);
    
    expect(logs).toBeDefined();
    expect(logs.length).toBe(2);
  });
  
  it('should count logs', async () => {
    // Create multiple logs
    await securityLogRepository.createLog({
      ...testLog,
      userId,
      eventType: 'LOGIN_SUCCESS'
    });
    
    await securityLogRepository.createLog({
      ...testLog,
      userId,
      eventType: 'PASSWORD_CHANGE'
    });
    
    // Count logs
    const count = await securityLogRepository.countLogs();
    
    expect(count).toBe(2);
  });
  
  it('should count logs with filter', async () => {
    // Create logs with different event types
    await securityLogRepository.createLog({
      ...testLog,
      userId,
      eventType: 'LOGIN_SUCCESS'
    });
    
    await securityLogRepository.createLog({
      ...testLog,
      userId,
      eventType: 'LOGIN_FAILURE'
    });
    
    // Count logs with filter
    const count = await securityLogRepository.countLogs({ eventType: 'LOGIN_SUCCESS' });
    
    expect(count).toBe(1);
  });
});
