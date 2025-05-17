/**
 * User API Tests
 * Tests for user management endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/server');
const User = require('../../src/domain/models/User');
const { generateJWT } = require('../../src/utils/jwt');

let mongoServer;
let adminUser, regularUser;
let adminToken, userToken;

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
});

describe('User API', () => {
  describe('GET /api/users', () => {
    it('should return all users for admin', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('users');
      expect(response.body.data.users.length).toBeGreaterThanOrEqual(2);
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should deny access for regular users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('FORBIDDEN');
    });

    it('should return unauthorized for missing token', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('UNAUTHORIZED');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by ID for admin', async () => {
      const response = await request(app)
        .get(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.email).toBe(regularUser.email);
    });

    it('should allow users to access their own data', async () => {
      const response = await request(app)
        .get(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.email).toBe(regularUser.email);
    });

    it('should deny access to other user data for regular users', async () => {
      const response = await request(app)
        .get(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('FORBIDDEN');
    });

    it('should return not found for non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /api/users/:id', () => {
    const updateData = {
      firstName: 'Updated',
      lastName: 'Name',
      phoneNumber: '+6281234567890',
      address: {
        street: '123 Main St',
        city: 'Jakarta',
        state: 'DKI Jakarta',
        postalCode: '12345',
        country: 'Indonesia'
      }
    };

    it('should update user for admin', async () => {
      const response = await request(app)
        .put(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('User updated successfully');
      expect(response.body.data).toBeTruthy();
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
      expect(response.body.data.phoneNumber).toBe(updateData.phoneNumber);
      expect(response.body.data.address).toMatchObject(updateData.address);
    });

    it('should allow users to update their own data', async () => {
      const response = await request(app)
        .put(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.firstName).toBe(updateData.firstName);
    });

    it('should deny updates to other user data for regular users', async () => {
      const response = await request(app)
        .put(`/api/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('FORBIDDEN');
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        firstName: '', // Empty first name
        lastName: 'Name'
      };

      const response = await request(app)
        .put(`/api/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('VALIDATION_ERROR');
    });
  });
});
