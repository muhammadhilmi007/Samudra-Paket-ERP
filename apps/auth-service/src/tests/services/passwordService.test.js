/**
 * Password Service Tests
 * Tests the Password service functionality
 */

const { passwordService } = require('../../application/services');
const config = require('../../config');

// Test user data
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  username: 'testuser'
};

describe('Password Service', () => {
  it('should hash password', async () => {
    const password = 'Password123!';
    const hashedPassword = await passwordService.hashPassword(password);
    
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
  });
  
  it('should compare password', async () => {
    const password = 'Password123!';
    const hashedPassword = await passwordService.hashPassword(password);
    
    const isMatch = await passwordService.comparePassword(password, hashedPassword);
    expect(isMatch).toBe(true);
    
    const isNotMatch = await passwordService.comparePassword('wrongpassword', hashedPassword);
    expect(isNotMatch).toBe(false);
  });
  
  it('should validate password complexity', () => {
    // Valid password
    const validPassword = 'Password123!';
    const validResult = passwordService.validatePasswordComplexity(validPassword);
    
    expect(validResult.isValid).toBe(true);
    
    // Too short
    const shortPassword = 'Pass1!';
    const shortResult = passwordService.validatePasswordComplexity(shortPassword);
    
    expect(shortResult.isValid).toBe(false);
    expect(shortResult.message).toContain('at least 8 characters');
    
    // No uppercase
    const noUppercasePassword = 'password123!';
    const noUppercaseResult = passwordService.validatePasswordComplexity(noUppercasePassword);
    
    expect(noUppercaseResult.isValid).toBe(false);
    expect(noUppercaseResult.message).toContain('uppercase letter');
    
    // No lowercase
    const noLowercasePassword = 'PASSWORD123!';
    const noLowercaseResult = passwordService.validatePasswordComplexity(noLowercasePassword);
    
    expect(noLowercaseResult.isValid).toBe(false);
    expect(noLowercaseResult.message).toContain('lowercase letter');
    
    // No number
    const noNumberPassword = 'Password!';
    const noNumberResult = passwordService.validatePasswordComplexity(noNumberPassword);
    
    expect(noNumberResult.isValid).toBe(false);
    expect(noNumberResult.message).toContain('number');
    
    // No special character
    const noSpecialPassword = 'Password123';
    const noSpecialResult = passwordService.validatePasswordComplexity(noSpecialPassword);
    
    expect(noSpecialResult.isValid).toBe(false);
    expect(noSpecialResult.message).toContain('special character');
  });
  
  it('should check password strength', () => {
    // Strong password
    const strongPassword = 'StrongP@ssw0rd123';
    const strongResult = passwordService.checkPasswordStrength(strongPassword);
    
    expect(strongResult.score).toBeGreaterThanOrEqual(3);
    
    // Weak password
    const weakPassword = 'password123';
    const weakResult = passwordService.checkPasswordStrength(weakPassword);
    
    expect(weakResult.score).toBeLessThan(3);
  });
  
  it('should check if password contains personal info', () => {
    // Password with first name
    const namePassword = 'Test123!';
    const nameResult = passwordService.containsPersonalInfo(namePassword, testUser);
    
    expect(nameResult).toBe(true);
    
    // Password with last name
    const lastNamePassword = 'User123!';
    const lastNameResult = passwordService.containsPersonalInfo(lastNamePassword, testUser);
    
    expect(lastNameResult).toBe(true);
    
    // Password with email
    const emailPassword = 'test@example123!';
    const emailResult = passwordService.containsPersonalInfo(emailPassword, testUser);
    
    expect(emailResult).toBe(true);
    
    // Password with username
    const usernamePassword = 'testuser123!';
    const usernameResult = passwordService.containsPersonalInfo(usernamePassword, testUser);
    
    expect(usernameResult).toBe(true);
    
    // Password without personal info
    const safePassword = 'SafePassword123!';
    const safeResult = passwordService.containsPersonalInfo(safePassword, testUser);
    
    expect(safeResult).toBe(false);
  });
  
  it('should check if password is in history', async () => {
    const password = 'Password123!';
    const hashedPassword = await passwordService.hashPassword(password);
    
    const passwordHistory = [
      hashedPassword,
      await passwordService.hashPassword('OldPassword123!')
    ];
    
    const isInHistory = await passwordService.isPasswordInHistory(password, passwordHistory);
    expect(isInHistory).toBe(true);
    
    const isNotInHistory = await passwordService.isPasswordInHistory('NewPassword123!', passwordHistory);
    expect(isNotInHistory).toBe(false);
  });
  
  it('should generate random password', () => {
    const password = passwordService.generateRandomPassword();
    
    expect(password).toBeDefined();
    expect(password.length).toBeGreaterThanOrEqual(12);
    
    // Password should be complex
    const result = passwordService.validatePasswordComplexity(password);
    expect(result.isValid).toBe(true);
  });
});
