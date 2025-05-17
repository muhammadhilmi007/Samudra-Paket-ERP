/**
 * Permission API Tests
 * Tests for permission management endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Role, Permission, RolePermission, User } = require('../../src/domain/models');
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

describe('Permission API', () => {
  let mongoServer;
  let adminUser, managerUser, customerUser;
  let adminToken, managerToken, customerToken;
  let adminRole, managerRole;
  let readUserPermission, createUserPermission;
  
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
    await Permission.deleteMany({});
    await RolePermission.deleteMany({});
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
    
    // Create test permissions
    readUserPermission = await Permission.create({
      resource: 'users',
      action: 'read',
      description: 'Permission to read users',
      isSystem: true
    });
    
    createUserPermission = await Permission.create({
      resource: 'users',
      action: 'create',
      description: 'Permission to create users',
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
  
  describe('GET /api/permissions', () => {
    it('should return all permissions for admin user', async () => {
      const res = await request(app)
        .get('/api/permissions')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.permissions).toBeInstanceOf(Array);
      expect(res.body.data.permissions.length).toBe(2);
    });
    
    it('should filter permissions by resource', async () => {
      // Create additional permission with different resource
      await Permission.create({
        resource: 'roles',
        action: 'read',
        description: 'Permission to read roles',
        isSystem: true
      });
      
      const res = await request(app)
        .get('/api/permissions?resource=users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.permissions).toBeInstanceOf(Array);
      expect(res.body.data.permissions.length).toBe(2);
      expect(res.body.data.permissions.every(p => p.resource === 'users')).toBe(true);
    });
    
    it('should return 403 for non-admin user', async () => {
      const res = await request(app)
        .get('/api/permissions')
        .set('Authorization', `Bearer ${customerToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('GET /api/permissions/:id', () => {
    it('should return permission by ID for admin user', async () => {
      const res = await request(app)
        .get(`/api/permissions/${readUserPermission._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.resource).toBe('users');
      expect(res.body.data.action).toBe('read');
    });
    
    it('should return 404 for non-existent permission', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const res = await request(app)
        .get(`/api/permissions/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('POST /api/permissions', () => {
    it('should create a new permission for admin user', async () => {
      const newPermission = {
        resource: 'shipments',
        action: 'create',
        description: 'Permission to create shipments',
        attributes: { ownedByUser: true }
      };
      
      const res = await request(app)
        .post('/api/permissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newPermission);
      
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.resource).toBe('shipments');
      expect(res.body.data.action).toBe('create');
      expect(res.body.data.attributes).toEqual({ ownedByUser: true });
      
      // Verify permission was created in database
      const createdPermission = await Permission.findOne({
        resource: 'shipments',
        action: 'create'
      });
      expect(createdPermission).toBeTruthy();
    });
    
    it('should return 409 for duplicate permission', async () => {
      const duplicatePermission = {
        resource: 'users',
        action: 'read',
        description: 'Duplicate permission'
      };
      
      const res = await request(app)
        .post('/api/permissions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicatePermission);
      
      expect(res.status).toBe(409);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('PUT /api/permissions/:id', () => {
    it('should update permission for admin user', async () => {
      const updateData = {
        description: 'Updated description',
        attributes: { newAttribute: true }
      };
      
      const res = await request(app)
        .put(`/api/permissions/${readUserPermission._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.description).toBe('Updated description');
      expect(res.body.data.attributes).toEqual({ newAttribute: true });
      
      // Verify permission was updated in database
      const updatedPermission = await Permission.findById(readUserPermission._id);
      expect(updatedPermission.description).toBe('Updated description');
      expect(updatedPermission.attributes).toEqual({ newAttribute: true });
    });
    
    it('should return 403 when trying to update system permission', async () => {
      // Make permission a system permission
      readUserPermission.isSystem = true;
      await readUserPermission.save();
      
      const updateData = {
        resource: 'new-resource'
      };
      
      const res = await request(app)
        .put(`/api/permissions/${readUserPermission._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('DELETE /api/permissions/:id', () => {
    it('should delete permission for admin user', async () => {
      // Create a new permission to delete
      const permissionToDelete = await Permission.create({
        resource: 'test',
        action: 'delete',
        description: 'Permission to be deleted',
        isSystem: false
      });
      
      const res = await request(app)
        .delete(`/api/permissions/${permissionToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      
      // Verify permission was deleted from database
      const deletedPermission = await Permission.findById(permissionToDelete._id);
      expect(deletedPermission).toBeNull();
    });
    
    it('should return 403 when trying to delete system permission', async () => {
      const res = await request(app)
        .delete(`/api/permissions/${readUserPermission._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(403);
      expect(res.body.status).toBe('error');
    });
    
    it('should return 400 when trying to delete permission assigned to roles', async () => {
      // Assign permission to role
      await RolePermission.assignPermissionToRole(managerRole._id, readUserPermission._id);
      
      const res = await request(app)
        .delete(`/api/permissions/${readUserPermission._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });
  
  describe('GET /api/permissions/resource/:resource', () => {
    it('should return permissions by resource', async () => {
      const res = await request(app)
        .get('/api/permissions/resource/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data.every(p => p.resource === 'users')).toBe(true);
    });
  });
  
  describe('GET /api/permissions/role/:roleId', () => {
    it('should return permissions for role', async () => {
      // Assign permission to role
      await RolePermission.assignPermissionToRole(managerRole._id, readUserPermission._id);
      
      const res = await request(app)
        .get(`/api/permissions/role/${managerRole._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.rolePermissions).toBeInstanceOf(Array);
      expect(res.body.data.rolePermissions.length).toBe(1);
      expect(res.body.data.rolePermissions[0].permission.resource).toBe('users');
      expect(res.body.data.rolePermissions[0].permission.action).toBe('read');
    });
    
    it('should include parent role permissions when includeParents=true', async () => {
      // Assign different permissions to admin and manager roles
      await RolePermission.assignPermissionToRole(adminRole._id, createUserPermission._id);
      await RolePermission.assignPermissionToRole(managerRole._id, readUserPermission._id);
      
      const res = await request(app)
        .get(`/api/permissions/role/${managerRole._id}?includeParents=true`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.rolePermissions).toBeInstanceOf(Array);
      expect(res.body.data.rolePermissions.length).toBe(2);
    });
  });
  
  describe('POST /api/permissions/role/:roleId/permission/:permissionId', () => {
    it('should assign permission to role', async () => {
      const assignData = {
        constraints: { ownResource: true },
        granted: true
      };
      
      const res = await request(app)
        .post(`/api/permissions/role/${managerRole._id}/permission/${createUserPermission._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(assignData);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.role.toString()).toBe(managerRole._id.toString());
      expect(res.body.data.permission.toString()).toBe(createUserPermission._id.toString());
      expect(res.body.data.constraints).toEqual({ ownResource: true });
      expect(res.body.data.granted).toBe(true);
      
      // Verify assignment in database
      const rolePermission = await RolePermission.findOne({
        role: managerRole._id,
        permission: createUserPermission._id
      });
      expect(rolePermission).toBeTruthy();
      expect(rolePermission.constraints).toEqual({ ownResource: true });
    });
    
    it('should update existing permission assignment', async () => {
      // Create initial assignment
      await RolePermission.assignPermissionToRole(
        managerRole._id,
        createUserPermission._id,
        { ownResource: true },
        true
      );
      
      // Update assignment
      const updateData = {
        constraints: { ownResource: false, department: 'IT' },
        granted: false
      };
      
      const res = await request(app)
        .post(`/api/permissions/role/${managerRole._id}/permission/${createUserPermission._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.constraints).toEqual({ ownResource: false, department: 'IT' });
      expect(res.body.data.granted).toBe(false);
      
      // Verify update in database
      const rolePermission = await RolePermission.findOne({
        role: managerRole._id,
        permission: createUserPermission._id
      });
      expect(rolePermission.constraints).toEqual({ ownResource: false, department: 'IT' });
      expect(rolePermission.granted).toBe(false);
    });
  });
  
  describe('DELETE /api/permissions/role/:roleId/permission/:permissionId', () => {
    it('should revoke permission from role', async () => {
      // Create assignment to revoke
      await RolePermission.assignPermissionToRole(
        managerRole._id,
        createUserPermission._id
      );
      
      const res = await request(app)
        .delete(`/api/permissions/role/${managerRole._id}/permission/${createUserPermission._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      
      // Verify assignment was removed from database
      const rolePermission = await RolePermission.findOne({
        role: managerRole._id,
        permission: createUserPermission._id
      });
      expect(rolePermission).toBeNull();
    });
    
    it('should return 404 for non-existent assignment', async () => {
      const res = await request(app)
        .delete(`/api/permissions/role/${managerRole._id}/permission/${createUserPermission._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });
});
