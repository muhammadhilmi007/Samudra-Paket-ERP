/**
 * User Repository Tests
 * Tests the User repository functionality
 */

const mongoose = require('mongoose');
const { User } = require('../../domain/models/User');
const userRepository = require('../../infrastructure/repositories/userRepository');

// Test user data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  username: 'testuser',
  password: 'Password123!',
  role: 'customer'
};

// Clear test data after tests
afterEach(async () => {
  await User.deleteMany({});
});

describe('User Repository', () => {
  it('should create a new user', async () => {
    const user = await userRepository.createUser(testUser);
    
    expect(user._id).toBeDefined();
    expect(user.firstName).toBe(testUser.firstName);
    expect(user.lastName).toBe(testUser.lastName);
    expect(user.email).toBe(testUser.email);
    expect(user.username).toBe(testUser.username);
    expect(user.role).toBe(testUser.role);
    expect(user.password).not.toBe(testUser.password); // Password should be hashed
  });
  
  it('should find user by ID', async () => {
    // Create user
    const createdUser = await userRepository.createUser(testUser);
    
    // Find user by ID
    const foundUser = await userRepository.findById(createdUser._id);
    
    expect(foundUser).toBeDefined();
    expect(foundUser._id.toString()).toBe(createdUser._id.toString());
    expect(foundUser.email).toBe(testUser.email);
  });
  
  it('should find user by email', async () => {
    // Create user
    await userRepository.createUser(testUser);
    
    // Find user by email
    const foundUser = await userRepository.findByEmail(testUser.email);
    
    expect(foundUser).toBeDefined();
    expect(foundUser.email).toBe(testUser.email);
  });
  
  it('should find user by username', async () => {
    // Create user
    await userRepository.createUser(testUser);
    
    // Find user by username
    const foundUser = await userRepository.findByUsername(testUser.username);
    
    expect(foundUser).toBeDefined();
    expect(foundUser.username).toBe(testUser.username);
  });
  
  it('should find user by email or username', async () => {
    // Create user
    await userRepository.createUser(testUser);
    
    // Find user by email
    const foundByEmail = await userRepository.findByEmailOrUsername(testUser.email);
    
    expect(foundByEmail).toBeDefined();
    expect(foundByEmail.email).toBe(testUser.email);
    
    // Find user by username
    const foundByUsername = await userRepository.findByEmailOrUsername(testUser.username);
    
    expect(foundByUsername).toBeDefined();
    expect(foundByUsername.username).toBe(testUser.username);
  });
  
  it('should update user', async () => {
    // Create user
    const createdUser = await userRepository.createUser(testUser);
    
    // Update user
    const updateData = {
      firstName: 'Updated',
      lastName: 'Name'
    };
    
    const updatedUser = await userRepository.updateUser(createdUser._id, updateData);
    
    expect(updatedUser).toBeDefined();
    expect(updatedUser.firstName).toBe(updateData.firstName);
    expect(updatedUser.lastName).toBe(updateData.lastName);
    expect(updatedUser.email).toBe(testUser.email); // Email should not change
  });
  
  it('should delete user', async () => {
    // Create user
    const createdUser = await userRepository.createUser(testUser);
    
    // Delete user
    const deletedUser = await userRepository.deleteUser(createdUser._id);
    
    expect(deletedUser).toBeDefined();
    expect(deletedUser._id.toString()).toBe(createdUser._id.toString());
    
    // Try to find deleted user
    const foundUser = await userRepository.findById(createdUser._id);
    
    expect(foundUser).toBeNull();
  });
  
  it('should find all users with pagination', async () => {
    // Create multiple users
    await userRepository.createUser(testUser);
    await userRepository.createUser({
      ...testUser,
      email: 'test2@example.com',
      username: 'testuser2'
    });
    await userRepository.createUser({
      ...testUser,
      email: 'test3@example.com',
      username: 'testuser3'
    });
    
    // Find all users with pagination
    const options = { skip: 0, limit: 2, sort: 'email' };
    const users = await userRepository.findAll(options);
    
    expect(users).toBeDefined();
    expect(users.length).toBe(2);
  });
  
  it('should count users', async () => {
    // Create multiple users
    await userRepository.createUser(testUser);
    await userRepository.createUser({
      ...testUser,
      email: 'test2@example.com',
      username: 'testuser2'
    });
    
    // Count users
    const count = await userRepository.countUsers();
    
    expect(count).toBe(2);
  });
  
  it('should find users by role', async () => {
    // Create users with different roles
    await userRepository.createUser(testUser);
    await userRepository.createUser({
      ...testUser,
      email: 'admin@example.com',
      username: 'adminuser',
      role: 'admin'
    });
    
    // Find users by role
    const options = { skip: 0, limit: 10, sort: 'email' };
    const users = await userRepository.findByRole('admin', options);
    
    expect(users).toBeDefined();
    expect(users.length).toBe(1);
    expect(users[0].role).toBe('admin');
  });
  
  it('should lock user account', async () => {
    // Create user
    const createdUser = await userRepository.createUser(testUser);
    
    // Lock account
    const lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    const lockedUser = await userRepository.lockAccount(createdUser._id, lockedUntil);
    
    expect(lockedUser).toBeDefined();
    expect(lockedUser.isLocked).toBe(true);
    expect(lockedUser.lockedUntil.getTime()).toBeCloseTo(lockedUntil.getTime(), -2); // Allow 100ms difference
  });
  
  it('should unlock user account', async () => {
    // Create user with locked account
    const user = await userRepository.createUser(testUser);
    user.isLocked = true;
    user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    user.failedLoginAttempts = 5;
    await user.save();
    
    // Unlock account
    const unlockedUser = await userRepository.unlockAccount(user._id);
    
    expect(unlockedUser).toBeDefined();
    expect(unlockedUser.isLocked).toBe(false);
    expect(unlockedUser.lockedUntil).toBeNull();
    expect(unlockedUser.failedLoginAttempts).toBe(0);
  });
});
