/**
 * User Model Tests
 * Tests the User model functionality
 */

const mongoose = require('mongoose');
const { User } = require('../../domain/models/User');

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

describe('User Model', () => {
  it('should create a new user successfully', async () => {
    const user = new User(testUser);
    const savedUser = await user.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.firstName).toBe(testUser.firstName);
    expect(savedUser.lastName).toBe(testUser.lastName);
    expect(savedUser.email).toBe(testUser.email);
    expect(savedUser.username).toBe(testUser.username);
    expect(savedUser.role).toBe(testUser.role);
    expect(savedUser.password).not.toBe(testUser.password); // Password should be hashed
    expect(savedUser.isActive).toBe(true);
    expect(savedUser.isEmailVerified).toBe(false);
    expect(savedUser.isLocked).toBe(false);
    expect(savedUser.failedLoginAttempts).toBe(0);
  });
  
  it('should hash the password before saving', async () => {
    const user = new User(testUser);
    const savedUser = await user.save();
    
    expect(savedUser.password).not.toBe(testUser.password);
    expect(savedUser.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
  });
  
  it('should validate password correctly', async () => {
    const user = new User(testUser);
    await user.save();
    
    const isValid = await user.comparePassword(testUser.password);
    expect(isValid).toBe(true);
    
    const isInvalid = await user.comparePassword('wrongpassword');
    expect(isInvalid).toBe(false);
  });
  
  it('should track password history', async () => {
    const user = new User(testUser);
    await user.save();
    
    // Change password
    const newPassword = 'NewPassword456!';
    user.password = newPassword;
    await user.save();
    
    // Check password history
    expect(user.passwordHistory.length).toBe(1);
    
    // Verify old password is in history
    const oldPasswordHash = user.passwordHistory[0];
    expect(oldPasswordHash).toBeDefined();
    
    // Verify new password works
    const isValid = await user.comparePassword(newPassword);
    expect(isValid).toBe(true);
  });
  
  it('should not allow duplicate email', async () => {
    // Create first user
    const user1 = new User(testUser);
    await user1.save();
    
    // Try to create second user with same email
    const user2 = new User({
      ...testUser,
      username: 'differentusername'
    });
    
    await expect(user2.save()).rejects.toThrow();
  });
  
  it('should not allow duplicate username', async () => {
    // Create first user
    const user1 = new User(testUser);
    await user1.save();
    
    // Try to create second user with same username
    const user2 = new User({
      ...testUser,
      email: 'different@example.com'
    });
    
    await expect(user2.save()).rejects.toThrow();
  });
  
  it('should require firstName, lastName, email, username, and password', async () => {
    const user = new User({});
    
    await expect(user.save()).rejects.toThrow();
  });
  
  it('should validate email format', async () => {
    const user = new User({
      ...testUser,
      email: 'invalid-email'
    });
    
    await expect(user.save()).rejects.toThrow();
  });
  
  it('should have fullName virtual property', async () => {
    const user = new User(testUser);
    await user.save();
    
    expect(user.fullName).toBe(`${testUser.firstName} ${testUser.lastName}`);
  });
  
  it('should increment failed login attempts', async () => {
    const user = new User(testUser);
    await user.save();
    
    user.incrementLoginAttempts();
    await user.save();
    
    expect(user.failedLoginAttempts).toBe(1);
  });
  
  it('should reset failed login attempts', async () => {
    const user = new User(testUser);
    user.failedLoginAttempts = 3;
    await user.save();
    
    user.resetLoginAttempts();
    await user.save();
    
    expect(user.failedLoginAttempts).toBe(0);
  });
  
  it('should lock account after max failed attempts', async () => {
    const user = new User(testUser);
    user.failedLoginAttempts = 4; // One less than max
    await user.save();
    
    user.incrementLoginAttempts();
    await user.save();
    
    expect(user.isLocked).toBe(true);
    expect(user.lockedUntil).toBeDefined();
  });
});
