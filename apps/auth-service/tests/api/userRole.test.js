/**
 * User Role API Tests
 * Tests for user role management endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Role, User, UserRole } = require('../../src/domain/models');
const jwt = require('jsonwebtoken');
const config = require('../../src/config');
const bcrypt = require('bcrypt');

// Mock Redis client
jest.mock('../../src/config/redis', () => ({
  getRedisClient: jest.fn().mockReturnValue({
    get: jest.fn().mockResolvedValue(null),
    setex: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    keys: jest.fn().mockResolvedValue([])
  })
}));

// Import app after mocking dependencies
const app = require('../../src/app');

describe('User Role API', () => {
  let mongoServer;
  let adminUser, managerUser, customerUser;
  let adminToken, managerToken, customerToken;
  let adminRole, managerRole, customerRole;
  
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Connect to in-memory database
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });
  
  afterAll(async () => {
    // Disconnect from database
    await mongoose.disconnect();
    
    // Stop in-memory server
    await mongoServer.stop();
  });
  
  beforeEach(async () => {
    // Clear database collections
    await Role.deleteMany({});
    await User.deleteMany({});
    await UserRole.deleteMany({});
    
    // Create test users
    adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      username: 'admin',
      password: await bcrypt.hash('password', 10),
      role: 'admin',
      isActive: true,
      isVerified: true
    });
    
    managerUser = await User.create({
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@example.com',
      username: 'manager',
      password: await bcrypt.hash('password', 10),
      role: 'manager',
      isActive: true,
      isVerified: true
    });
    
    customerUser = await User.create({
      firstName: 'Customer',
      lastName: 'User',
      email: 'customer@example.com',
      username: 'customer',
      password: await bcrypt.hash('password', 10),
      role: 'customer',
      isActive: true,
      isVerified: true
    });
    
    // Create test roles
    adminRole = await Role.create({
      name: 'admin',
      description: 'Administrator with full system access',
      level: 0,
      isSystem: true
    });
    
    managerRole = await Role.create({
      name: 'manager',
      description: 'Manager with access to operations and reporting',
      level: 1,
      isSystem: true,
      parent: adminRole._id
    });
    
    customerRole = await Role.create({
      name: 'customer',
      description: 'Customer with limited access to own shipments',
      level: 3,
      isSystem: true
    });
    
    // Generate JWT tokens
    adminToken = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
    
    managerToken = jwt.sign(
      { id: managerUser._id, role: managerUser.role },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
    
    customerToken = jwt.sign(
      { id: customerUser._id, role: customerUser.role },
      config.jwt.secret,
      { expiresIn: '1h' }
    );
  });
  
  describe('GET /api/user-roles/user/:userId', () => {
    it('should return roles for user', async () => {
      // Assign roles to user
      await UserRole.assignRoleToUser(managerUser._id, adminRole._id);
      await UserRole.assignRoleToUser(managerUser._id, customerRole._id);
      
      const res = await request(app)
        .get(`/api/user-roles/user/${managerUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.userRoles).toBeInstanceOf(Array);
      expect(res.body.data.userRoles.length).toBe(2);
    });
    
    it('should return 404 for non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .get(`/api/user-roles/user/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
    });
    
    it('should return 403 for unauthorized user', async () => {
      const res = await request(app)
        .get(`/api/user-roles/user/${managerUser._id}`)
        .set('Authorization', `Bearer ${customerToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('GET /api/user-roles/role/:roleId', () => {
    it('should return users with role', async () => {
      // Assign role to multiple users
      await UserRole.assignRoleToUser(managerUser._id, adminRole._id);
      await UserRole.assignRoleToUser(customerUser._id, adminRole._id);
      
      const res = await request(app)
        .get(`/api/user-roles/role/${adminRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.users).toBeInstanceOf(Array);
      expect(res.body.data.users.length).toBe(2);
    });
    
    it('should return 404 for non-existent role', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .get(`/api/user-roles/role/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('POST /api/user-roles/user/:userId/role/:roleId', () => {
    it('should assign role to user', async () => {
      const assignData = {
        scope: { department: 'IT' },
        expiresAt: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
        isActive: true
      };
      
      const res = await request(app)
        .post(`/api/user-roles/user/${customerUser._id}/role/${managerRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(assignData);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.toString()).toBe(customerUser._id.toString());
      expect(res.body.data.role.toString()).toBe(managerRole._id.toString());
      expect(res.body.data.scope).toEqual({ department: 'IT' });
      expect(res.body.data.isActive).toBe(true);
      
      // Verify assignment in database
      const userRole = await UserRole.findOne({
        user: customerUser._id,
        role: managerRole._id
      });
      expect(userRole).toBeTruthy();
      expect(userRole.scope).toEqual({ department: 'IT' });
    });
    
    it('should update existing role assignment', async () => {
      // Create initial assignment
      await UserRole.assignRoleToUser(
        customerUser._id,
        managerRole._id,
        { scope: { department: 'IT' } }
      );
      
      // Update assignment
      const updateData = {
        scope: { department: 'HR' },
        isActive: false
      };
      
      const res = await request(app)
        .post(`/api/user-roles/user/${customerUser._id}/role/${managerRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.scope).toEqual({ department: 'HR' });
      expect(res.body.data.isActive).toBe(false);
      
      // Verify update in database
      const userRole = await UserRole.findOne({
        user: customerUser._id,
        role: managerRole._id
      });
      expect(userRole.scope).toEqual({ department: 'HR' });
      expect(userRole.isActive).toBe(false);
    });
    
    it('should return 404 for non-existent user', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .post(`/api/user-roles/user/${nonExistentId}/role/${managerRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
    });
    
    it('should return 404 for non-existent role', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .post(`/api/user-roles/user/${customerUser._id}/role/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('PUT /api/user-roles/user/:userId/role/:roleId', () => {
    it('should update user role', async () => {
      // Create initial assignment
      await UserRole.assignRoleToUser(
        customerUser._id,
        managerRole._id,
        { scope: { department: 'IT' } }
      );
      
      // Update assignment
      const updateData = {
        scope: { department: 'HR', location: 'HQ' },
        expiresAt: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
        isActive: false
      };
      
      const res = await request(app)
        .put(`/api/user-roles/user/${customerUser._id}/role/${managerRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.scope).toEqual({ department: 'HR', location: 'HQ' });
      expect(res.body.data.isActive).toBe(false);
      
      // Verify update in database
      const userRole = await UserRole.findOne({
        user: customerUser._id,
        role: managerRole._id
      });
      expect(userRole.scope).toEqual({ department: 'HR', location: 'HQ' });
      expect(userRole.isActive).toBe(false);
    });
    
    it('should return 404 for non-existent assignment', async () => {
      const res = await request(app)
        .put(`/api/user-roles/user/${customerUser._id}/role/${managerRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false });
      
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('DELETE /api/user-roles/user/:userId/role/:roleId', () => {
    it('should revoke role from user', async () => {
      // Create assignment to revoke
      await UserRole.assignRoleToUser(
        customerUser._id,
        managerRole._id
      );
      
      const res = await request(app)
        .delete(`/api/user-roles/user/${customerUser._id}/role/${managerRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      
      // Verify assignment was removed from database
      const userRole = await UserRole.findOne({
        user: customerUser._id,
        role: managerRole._id
      });
      expect(userRole).toBeNull();
    });
    
    it('should return 404 for non-existent assignment', async () => {
      const res = await request(app)
        .delete(`/api/user-roles/user/${customerUser._id}/role/${managerRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });
});
