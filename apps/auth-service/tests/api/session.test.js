/**
 * Session API Tests
 * Tests for session management endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/server');
const User = require('../../src/domain/models/User');
const Session = require('../../src/domain/models/Session');
const { generateJWT } = require('../../src/utils/jwt');

let mongoServer;
let adminUser, regularUser;
let adminToken, userToken;
let userSessions = [];

// Mock Redis client
jest.mock('../../src/config/redis', () => ({
  getRedisClient: jest.fn().mockReturnValue({
    setex: jest.fn().mockImplementation((key, ttl, value, callback) => {
      if (callback) callback(null, 'OK');
      return Promise.resolve('OK');
    }),
    get: jest.fn().mockImplementation((key, callback) => {
      if (callback) callback(null, null);
      return Promise.resolve(null);
    }),
    del: jest.fn().mockImplementation((key, callback) => {
      if (callback) callback(null, 1);
      return Promise.resolve(1);
    }),
    quit: jest.fn().mockResolvedValue('OK')
  }),
  closeRedisConnection: jest.fn().mockResolvedValue(true)
}));

beforeAll(async () => {
  // Set up MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear database collections before each test
  await User.deleteMany({});
  await Session.deleteMany({});
  
  // Create test users
  adminUser = new User({
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isVerified: true
  });
  
  regularUser = new User({
    email: 'user@example.com',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user',
    isVerified: true
  });
  
  await adminUser.setPassword('Password123!');
  await regularUser.setPassword('Password123!');
  
  await adminUser.save();
  await regularUser.save();
  
  // Generate JWT tokens
  adminToken = generateJWT({ 
    id: adminUser._id.toString(),
    email: adminUser.email,
    role: adminUser.role
  });
  
  userToken = generateJWT({ 
    id: regularUser._id.toString(),
    email: regularUser.email,
    role: regularUser.role
  });
  
  // Create test sessions for regular user
  userSessions = [];
  
  // Create multiple sessions for the regular user
  for (let i = 0; i < 3; i++) {
    const session = await Session.create({
      userId: regularUser._id,
      refreshToken: `user-token-${i}`,
      userAgent: `User Agent ${i}`,
      ipAddress: `192.168.1.${i}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
    userSessions.push(session);
  }
  
  // Create a session for admin user
  await Session.create({
    userId: adminUser._id,
    refreshToken: 'admin-token',
    userAgent: 'Admin Agent',
    ipAddress: '192.168.1.100',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  });
});

describe('Session API', () => {
  describe('GET /api/sessions', () => {
    it('should return all sessions for admin', async () => {
      const response = await request(app)
        .get('/api/sessions')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('sessions');
      expect(response.body.data.sessions.length).toBeGreaterThanOrEqual(4); // At least 4 sessions (3 user + 1 admin)
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should deny access for regular users', async () => {
      const response = await request(app)
        .get('/api/sessions')
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('FORBIDDEN');
    });

    it('should return unauthorized for missing token', async () => {
      const response = await request(app)
        .get('/api/sessions')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('UNAUTHORIZED');
    });
  });

  describe('GET /api/sessions/me', () => {
    it('should return user\'s own sessions', async () => {
      const response = await request(app)
        .get('/api/sessions/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('sessions');
      expect(response.body.data.sessions.length).toBe(3); // 3 sessions for the regular user
      
      // Verify session data
      const sessions = response.body.data.sessions;
      expect(sessions[0]).toHaveProperty('_id');
      expect(sessions[0]).toHaveProperty('userAgent');
      expect(sessions[0]).toHaveProperty('ipAddress');
      expect(sessions[0]).toHaveProperty('createdAt');
      expect(sessions[0]).toHaveProperty('expiresAt');
      
      // Should not include the refresh token in the response
      expect(sessions[0]).not.toHaveProperty('refreshToken');
    });
  });

  describe('DELETE /api/sessions/:sessionId', () => {
    it('should allow users to revoke their own session', async () => {
      const sessionId = userSessions[0]._id;
      
      const response = await request(app)
        .delete(`/api/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Session revoked successfully');
      
      // Verify session was deleted
      const session = await Session.findById(sessionId);
      expect(session).toBeNull();
    });

    it('should allow admins to revoke any session', async () => {
      const sessionId = userSessions[0]._id;
      
      const response = await request(app)
        .delete(`/api/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Session revoked successfully');
    });

    it('should deny access to revoke other user\'s sessions', async () => {
      // Get admin's session
      const adminSession = await Session.findOne({ userId: adminUser._id });
      
      const response = await request(app)
        .delete(`/api/sessions/${adminSession._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('FORBIDDEN');
    });

    it('should return not found for non-existent session', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/sessions/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/sessions/me/all', () => {
    it('should revoke all user\'s sessions except current', async () => {
      const response = await request(app)
        .delete('/api/sessions/me/all')
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('All sessions revoked successfully');
      expect(response.body.data).toHaveProperty('count');
      expect(response.body.data.count).toBe(3); // All 3 sessions revoked
      
      // Verify sessions were deleted
      const remainingSessions = await Session.find({ userId: regularUser._id });
      expect(remainingSessions.length).toBe(0);
    });
  });
});
