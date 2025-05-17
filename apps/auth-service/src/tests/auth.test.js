/**
 * Authentication Service Tests
 * Tests authentication-related functionality
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { User } = require('../domain/models/User');
const { Session } = require('../domain/models/Session');
const { connectToMongoDB } = require('../infrastructure/database/connection');
const { connectToRedis, disconnectRedis } = require('../infrastructure/database/redis');

// Test user data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  username: 'testuser',
  password: 'Password123!',
  role: 'customer'
};

// Store tokens for tests
let accessToken;
let refreshToken;

// Connect to databases before tests
beforeAll(async () => {
  // Connect to MongoDB test database
  await connectToMongoDB();
  
  // Connect to Redis
  await connectToRedis();
  
  // Clear test data
  await User.deleteMany({});
  await Session.deleteMany({});
});

// Disconnect after tests
afterAll(async () => {
  // Disconnect from Redis
  await disconnectRedis();
  
  // Disconnect from MongoDB
  await mongoose.connection.close();
});

// Registration tests
describe('User Registration', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.email).toBe(testUser.email);
    expect(res.body.data).not.toHaveProperty('password');
  });
  
  it('should not register a user with existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.status).toBe(409);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('CONFLICT');
  });
  
  it('should not register a user with invalid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: '123'
      });
    
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.errors).toBeDefined();
  });
});

// Login tests
describe('User Login', () => {
  it('should login a user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: testUser.username,
        password: testUser.password
      });
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data).toHaveProperty('user');
    
    // Store tokens for later tests
    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });
  
  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: testUser.username,
        password: 'wrongpassword'
      });
    
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('UNAUTHORIZED');
  });
});

// Token refresh tests
describe('Token Refresh', () => {
  it('should refresh token with valid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken });
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    
    // Update tokens
    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });
  
  it('should not refresh token with invalid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refreshToken: 'invalid-token' });
    
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('UNAUTHORIZED');
  });
});

// Protected route tests
describe('Protected Routes', () => {
  it('should access protected route with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toBe(testUser.email);
  });
  
  it('should not access protected route without token', async () => {
    const res = await request(app)
      .get('/api/auth/me');
    
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('UNAUTHORIZED');
  });
  
  it('should not access protected route with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('UNAUTHORIZED');
  });
});

// Logout tests
describe('User Logout', () => {
  it('should logout a user with valid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken });
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });
  
  it('should not allow using access token after logout', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.code).toBe('UNAUTHORIZED');
  });
});
