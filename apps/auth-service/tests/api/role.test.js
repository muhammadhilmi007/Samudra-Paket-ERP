/**
 * Role API Tests
 * Tests for role management endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Role, User } = require('../../src/domain/models');
const jwt = require('jsonwebtoken');
const config = require('../../src/config');

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

describe('Role API', () => {
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
  
  describe('GET /api/roles', () => {
    it('should return all roles for admin user', async () => {
      const res = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.roles).toBeInstanceOf(Array);
      expect(res.body.data.roles.length).toBe(3);
    });
    
    it('should return 403 for non-admin user', async () => {
      const res = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${customerToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
    });
    
    it('should return 401 for unauthenticated request', async () => {
      const res = await request(app)
        .get('/api/roles');
      
      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('GET /api/roles/:id', () => {
    it('should return role by ID for admin user', async () => {
      const res = await request(app)
        .get(`/api/roles/${adminRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.name).toBe('admin');
    });
    
    it('should return 404 for non-existent role', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .get(`/api/roles/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('POST /api/roles', () => {
    it('should create a new role for admin user', async () => {
      const newRole = {
        name: 'test-role',
        description: 'Test role',
        parent: managerRole._id.toString()
      };
      
      const res = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newRole);
      
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.name).toBe('test-role');
      expect(res.body.data.description).toBe('Test role');
      expect(res.body.data.parent.toString()).toBe(managerRole._id.toString());
      
      // Verify role was created in database
      const createdRole = await Role.findOne({ name: 'test-role' });
      expect(createdRole).toBeTruthy();
    });
    
    it('should return 409 for duplicate role name', async () => {
      const duplicateRole = {
        name: 'admin',
        description: 'Duplicate admin role'
      };
      
      const res = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicateRole);
      
      expect(res.status).toBe(409);
      expect(res.body.status).toBe('error');
    });
    
    it('should return 400 for invalid parent role', async () => {
      const invalidRole = {
        name: 'invalid-parent-role',
        description: 'Role with invalid parent',
        parent: new mongoose.Types.ObjectId()
      };
      
      const res = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidRole);
      
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('PUT /api/roles/:id', () => {
    it('should update role for admin user', async () => {
      const updateData = {
        description: 'Updated description'
      };
      
      const res = await request(app)
        .put(`/api/roles/${managerRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.description).toBe('Updated description');
      
      // Verify role was updated in database
      const updatedRole = await Role.findById(managerRole._id);
      expect(updatedRole.description).toBe('Updated description');
    });
    
    it('should return 403 when trying to update system role', async () => {
      // Make admin role a system role
      adminRole.isSystem = true;
      await adminRole.save();
      
      const updateData = {
        name: 'new-admin-name'
      };
      
      const res = await request(app)
        .put(`/api/roles/${adminRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
    });
    
    it('should return 400 when creating circular dependency', async () => {
      const updateData = {
        parent: customerRole._id.toString()
      };
      
      // First make customer role a child of manager
      customerRole.parent = managerRole._id;
      await customerRole.save();
      
      const res = await request(app)
        .put(`/api/roles/${managerRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('DELETE /api/roles/:id', () => {
    it('should delete role for admin user', async () => {
      // Create a new role to delete
      const roleToDelete = await Role.create({
        name: 'role-to-delete',
        description: 'Role to be deleted',
        isSystem: false
      });
      
      const res = await request(app)
        .delete(`/api/roles/${roleToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      
      // Verify role was deleted from database
      const deletedRole = await Role.findById(roleToDelete._id);
      expect(deletedRole).toBeNull();
    });
    
    it('should return 403 when trying to delete system role', async () => {
      const res = await request(app)
        .delete(`/api/roles/${adminRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
    });
    
    it('should return 400 when trying to delete role with child roles', async () => {
      // Create a new parent role and child role
      const parentRole = await Role.create({
        name: 'parent-role',
        description: 'Parent role',
        isSystem: false
      });
      
      await Role.create({
        name: 'child-role',
        description: 'Child role',
        parent: parentRole._id,
        isSystem: false
      });
      
      const res = await request(app)
        .delete(`/api/roles/${parentRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('GET /api/roles/hierarchy', () => {
    it('should return role hierarchy for admin user', async () => {
      const res = await request(app)
        .get('/api/roles/hierarchy')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.hierarchy).toBeInstanceOf(Array);
      
      // Verify hierarchy structure
      const adminRoleInHierarchy = res.body.data.hierarchy.find(r => r.name === 'admin');
      expect(adminRoleInHierarchy).toBeTruthy();
      expect(adminRoleInHierarchy.children).toBeInstanceOf(Array);
      
      // Manager should be a child of admin
      const managerInChildren = adminRoleInHierarchy.children.find(r => r.name === 'manager');
      expect(managerInChildren).toBeTruthy();
    });
  });
});
