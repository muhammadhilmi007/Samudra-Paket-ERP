/**
 * Role and Permission Seeder
 * Seeds initial roles and permissions for the RBAC system
 */

const mongoose = require('mongoose');
const { Role, Permission, RolePermission, UserRole, User } = require('../../../domain/models');
const { logger } = require('../../../utils/logger');

/**
 * Default resources and their actions
 */
const defaultResources = {
  users: ['create', 'read', 'update', 'delete', 'list'],
  roles: ['create', 'read', 'update', 'delete', 'list'],
  permissions: ['create', 'read', 'update', 'delete', 'list'],
  user_roles: ['create', 'read', 'update', 'delete', 'list'],
  sessions: ['read', 'revoke', 'list'],
  security_logs: ['read', 'list'],
  shipments: ['create', 'read', 'update', 'delete', 'list', 'track'],
  pickups: ['create', 'read', 'update', 'delete', 'list', 'assign', 'complete'],
  deliveries: ['create', 'read', 'update', 'delete', 'list', 'assign', 'complete'],
  payments: ['create', 'read', 'update', 'delete', 'list', 'process'],
  reports: ['generate', 'read', 'export', 'list']
};

/**
 * Default roles with their descriptions and hierarchy
 */
const defaultRoles = [
  {
    name: 'admin',
    description: 'Administrator with full system access',
    level: 0,
    isSystem: true
  },
  {
    name: 'manager',
    description: 'Manager with access to operations and reporting',
    level: 1,
    isSystem: true,
    parent: 'admin'
  },
  {
    name: 'courier',
    description: 'Courier responsible for pickups',
    level: 2,
    isSystem: true,
    parent: 'manager'
  },
  {
    name: 'driver',
    description: 'Driver responsible for deliveries',
    level: 2,
    isSystem: true,
    parent: 'manager'
  },
  {
    name: 'warehouse',
    description: 'Warehouse staff responsible for shipment processing',
    level: 2,
    isSystem: true,
    parent: 'manager'
  },
  {
    name: 'collector',
    description: 'Collector responsible for payment collection',
    level: 2,
    isSystem: true,
    parent: 'manager'
  },
  {
    name: 'customer',
    description: 'Customer with limited access to own shipments',
    level: 3,
    isSystem: true
  }
];

/**
 * Role-specific permissions
 */
const rolePermissions = {
  admin: {
    // Admin has all permissions
    all: true
  },
  manager: {
    users: ['read', 'update', 'list'],
    roles: ['read', 'list'],
    permissions: ['read', 'list'],
    user_roles: ['read', 'list'],
    sessions: ['read', 'revoke', 'list'],
    security_logs: ['read', 'list'],
    shipments: ['create', 'read', 'update', 'delete', 'list', 'track'],
    pickups: ['create', 'read', 'update', 'delete', 'list', 'assign', 'complete'],
    deliveries: ['create', 'read', 'update', 'delete', 'list', 'assign', 'complete'],
    payments: ['create', 'read', 'update', 'delete', 'list', 'process'],
    reports: ['generate', 'read', 'export', 'list']
  },
  courier: {
    users: ['read'],
    shipments: ['read', 'update', 'list', 'track'],
    pickups: ['read', 'update', 'list', 'complete'],
    sessions: ['read'],
    security_logs: ['read']
  },
  driver: {
    users: ['read'],
    shipments: ['read', 'update', 'list', 'track'],
    deliveries: ['read', 'update', 'list', 'complete'],
    sessions: ['read'],
    security_logs: ['read']
  },
  warehouse: {
    users: ['read'],
    shipments: ['read', 'update', 'list', 'track'],
    pickups: ['read', 'list'],
    deliveries: ['read', 'list'],
    sessions: ['read'],
    security_logs: ['read']
  },
  collector: {
    users: ['read'],
    shipments: ['read', 'list', 'track'],
    payments: ['read', 'update', 'list', 'process'],
    sessions: ['read'],
    security_logs: ['read']
  },
  customer: {
    shipments: ['create', 'read', 'list', 'track'],
    pickups: ['create', 'read', 'list'],
    payments: ['read', 'list'],
    sessions: ['read']
  }
};

/**
 * Create default permissions
 * @returns {Promise<Object>} - Map of permission keys to permission objects
 */
const createDefaultPermissions = async () => {
  logger.info('Creating default permissions...');
  
  const permissionMap = {};
  
  // Create permissions for each resource and action
  for (const [resource, actions] of Object.entries(defaultResources)) {
    for (const action of actions) {
      const permissionKey = `${resource}:${action}`;
      
      // Check if permission already exists
      let permission = await Permission.findOne({ resource, action });
      
      if (!permission) {
        // Create permission
        permission = await Permission.create({
          resource,
          action,
          description: `Permission to ${action} ${resource}`,
          isSystem: true
        });
        
        logger.info(`Created permission: ${permissionKey}`);
      } else {
        logger.info(`Permission already exists: ${permissionKey}`);
      }
      
      permissionMap[permissionKey] = permission;
    }
  }
  
  return permissionMap;
};

/**
 * Create default roles
 * @returns {Promise<Object>} - Map of role names to role objects
 */
const createDefaultRoles = async () => {
  logger.info('Creating default roles...');
  
  const roleMap = {};
  
  // First pass: Create roles without parent references
  for (const roleData of defaultRoles) {
    const { name, description, level, isSystem } = roleData;
    
    // Check if role already exists
    let role = await Role.findOne({ name });
    
    if (!role) {
      // Create role without parent reference
      role = await Role.create({
        name,
        description,
        level,
        isSystem
      });
      
      logger.info(`Created role: ${name}`);
    } else {
      logger.info(`Role already exists: ${name}`);
    }
    
    roleMap[name] = role;
  }
  
  // Second pass: Update roles with parent references
  for (const roleData of defaultRoles) {
    if (roleData.parent) {
      const role = roleMap[roleData.name];
      const parentRole = roleMap[roleData.parent];
      
      if (role && parentRole) {
        role.parent = parentRole._id;
        await role.save();
        logger.info(`Updated role ${roleData.name} with parent ${roleData.parent}`);
      }
    }
  }
  
  return roleMap;
};

/**
 * Assign permissions to roles
 * @param {Object} roleMap - Map of role names to role objects
 * @param {Object} permissionMap - Map of permission keys to permission objects
 * @returns {Promise<void>}
 */
const assignPermissionsToRoles = async (roleMap, permissionMap) => {
  logger.info('Assigning permissions to roles...');
  
  for (const [roleName, permissionConfig] of Object.entries(rolePermissions)) {
    const role = roleMap[roleName];
    
    if (!role) {
      logger.warn(`Role not found: ${roleName}`);
      continue;
    }
    
    if (permissionConfig.all) {
      // Assign all permissions to role
      for (const [permissionKey, permission] of Object.entries(permissionMap)) {
        await RolePermission.assignPermissionToRole(role._id, permission._id);
        logger.info(`Assigned permission ${permissionKey} to role ${roleName}`);
      }
    } else {
      // Assign specific permissions to role
      for (const [resource, actions] of Object.entries(permissionConfig)) {
        for (const action of actions) {
          const permissionKey = `${resource}:${action}`;
          const permission = permissionMap[permissionKey];
          
          if (!permission) {
            logger.warn(`Permission not found: ${permissionKey}`);
            continue;
          }
          
          await RolePermission.assignPermissionToRole(role._id, permission._id);
          logger.info(`Assigned permission ${permissionKey} to role ${roleName}`);
        }
      }
    }
  }
};

/**
 * Assign admin role to admin users
 * @param {Object} roleMap - Map of role names to role objects
 * @returns {Promise<void>}
 */
const assignAdminRoleToAdminUsers = async (roleMap) => {
  logger.info('Assigning admin role to admin users...');
  
  const adminRole = roleMap['admin'];
  
  if (!adminRole) {
    logger.warn('Admin role not found');
    return;
  }
  
  // Find all admin users
  const adminUsers = await User.find({ role: 'admin' });
  
  for (const user of adminUsers) {
    // Check if user already has admin role
    const existingUserRole = await UserRole.findOne({
      user: user._id,
      role: adminRole._id
    });
    
    if (!existingUserRole) {
      // Assign admin role to user
      await UserRole.assignRoleToUser(user._id, adminRole._id);
      logger.info(`Assigned admin role to user ${user.email}`);
    } else {
      logger.info(`User ${user.email} already has admin role`);
    }
  }
};

/**
 * Seed roles and permissions
 * @returns {Promise<void>}
 */
const seedRolesAndPermissions = async () => {
  try {
    logger.info('Starting role and permission seeder...');
    
    // Create default permissions
    const permissionMap = await createDefaultPermissions();
    
    // Create default roles
    const roleMap = await createDefaultRoles();
    
    // Assign permissions to roles
    await assignPermissionsToRoles(roleMap, permissionMap);
    
    // Assign admin role to admin users
    await assignAdminRoleToAdminUsers(roleMap);
    
    logger.info('Role and permission seeder completed successfully');
  } catch (error) {
    logger.error(`Error seeding roles and permissions: ${error.message}`, { error });
    throw error;
  }
};

module.exports = {
  seedRolesAndPermissions
};
