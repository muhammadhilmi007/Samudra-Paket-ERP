/**
 * Auth Validators Tests
 * Tests the auth validation schemas
 */

const { authValidators } = require('../../api/validators');

describe('Auth Validators', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      // Valid registration data
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'Password123!',
        role: 'customer'
      };
      
      // Validate data
      const { error, value } = authValidators.registerSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should reject registration with missing fields', () => {
      // Invalid registration data with missing fields
      const invalidData = {
        firstName: 'John',
        // Missing lastName
        email: 'john.doe@example.com',
        // Missing username
        password: 'Password123!'
        // Missing role
      };
      
      // Validate data
      const { error } = authValidators.registerSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details).toHaveLength(3); // lastName, username, role
      expect(error.details[0].message).toContain('required');
    });
    
    it('should reject registration with invalid email', () => {
      // Invalid registration data with invalid email
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        username: 'johndoe',
        password: 'Password123!',
        role: 'customer'
      };
      
      // Validate data
      const { error } = authValidators.registerSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('email');
      expect(error.details[0].message).toContain('valid email');
    });
    
    it('should reject registration with short password', () => {
      // Invalid registration data with short password
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'Pass1!', // Too short
        role: 'customer'
      };
      
      // Validate data
      const { error } = authValidators.registerSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('password');
      expect(error.details[0].message).toContain('length');
    });
    
    it('should reject registration with invalid role', () => {
      // Invalid registration data with invalid role
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'Password123!',
        role: 'invalid-role' // Invalid role
      };
      
      // Validate data
      const { error } = authValidators.registerSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('role');
      expect(error.details[0].message).toContain('valid');
    });
    
    it('should trim whitespace from string fields', () => {
      // Registration data with whitespace
      const dataWithWhitespace = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  john.doe@example.com  ',
        username: '  johndoe  ',
        password: 'Password123!',
        role: 'customer'
      };
      
      // Validate data
      const { value } = authValidators.registerSchema.validate(dataWithWhitespace);
      
      // Assertions
      expect(value.firstName).toBe('John');
      expect(value.lastName).toBe('Doe');
      expect(value.email).toBe('john.doe@example.com');
      expect(value.username).toBe('johndoe');
    });
  });
  
  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      // Valid login data
      const validData = {
        username: 'johndoe',
        password: 'Password123!'
      };
      
      // Validate data
      const { error, value } = authValidators.loginSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should validate login with email instead of username', () => {
      // Valid login data with email
      const validData = {
        username: 'john.doe@example.com', // Email format
        password: 'Password123!'
      };
      
      // Validate data
      const { error } = authValidators.loginSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
    });
    
    it('should reject login with missing fields', () => {
      // Invalid login data with missing fields
      const invalidData = {
        // Missing username
        // Missing password
      };
      
      // Validate data
      const { error } = authValidators.loginSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details).toHaveLength(2); // username, password
      expect(error.details[0].message).toContain('required');
    });
    
    it('should reject login with empty fields', () => {
      // Invalid login data with empty fields
      const invalidData = {
        username: '',
        password: ''
      };
      
      // Validate data
      const { error } = authValidators.loginSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details).toHaveLength(2); // username, password
      expect(error.details[0].message).toContain('empty');
    });
  });
  
  describe('refreshTokenSchema', () => {
    it('should validate valid refresh token data', () => {
      // Valid refresh token data
      const validData = {
        refreshToken: 'valid-refresh-token'
      };
      
      // Validate data
      const { error, value } = authValidators.refreshTokenSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should reject refresh token with missing token', () => {
      // Invalid refresh token data with missing token
      const invalidData = {
        // Missing refreshToken
      };
      
      // Validate data
      const { error } = authValidators.refreshTokenSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('refreshToken');
      expect(error.details[0].message).toContain('required');
    });
    
    it('should reject refresh token with empty token', () => {
      // Invalid refresh token data with empty token
      const invalidData = {
        refreshToken: ''
      };
      
      // Validate data
      const { error } = authValidators.refreshTokenSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('refreshToken');
      expect(error.details[0].message).toContain('empty');
    });
  });
  
  describe('logoutSchema', () => {
    it('should validate valid logout data', () => {
      // Valid logout data
      const validData = {
        refreshToken: 'valid-refresh-token'
      };
      
      // Validate data
      const { error, value } = authValidators.logoutSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should reject logout with missing token', () => {
      // Invalid logout data with missing token
      const invalidData = {
        // Missing refreshToken
      };
      
      // Validate data
      const { error } = authValidators.logoutSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('refreshToken');
      expect(error.details[0].message).toContain('required');
    });
  });
  
  describe('passwordResetRequestSchema', () => {
    it('should validate valid password reset request data', () => {
      // Valid password reset request data
      const validData = {
        email: 'john.doe@example.com'
      };
      
      // Validate data
      const { error, value } = authValidators.passwordResetRequestSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should reject password reset request with missing email', () => {
      // Invalid password reset request data with missing email
      const invalidData = {
        // Missing email
      };
      
      // Validate data
      const { error } = authValidators.passwordResetRequestSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('email');
      expect(error.details[0].message).toContain('required');
    });
    
    it('should reject password reset request with invalid email', () => {
      // Invalid password reset request data with invalid email
      const invalidData = {
        email: 'invalid-email'
      };
      
      // Validate data
      const { error } = authValidators.passwordResetRequestSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('email');
      expect(error.details[0].message).toContain('valid email');
    });
  });
  
  describe('passwordResetSchema', () => {
    it('should validate valid password reset data', () => {
      // Valid password reset data
      const validData = {
        token: 'valid-reset-token',
        password: 'NewPassword123!'
      };
      
      // Validate data
      const { error, value } = authValidators.passwordResetSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should reject password reset with missing fields', () => {
      // Invalid password reset data with missing fields
      const invalidData = {
        // Missing token
        // Missing password
      };
      
      // Validate data
      const { error } = authValidators.passwordResetSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details).toHaveLength(2); // token, password
      expect(error.details[0].message).toContain('required');
    });
    
    it('should reject password reset with short password', () => {
      // Invalid password reset data with short password
      const invalidData = {
        token: 'valid-reset-token',
        password: 'Pass1!' // Too short
      };
      
      // Validate data
      const { error } = authValidators.passwordResetSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('password');
      expect(error.details[0].message).toContain('length');
    });
  });
});
