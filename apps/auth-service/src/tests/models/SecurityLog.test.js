/**
 * SecurityLog Model Tests
 * Tests the SecurityLog model functionality
 */

const mongoose = require('mongoose');
const { SecurityLog } = require('../../domain/models/SecurityLog');
const { User } = require('../../domain/models/User');

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

describe('SecurityLog Model', () => {
  it('should create a new security log successfully', async () => {
    const log = new SecurityLog({
      ...testLog,
      userId
    });
    
    const savedLog = await log.save();
    
    expect(savedLog._id).toBeDefined();
    expect(savedLog.userId.toString()).toBe(userId.toString());
    expect(savedLog.eventType).toBe(testLog.eventType);
    expect(savedLog.ipAddress).toBe(testLog.ipAddress);
    expect(savedLog.userAgent).toBe(testLog.userAgent);
    expect(savedLog.details).toEqual(testLog.details);
    expect(savedLog.status).toBe(testLog.status);
    expect(savedLog.createdAt).toBeDefined();
  });
  
  it('should require eventType', async () => {
    const log = new SecurityLog({
      userId,
      ipAddress: testLog.ipAddress,
      userAgent: testLog.userAgent,
      status: testLog.status
    });
    
    await expect(log.save()).rejects.toThrow();
  });
  
  it('should allow creating log without userId for anonymous events', async () => {
    const log = new SecurityLog({
      eventType: 'ANONYMOUS_ACCESS',
      ipAddress: testLog.ipAddress,
      userAgent: testLog.userAgent,
      status: testLog.status
    });
    
    const savedLog = await log.save();
    
    expect(savedLog._id).toBeDefined();
    expect(savedLog.userId).toBeUndefined();
    expect(savedLog.eventType).toBe('ANONYMOUS_ACCESS');
  });
  
  it('should validate eventType enum values', async () => {
    const log = new SecurityLog({
      userId,
      eventType: 'INVALID_EVENT_TYPE',
      ipAddress: testLog.ipAddress,
      userAgent: testLog.userAgent,
      status: testLog.status
    });
    
    await expect(log.save()).rejects.toThrow();
  });
  
  it('should validate status enum values', async () => {
    const log = new SecurityLog({
      userId,
      eventType: testLog.eventType,
      ipAddress: testLog.ipAddress,
      userAgent: testLog.userAgent,
      status: 'INVALID_STATUS'
    });
    
    await expect(log.save()).rejects.toThrow();
  });
  
  it('should find logs by userId', async () => {
    // Create multiple logs for the same user
    const log1 = new SecurityLog({
      ...testLog,
      userId,
      eventType: 'LOGIN_SUCCESS'
    });
    
    const log2 = new SecurityLog({
      ...testLog,
      userId,
      eventType: 'PASSWORD_CHANGE'
    });
    
    await log1.save();
    await log2.save();
    
    // Find logs by userId
    const logs = await SecurityLog.find({ userId });
    
    expect(logs.length).toBe(2);
    expect(logs[0].eventType).toBe('LOGIN_SUCCESS');
    expect(logs[1].eventType).toBe('PASSWORD_CHANGE');
  });
  
  it('should find logs by eventType', async () => {
    // Create logs with different event types
    const log1 = new SecurityLog({
      ...testLog,
      userId,
      eventType: 'LOGIN_SUCCESS'
    });
    
    const log2 = new SecurityLog({
      ...testLog,
      userId,
      eventType: 'LOGIN_FAILURE'
    });
    
    await log1.save();
    await log2.save();
    
    // Find logs by eventType
    const logs = await SecurityLog.find({ eventType: 'LOGIN_SUCCESS' });
    
    expect(logs.length).toBe(1);
    expect(logs[0].eventType).toBe('LOGIN_SUCCESS');
  });
  
  it('should find logs by status', async () => {
    // Create logs with different statuses
    const log1 = new SecurityLog({
      ...testLog,
      userId,
      status: 'SUCCESS'
    });
    
    const log2 = new SecurityLog({
      ...testLog,
      userId,
      status: 'FAILURE'
    });
    
    await log1.save();
    await log2.save();
    
    // Find logs by status
    const logs = await SecurityLog.find({ status: 'SUCCESS' });
    
    expect(logs.length).toBe(1);
    expect(logs[0].status).toBe('SUCCESS');
  });
  
  it('should find logs by date range', async () => {
    // Create log with specific date
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7); // 7 days ago
    
    const oldLog = new SecurityLog({
      ...testLog,
      userId,
      createdAt: pastDate
    });
    
    const newLog = new SecurityLog({
      ...testLog,
      userId
    });
    
    await oldLog.save();
    await newLog.save();
    
    // Find logs from last 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const logs = await SecurityLog.find({
      createdAt: { $gte: threeDaysAgo }
    });
    
    expect(logs.length).toBe(1);
  });
  
  it('should use static method to create log', async () => {
    const logData = {
      userId,
      eventType: 'LOGIN_SUCCESS',
      ipAddress: '127.0.0.1',
      userAgent: 'Test User Agent',
      details: { source: 'web' },
      status: 'SUCCESS'
    };
    
    const log = await SecurityLog.createLog(logData);
    
    expect(log._id).toBeDefined();
    expect(log.userId.toString()).toBe(userId.toString());
    expect(log.eventType).toBe(logData.eventType);
    expect(log.ipAddress).toBe(logData.ipAddress);
    expect(log.userAgent).toBe(logData.userAgent);
    expect(log.details).toEqual(logData.details);
    expect(log.status).toBe(logData.status);
  });
});
