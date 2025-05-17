/**
 * Authentication Integration Tests
 * Tests the complete authentication flow from API to database
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createClient } = require('redis-mock');

// Models
const User = require('../../domain/models/User');
const Session = require('../../domain/models/Session');
const SecurityLog = require('../../domain/models/SecurityLog');

// Routes
const authRoutes = require('../../api/routes/authRoutes');
const userRoutes = require('../../api/routes/userRoutes');
const sessionRoutes = require('../../api/routes/sessionRoutes');

// Middlewares
const errorMiddleware = require('../../api/middlewares/errorMiddleware');

// Config
const config = require('../../config');

// Redis mock
jest.mock('ioredis', () => require('redis-mock'));

// Create express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use(errorMiddleware);

// Test user data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  username: 'testuser',
  password: 'Password123!',
  role: 'customer'
};

let mongoServer;
let accessToken;
let refreshToken;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  // Set environment variables
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';
  process.env.JWT_EXPIRATION = '15m';
  process.env.JWT_REFRESH_EXPIRATION = '7d';
});

afterAll(async () => {
  // Disconnect and stop MongoDB server
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear database collections
  await User.deleteMany({});
  await Session.deleteMany({});
  await SecurityLog.deleteMany({});
});

describe('Authentication Integration Tests', () => {
  describe('Registration Flow', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      // Assertions
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('registered successfully');
      expect(res.body.data).toBeDefined();
      
      // Check if user was created in database
      const user = await User.findOne({ username: testUser.username });
      expect(user).toBeDefined();
      expect(user.email).toBe(testUser.email);
      expect(user.firstName).toBe(testUser.firstName);
      expect(user.lastName).toBe(testUser.lastName);
      expect(user.role).toBe(testUser.role);
      
      // Verify password was hashed
      const passwordMatch = await bcrypt.compare(testUser.password, user.password);
      expect(passwordMatch).toBe(true);
      
      // Check if security log was created
      const securityLog = await SecurityLog.findOne({ userId: user._id });
      expect(securityLog).toBeDefined();
      expect(securityLog.eventType).toBe('ACCOUNT_CREATED');
    });
    
    it('should not register a user with duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      // Second registration with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('already exists');
    });
    
    it('should not register a user with invalid data', async () => {
      const invalidUser = {
        firstName: 'T', // Too short
        lastName: '', // Empty
        email: 'invalid-email', // Invalid format
        username: 'tu', // Too short
        password: '123', // Too short
        role: 'invalid-role' // Invalid role
      };
      
      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);
      
      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('VALIDATION_ERROR');
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });
  
  describe('Login Flow', () => {
    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });
    
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('Login successful');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user).toBeDefined();
      
      // Save tokens for later tests
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
      
      // Verify JWT token
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      expect(decoded.username).toBe(testUser.username);
      expect(decoded.role).toBe(testUser.role);
      
      // Check if session was created
      const user = await User.findOne({ username: testUser.username });
      const session = await Session.findOne({ userId: user._id });
      expect(session).toBeDefined();
      expect(session.refreshToken).toBeDefined();
      
      // Check if security log was created
      const securityLog = await SecurityLog.findOne({ 
        userId: user._id,
        eventType: 'LOGIN_SUCCESS'
      });
      expect(securityLog).toBeDefined();
    });
    
    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'WrongPassword123!'
        });
      
      // Assertions
      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('INVALID_CREDENTIALS');
      
      // Check if security log was created
      const user = await User.findOne({ username: testUser.username });
      const securityLog = await SecurityLog.findOne({ 
        userId: user._id,
        eventType: 'LOGIN_FAILURE'
      });
      expect(securityLog).toBeDefined();
    });
    
    it('should lock account after multiple failed login attempts', async () => {
      // Configure max login attempts
      const MAX_LOGIN_ATTEMPTS = 3;
      process.env.MAX_LOGIN_ATTEMPTS = MAX_LOGIN_ATTEMPTS;
      
      // Make multiple failed login attempts
      for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            username: testUser.username,
            password: 'WrongPassword123!'
          });
      }
      
      // Try one more time
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'WrongPassword123!'
        });
      
      // Assertions
      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('ACCOUNT_LOCKED');
      
      // Check if user account is locked
      const user = await User.findOne({ username: testUser.username });
      expect(user.isLocked).toBe(true);
      expect(user.lockedUntil).toBeDefined();
      
      // Check if security log was created
      const securityLog = await SecurityLog.findOne({ 
        userId: user._id,
        eventType: 'ACCOUNT_LOCK'
      });
      expect(securityLog).toBeDefined();
    });
  });
  
  describe('Token Refresh Flow', () => {
    beforeEach(async () => {
      // Create test user and login
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });
      
      accessToken = loginRes.body.data.accessToken;
      refreshToken = loginRes.body.data.refreshToken;
    });
    
    it('should refresh token with valid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('Token refreshed');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      
      // Verify new JWT token
      const decoded = jwt.verify(res.body.data.accessToken, process.env.JWT_SECRET);
      expect(decoded.username).toBe(testUser.username);
      
      // Check if session was updated
      const user = await User.findOne({ username: testUser.username });
      const session = await Session.findOne({ userId: user._id });
      expect(session).toBeDefined();
      expect(session.refreshToken).toBe(res.body.data.refreshToken);
    });
    
    it('should not refresh token with invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'invalid-refresh-token' });
      
      // Assertions
      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('INVALID_TOKEN');
    });
  });
  
  describe('Logout Flow', () => {
    beforeEach(async () => {
      // Create test user and login
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });
      
      accessToken = loginRes.body.data.accessToken;
      refreshToken = loginRes.body.data.refreshToken;
    });
    
    it('should logout with valid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('Logout successful');
      
      // Check if session was removed
      const user = await User.findOne({ username: testUser.username });
      const session = await Session.findOne({ 
        userId: user._id,
        refreshToken
      });
      expect(session).toBeNull();
      
      // Check if security log was created
      const securityLog = await SecurityLog.findOne({ 
        userId: user._id,
        eventType: 'LOGOUT'
      });
      expect(securityLog).toBeDefined();
    });
    
    it('should not logout with invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: 'invalid-refresh-token' });
      
      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('Password Reset Flow', () => {
    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });
    
    it('should request password reset with valid email', async () => {
      // Mock email service
      jest.spyOn(require('../../application/services/emailService'), 'sendEmail')
        .mockResolvedValue({ messageId: 'test-message-id' });
      
      const res = await request(app)
        .post('/api/auth/request-password-reset')
        .send({ email: testUser.email });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('If your email is registered');
      
      // Check if reset token was generated
      const user = await User.findOne({ email: testUser.email });
      expect(user.resetPasswordToken).toBeDefined();
      expect(user.resetPasswordExpires).toBeDefined();
      
      // Check if security log was created
      const securityLog = await SecurityLog.findOne({ 
        userId: user._id,
        eventType: 'PASSWORD_RESET_REQUESTED'
      });
      expect(securityLog).toBeDefined();
    });
    
    it('should reset password with valid token', async () => {
      // First request password reset
      jest.spyOn(require('../../application/services/emailService'), 'sendEmail')
        .mockResolvedValue({ messageId: 'test-message-id' });
      
      await request(app)
        .post('/api/auth/request-password-reset')
        .send({ email: testUser.email });
      
      // Get reset token from database
      const user = await User.findOne({ email: testUser.email });
      const resetToken = user.resetPasswordToken;
      
      // Reset password
      const newPassword = 'NewPassword123!';
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ 
          token: resetToken,
          password: newPassword
        });
      
      // Assertions
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('Password reset successful');
      
      // Check if password was updated
      const updatedUser = await User.findOne({ email: testUser.email });
      expect(updatedUser.resetPasswordToken).toBeNull();
      expect(updatedUser.resetPasswordExpires).toBeNull();
      
      // Verify new password works
      const passwordMatch = await bcrypt.compare(newPassword, updatedUser.password);
      expect(passwordMatch).toBe(true);
      
      // Check if security log was created
      const securityLog = await SecurityLog.findOne({ 
        userId: user._id,
        eventType: 'PASSWORD_RESET_COMPLETED'
      });
      expect(securityLog).toBeDefined();
      
      // Try login with new password
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: newPassword
        });
      
      expect(loginRes.status).toBe(200);
      expect(loginRes.body.status).toBe('success');
    });
    
    it('should not reset password with invalid token', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ 
          token: 'invalid-token',
          password: 'NewPassword123!'
        });
      
      // Assertions
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.code).toBe('INVALID_TOKEN');
    });
  });
});
