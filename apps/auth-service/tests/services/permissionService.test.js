/**
 * Permission Service Tests
 * Tests for the permission service
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Role, Permission, RolePermission, UserRole, User } = require('../../src/domain/models');
const permissionService = require('../../src/application/services/permissionService');
const redisMock = require('redis-mock');

// Mock Redis client
jest.mock('../../src/config/redis', () => ({
  getRedisClient: jest.fn().mockReturnValue(redisMock.createClient())
}));

describe('Permission Service', () => {
  let mongoServer;
  let adminUser, managerUser, customerUser;
  let adminRole, managerRole, customerRole;
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
    await UserRole.deleteMany({});
    await User.deleteMany({});
    
    // Create test users
    adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      username: 'admin',
      password: 'password',
      role: 'admin',
      isActive: true,
      isVerified: true
    });
    
    managerUser = await User.create({
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@example.com',
      username: 'manager',
      password: 'password',
      role: 'manager',
      isActive: true,
      isVerified: true
    });
    
    customerUser = await User.create({
      firstName: 'Customer',
      lastName: 'User',
      email: 'customer@example.com',
      username: 'customer',
      password: 'password',
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
    
    // Assign permissions to roles
    await RolePermission.assignPermissionToRole(managerRole._id, readUserPermission._id);
    
    // Assign roles to users
    await UserRole.assignRoleToUser(adminUser._id, adminRole._id);
    await UserRole.assignRoleToUser(managerUser._id, managerRole._id);
    await UserRole.assignRoleToUser(customerUser._id, customerRole._id);
  });
  
  describe('hasPermission', () => {
    it('should return true for admin user regardless of permission', async () => {
      const result = await permissionService.hasPermission(
        adminUser._id,
        'users',
        'create'
      );
      
      expect(result).toBe(true);
    });
    
    it('should return true for user with role that has permission', async () => {
      const result = await permissionService.hasPermission(
        managerUser._id,
        'users',
        'read'
      );
      
      expect(result).toBe(true);
    });
    
    it('should return false for user with role that does not have permission', async () => {
      const result = await permissionService.hasPermission(
        managerUser._id,
        'users',
        'create'
      );
      
      expect(result).toBe(false);
    });
    
    it('should return false for user without any roles', async () => {
      // Remove all roles from customer user
      await UserRole.deleteMany({ user: customerUser._id });
      
      const result = await permissionService.hasPermission(
        customerUser._id,
        'users',
        'read'
      );
      
      expect(result).toBe(false);
    });
    
    it('should return false for non-existent user', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();
      
      const result = await permissionService.hasPermission(
        nonExistentUserId,
        'users',
        'read'
      );
      
      expect(result).toBe(false);
    });
    
    it('should return false for non-existent permission', async () => {
      const result = await permissionService.hasPermission(
        managerUser._id,
        'non-existent',
        'action'
      );
      
      expect(result).toBe(false);
    });
    
    it('should handle context-based permissions', async () => {
      // Create permission with attributes
      const ownUserPermission = await Permission.create({
        resource: 'users',
        action: 'update',
        attributes: { ownResource: true },
        description: 'Permission to update own user',
        isSystem: true
      });
      
      // Assign permission to customer role
      await RolePermission.assignPermissionToRole(
        customerRole._id,
        ownUserPermission._id,
        { ownResource: true }
      );
      
      // Test with matching context (own resource)
      const resultOwn = await permissionService.hasPermission(
        customerUser._id,
        'users',
        'update',
        { ownResource: true }
      );
      
      expect(resultOwn).toBe(true);
      
      // Test with non-matching context (not own resource)
      const resultOther = await permissionService.hasPermission(
        customerUser._id,
        'users',
        'update',
        { ownResource: false }
      );
      
      expect(resultOther).toBe(false);
    });
  });
  
  describe('hasAnyPermission', () => {
    it('should return true if user has at least one permission', async () => {
      const result = await permissionService.hasAnyPermission(
        managerUser._id,
        [
          { resource: 'users', action: 'read' },
          { resource: 'users', action: 'create' }
        ]
      );
      
      expect(result).toBe(true);
    });
    
    it('should return false if user has none of the permissions', async () => {
      const result = await permissionService.hasAnyPermission(
        customerUser._id,
        [
          { resource: 'users', action: 'read' },
          { resource: 'users', action: 'create' }
        ]
      );
      
      expect(result).toBe(false);
    });
  });
  
  describe('hasAllPermissions', () => {
    it('should return true if user has all permissions', async () => {
      // Assign create user permission to manager role
      await RolePermission.assignPermissionToRole(managerRole._id, createUserPermission._id);
      
      const result = await permissionService.hasAllPermissions(
        managerUser._id,
        [
          { resource: 'users', action: 'read' },
          { resource: 'users', action: 'create' }
        ]
      );
      
      expect(result).toBe(true);
    });
    
    it('should return false if user is missing any permission', async () => {
      const result = await permissionService.hasAllPermissions(
        managerUser._id,
        [
          { resource: 'users', action: 'read' },
          { resource: 'users', action: 'create' }
        ]
      );
      
      expect(result).toBe(false);
    });
  });
  
  describe('getUserPermissions', () => {
    it('should return all permissions for admin user', async () => {
      const permissions = await permissionService.getUserPermissions(adminUser._id);
      
      expect(permissions.length).toBeGreaterThanOrEqual(2);
      expect(permissions.some(p => p.resource === 'users' && p.action === 'read')).toBe(true);
      expect(permissions.some(p => p.resource === 'users' && p.action === 'create')).toBe(true);
    });
    
    it('should return role-specific permissions for regular user', async () => {
      const permissions = await permissionService.getUserPermissions(managerUser._id);
      
      expect(permissions.length).toBe(1);
      expect(permissions[0].resource).toBe('users');
      expect(permissions[0].action).toBe('read');
    });
    
    it('should return empty array for user without permissions', async () => {
      const permissions = await permissionService.getUserPermissions(customerUser._id);
      
      expect(permissions.length).toBe(0);
    });
  });
  
  describe('clearPermissionCache', () => {
    it('should clear permission cache for user', async () => {
      // Set up Redis mock
      const redisClient = require('../../src/config/redis').getRedisClient();
      const setexSpy = jest.spyOn(redisClient, 'setex');
      const delSpy = jest.spyOn(redisClient, 'del');
      
      // Cache a permission
      await permissionService.hasPermission(
        managerUser._id,
        'users',
        'read'
      );
      
      expect(setexSpy).toHaveBeenCalled();
      
      // Clear cache
      await permissionService.clearPermissionCache(managerUser._id);
      
      expect(delSpy).toHaveBeenCalled();
    });
  });
});
