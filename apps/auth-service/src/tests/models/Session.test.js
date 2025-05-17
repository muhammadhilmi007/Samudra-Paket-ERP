/**
 * Session Model Tests
 * Tests the Session model functionality
 */

const mongoose = require('mongoose');
const { Session } = require('../../domain/models/Session');
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

// Test session data
const testSession = {
  refreshToken: 'test-refresh-token',
  userAgent: 'Test User Agent',
  ipAddress: '127.0.0.1'
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
  await Session.deleteMany({});
});

// Clean up after all tests
afterAll(async () => {
  await User.deleteMany({});
});

describe('Session Model', () => {
  it('should create a new session successfully', async () => {
    const session = new Session({
      ...testSession,
      userId
    });
    
    const savedSession = await session.save();
    
    expect(savedSession._id).toBeDefined();
    expect(savedSession.userId.toString()).toBe(userId.toString());
    expect(savedSession.refreshToken).toBe(testSession.refreshToken);
    expect(savedSession.userAgent).toBe(testSession.userAgent);
    expect(savedSession.ipAddress).toBe(testSession.ipAddress);
    expect(savedSession.expiresAt).toBeDefined();
    expect(savedSession.isActive).toBe(true);
  });
  
  it('should require userId and refreshToken', async () => {
    const session = new Session({
      userAgent: testSession.userAgent,
      ipAddress: testSession.ipAddress
    });
    
    await expect(session.save()).rejects.toThrow();
  });
  
  it('should set default expiration date', async () => {
    const session = new Session({
      ...testSession,
      userId
    });
    
    const savedSession = await session.save();
    
    // Default expiration should be 7 days from now
    const now = new Date();
    const expiresAt = new Date(savedSession.expiresAt);
    const diffDays = Math.round((expiresAt - now) / (1000 * 60 * 60 * 24));
    
    expect(diffDays).toBe(7);
  });
  
  it('should allow custom expiration date', async () => {
    // Set expiration to 1 day from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);
    
    const session = new Session({
      ...testSession,
      userId,
      expiresAt
    });
    
    const savedSession = await session.save();
    
    expect(savedSession.expiresAt.toISOString()).toBe(expiresAt.toISOString());
  });
  
  it('should check if session is expired', async () => {
    // Create expired session
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1); // 1 day ago
    
    const expiredSession = new Session({
      ...testSession,
      userId,
      expiresAt: expiredDate
    });
    
    await expiredSession.save();
    
    expect(expiredSession.isExpired()).toBe(true);
    
    // Create active session
    const activeDate = new Date();
    activeDate.setDate(activeDate.getDate() + 1); // 1 day from now
    
    const activeSession = new Session({
      ...testSession,
      userId,
      refreshToken: 'active-token',
      expiresAt: activeDate
    });
    
    await activeSession.save();
    
    expect(activeSession.isExpired()).toBe(false);
  });
  
  it('should find sessions by userId', async () => {
    // Create multiple sessions for the same user
    const session1 = new Session({
      ...testSession,
      userId,
      refreshToken: 'token-1'
    });
    
    const session2 = new Session({
      ...testSession,
      userId,
      refreshToken: 'token-2'
    });
    
    await session1.save();
    await session2.save();
    
    // Find sessions by userId
    const sessions = await Session.find({ userId });
    
    expect(sessions.length).toBe(2);
    expect(sessions[0].refreshToken).toBe('token-1');
    expect(sessions[1].refreshToken).toBe('token-2');
  });
  
  it('should find session by refreshToken', async () => {
    const session = new Session({
      ...testSession,
      userId
    });
    
    await session.save();
    
    // Find session by refreshToken
    const foundSession = await Session.findOne({ refreshToken: testSession.refreshToken });
    
    expect(foundSession).toBeDefined();
    expect(foundSession.refreshToken).toBe(testSession.refreshToken);
  });
});
