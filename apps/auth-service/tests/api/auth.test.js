/**
 * Authentication API Tests
 * Tests for authentication-related endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/server');
const User = require('../../src/domain/models/User');
const Session = require('../../src/domain/models/Session');
const { generateJWT } = require('../../src/utils/jwt');

let mongoServer;

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

// Mock email service
jest.mock('../../src/infrastructure/external/emailService', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true)
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
});

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Registration successful. Please verify your email.');
      
      // Check if user was created in the database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.isVerified).toBe(false);
    });

    it('should return validation error for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.errors).toBeTruthy();
    });

    it('should return error for existing email', async () => {
      // Create a user first
      await User.create({
        email: 'existing@example.com',
        password: 'hashedPassword',
        firstName: 'Existing',
        lastName: 'User',
        role: 'user',
        isVerified: false
      });

      const userData = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('EMAIL_EXISTS');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a verified user for login tests
      const user = new User({
        email: 'login@example.com',
        firstName: 'Login',
        lastName: 'User',
        role: 'user',
        isVerified: true
      });
      
      await user.setPassword('Password123!');
      await user.save();
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(loginData.email);
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'WrongPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('should return error for unverified email', async () => {
      // Create an unverified user
      const user = new User({
        email: 'unverified@example.com',
        firstName: 'Unverified',
        lastName: 'User',
        role: 'user',
        isVerified: false
      });
      
      await user.setPassword('Password123!');
      await user.save();

      const loginData = {
        email: 'unverified@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('EMAIL_NOT_VERIFIED');
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    let user;
    let refreshToken;

    beforeEach(async () => {
      // Create a user and session
      user = new User({
        email: 'refresh@example.com',
        firstName: 'Refresh',
        lastName: 'User',
        role: 'user',
        isVerified: true
      });
      
      await user.setPassword('Password123!');
      await user.save();

      // Create a session with refresh token
      refreshToken = 'valid-refresh-token';
      await Session.create({
        userId: user._id,
        refreshToken,
        userAgent: 'test-agent',
        ipAddress: '127.0.0.1',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      });
    });

    it('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Token refreshed successfully');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should return error for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /api/auth/logout', () => {
    let refreshToken;

    beforeEach(async () => {
      // Create a user and session
      const user = new User({
        email: 'logout@example.com',
        firstName: 'Logout',
        lastName: 'User',
        role: 'user',
        isVerified: true
      });
      
      await user.setPassword('Password123!');
      await user.save();

      // Create a session with refresh token
      refreshToken = 'logout-refresh-token';
      await Session.create({
        userId: user._id,
        refreshToken,
        userAgent: 'test-agent',
        ipAddress: '127.0.0.1',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      });
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Logout successful');
      
      // Verify session was removed
      const session = await Session.findOne({ refreshToken });
      expect(session).toBeNull();
    });

    it('should return success even for invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: 'non-existent-token' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
    });
  });
});
