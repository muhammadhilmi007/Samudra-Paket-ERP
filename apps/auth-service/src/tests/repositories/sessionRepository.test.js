/**
 * Session Repository Tests
 * Tests the Session repository functionality
 */

const mongoose = require('mongoose');
const { Session } = require('../../domain/models/Session');
const { User } = require('../../domain/models/User');
const sessionRepository = require('../../infrastructure/repositories/sessionRepository');

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

describe('Session Repository', () => {
  it('should create a new session', async () => {
    const sessionData = {
      ...testSession,
      userId
    };
    
    const session = await sessionRepository.createSession(sessionData);
    
    expect(session._id).toBeDefined();
    expect(session.userId.toString()).toBe(userId.toString());
    expect(session.refreshToken).toBe(testSession.refreshToken);
    expect(session.userAgent).toBe(testSession.userAgent);
    expect(session.ipAddress).toBe(testSession.ipAddress);
    expect(session.expiresAt).toBeDefined();
    expect(session.isActive).toBe(true);
  });
  
  it('should find session by ID', async () => {
    // Create session
    const sessionData = {
      ...testSession,
      userId
    };
    
    const createdSession = await sessionRepository.createSession(sessionData);
    
    // Find session by ID
    const foundSession = await sessionRepository.findById(createdSession._id);
    
    expect(foundSession).toBeDefined();
    expect(foundSession._id.toString()).toBe(createdSession._id.toString());
    expect(foundSession.refreshToken).toBe(testSession.refreshToken);
  });
  
  it('should find session by refresh token', async () => {
    // Create session
    const sessionData = {
      ...testSession,
      userId
    };
    
    await sessionRepository.createSession(sessionData);
    
    // Find session by refresh token
    const foundSession = await sessionRepository.findByRefreshToken(testSession.refreshToken);
    
    expect(foundSession).toBeDefined();
    expect(foundSession.refreshToken).toBe(testSession.refreshToken);
  });
  
  it('should find sessions by user ID', async () => {
    // Create multiple sessions for the same user
    const session1 = {
      ...testSession,
      userId,
      refreshToken: 'token-1'
    };
    
    const session2 = {
      ...testSession,
      userId,
      refreshToken: 'token-2'
    };
    
    await sessionRepository.createSession(session1);
    await sessionRepository.createSession(session2);
    
    // Find sessions by user ID
    const sessions = await sessionRepository.findByUserId(userId);
    
    expect(sessions).toBeDefined();
    expect(sessions.length).toBe(2);
    expect(sessions[0].userId.toString()).toBe(userId.toString());
    expect(sessions[1].userId.toString()).toBe(userId.toString());
  });
  
  it('should delete session', async () => {
    // Create session
    const sessionData = {
      ...testSession,
      userId
    };
    
    const createdSession = await sessionRepository.createSession(sessionData);
    
    // Delete session
    const deletedSession = await sessionRepository.deleteSession(createdSession._id);
    
    expect(deletedSession).toBeDefined();
    expect(deletedSession._id.toString()).toBe(createdSession._id.toString());
    
    // Try to find deleted session
    const foundSession = await sessionRepository.findById(createdSession._id);
    
    expect(foundSession).toBeNull();
  });
  
  it('should delete session by refresh token', async () => {
    // Create session
    const sessionData = {
      ...testSession,
      userId
    };
    
    await sessionRepository.createSession(sessionData);
    
    // Delete session by refresh token
    const deletedSession = await sessionRepository.deleteByRefreshToken(testSession.refreshToken);
    
    expect(deletedSession).toBeDefined();
    expect(deletedSession.refreshToken).toBe(testSession.refreshToken);
    
    // Try to find deleted session
    const foundSession = await sessionRepository.findByRefreshToken(testSession.refreshToken);
    
    expect(foundSession).toBeNull();
  });
  
  it('should delete all sessions for a user', async () => {
    // Create multiple sessions for the same user
    const session1 = {
      ...testSession,
      userId,
      refreshToken: 'token-1'
    };
    
    const session2 = {
      ...testSession,
      userId,
      refreshToken: 'token-2'
    };
    
    await sessionRepository.createSession(session1);
    await sessionRepository.createSession(session2);
    
    // Delete all sessions for user
    const result = await sessionRepository.deleteAllForUser(userId);
    
    expect(result.deletedCount).toBe(2);
    
    // Try to find sessions for user
    const sessions = await sessionRepository.findByUserId(userId);
    
    expect(sessions.length).toBe(0);
  });
  
  it('should delete all sessions except one', async () => {
    // Create multiple sessions for the same user
    const session1 = {
      ...testSession,
      userId,
      refreshToken: 'token-1'
    };
    
    const session2 = {
      ...testSession,
      userId,
      refreshToken: 'token-2'
    };
    
    const createdSession1 = await sessionRepository.createSession(session1);
    await sessionRepository.createSession(session2);
    
    // Delete all sessions except one
    const result = await sessionRepository.deleteAllExcept(userId, createdSession1._id);
    
    expect(result.deletedCount).toBe(1);
    
    // Find remaining sessions for user
    const sessions = await sessionRepository.findByUserId(userId);
    
    expect(sessions.length).toBe(1);
    expect(sessions[0]._id.toString()).toBe(createdSession1._id.toString());
  });
  
  it('should find all active sessions', async () => {
    // Create active session
    const activeSession = {
      ...testSession,
      userId,
      refreshToken: 'active-token'
    };
    
    await sessionRepository.createSession(activeSession);
    
    // Create expired session
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1); // 1 day ago
    
    const expiredSession = {
      ...testSession,
      userId,
      refreshToken: 'expired-token',
      expiresAt: expiredDate
    };
    
    await sessionRepository.createSession(expiredSession);
    
    // Find active sessions
    const options = { skip: 0, limit: 10, sort: 'createdAt' };
    const sessions = await sessionRepository.findActive(options);
    
    expect(sessions).toBeDefined();
    expect(sessions.length).toBe(1);
    expect(sessions[0].refreshToken).toBe('active-token');
  });
  
  it('should count sessions', async () => {
    // Create multiple sessions
    await sessionRepository.createSession({
      ...testSession,
      userId,
      refreshToken: 'token-1'
    });
    
    await sessionRepository.createSession({
      ...testSession,
      userId,
      refreshToken: 'token-2'
    });
    
    // Count sessions
    const count = await sessionRepository.countSessions();
    
    expect(count).toBe(2);
  });
});
