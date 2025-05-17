/**
 * User Validators Tests
 * Tests the user validation schemas
 */

const { userValidators } = require('../../api/validators');

describe('User Validators', () => {
  describe('createUserSchema', () => {
    it('should validate valid user creation data', () => {
      // Valid user creation data
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'Password123!',
        role: 'customer',
        phoneNumber: '+6281234567890',
        address: {
          street: '123 Main St',
          city: 'Jakarta',
          state: 'DKI Jakarta',
          postalCode: '12345',
          country: 'Indonesia'
        }
      };
      
      // Validate data
      const { error, value } = userValidators.createUserSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should validate user creation with minimal required fields', () => {
      // Valid user creation data with only required fields
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'Password123!',
        role: 'customer'
      };
      
      // Validate data
      const { error, value } = userValidators.createUserSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should reject user creation with missing required fields', () => {
      // Invalid user creation data with missing required fields
      const invalidData = {
        firstName: 'John',
        // Missing lastName
        email: 'john.doe@example.com',
        // Missing username
        password: 'Password123!'
        // Missing role
      };
      
      // Validate data
      const { error } = userValidators.createUserSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details.length).toBeGreaterThan(0);
      expect(error.details.some(d => d.path.includes('lastName'))).toBeTruthy();
      expect(error.details.some(d => d.path.includes('username'))).toBeTruthy();
      expect(error.details.some(d => d.path.includes('role'))).toBeTruthy();
    });
    
    it('should reject user creation with invalid email', () => {
      // Invalid user creation data with invalid email
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        username: 'johndoe',
        password: 'Password123!',
        role: 'customer'
      };
      
      // Validate data
      const { error } = userValidators.createUserSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('email');
      expect(error.details[0].message).toContain('valid email');
    });
    
    it('should reject user creation with invalid phone number', () => {
      // Invalid user creation data with invalid phone number
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'Password123!',
        role: 'customer',
        phoneNumber: '123' // Invalid phone number
      };
      
      // Validate data
      const { error } = userValidators.createUserSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('phoneNumber');
      expect(error.details[0].message).toContain('pattern');
    });
    
    it('should reject user creation with invalid address', () => {
      // Invalid user creation data with invalid address
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'Password123!',
        role: 'customer',
        address: {
          // Missing street
          city: 'Jakarta',
          // Missing state
          postalCode: '12345',
          country: 'Indonesia'
        }
      };
      
      // Validate data
      const { error } = userValidators.createUserSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details.some(d => d.path.includes('address.street'))).toBeTruthy();
      expect(error.details.some(d => d.path.includes('address.state'))).toBeTruthy();
    });
  });
  
  describe('updateUserSchema', () => {
    it('should validate valid user update data', () => {
      // Valid user update data
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+6281234567890',
        address: {
          street: '123 Main St',
          city: 'Jakarta',
          state: 'DKI Jakarta',
          postalCode: '12345',
          country: 'Indonesia'
        }
      };
      
      // Validate data
      const { error, value } = userValidators.updateUserSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should validate partial user update', () => {
      // Valid partial user update data
      const validData = {
        firstName: 'John',
        lastName: 'Doe'
      };
      
      // Validate data
      const { error, value } = userValidators.updateUserSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should reject update with sensitive fields', () => {
      // Invalid user update data with sensitive fields
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        password: 'NewPassword123!', // Sensitive field
        role: 'admin', // Sensitive field
        email: 'new.email@example.com' // Sensitive field
      };
      
      // Validate data
      const { error } = userValidators.updateUserSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details.some(d => d.path.includes('password'))).toBeTruthy();
      expect(error.details.some(d => d.path.includes('role'))).toBeTruthy();
      expect(error.details.some(d => d.path.includes('email'))).toBeTruthy();
    });
    
    it('should reject update with invalid phone number', () => {
      // Invalid user update data with invalid phone number
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '123' // Invalid phone number
      };
      
      // Validate data
      const { error } = userValidators.updateUserSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('phoneNumber');
      expect(error.details[0].message).toContain('pattern');
    });
    
    it('should reject update with empty object', () => {
      // Invalid user update data with empty object
      const invalidData = {};
      
      // Validate data
      const { error } = userValidators.updateUserSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.message).toContain('at least one field');
    });
  });
  
  describe('changePasswordSchema', () => {
    it('should validate valid password change data', () => {
      // Valid password change data
      const validData = {
        currentPassword: 'CurrentPassword123!',
        newPassword: 'NewPassword123!'
      };
      
      // Validate data
      const { error, value } = userValidators.changePasswordSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should reject password change with missing fields', () => {
      // Invalid password change data with missing fields
      const invalidData = {
        // Missing currentPassword
        newPassword: 'NewPassword123!'
      };
      
      // Validate data
      const { error } = userValidators.changePasswordSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('currentPassword');
      expect(error.details[0].message).toContain('required');
    });
    
    it('should reject password change with weak new password', () => {
      // Invalid password change data with weak new password
      const invalidData = {
        currentPassword: 'CurrentPassword123!',
        newPassword: 'weak' // Too short and weak
      };
      
      // Validate data
      const { error } = userValidators.changePasswordSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('newPassword');
      expect(error.details[0].message).toContain('length');
    });
    
    it('should reject password change when new password is same as current', () => {
      // Invalid password change data with same passwords
      const invalidData = {
        currentPassword: 'SamePassword123!',
        newPassword: 'SamePassword123!'
      };
      
      // Validate data
      const { error } = userValidators.changePasswordSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('different');
    });
  });
  
  describe('userIdSchema', () => {
    it('should validate valid user ID', () => {
      // Valid user ID
      const validData = {
        id: '60d21b4667d0d8992e610c85' // Valid MongoDB ObjectId
      };
      
      // Validate data
      const { error, value } = userValidators.userIdSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should reject invalid user ID format', () => {
      // Invalid user ID format
      const invalidData = {
        id: 'invalid-id'
      };
      
      // Validate data
      const { error } = userValidators.userIdSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('id');
      expect(error.details[0].message).toContain('pattern');
    });
    
    it('should reject missing user ID', () => {
      // Missing user ID
      const invalidData = {};
      
      // Validate data
      const { error } = userValidators.userIdSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details[0].path).toContain('id');
      expect(error.details[0].message).toContain('required');
    });
  });
  
  describe('paginationSchema', () => {
    it('should validate valid pagination parameters', () => {
      // Valid pagination parameters
      const validData = {
        page: 1,
        limit: 10
      };
      
      // Validate data
      const { error, value } = userValidators.paginationSchema.validate(validData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });
    
    it('should apply default values for missing pagination parameters', () => {
      // Missing pagination parameters
      const incompleteData = {};
      
      // Validate data
      const { error, value } = userValidators.paginationSchema.validate(incompleteData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value.page).toBe(1); // Default page
      expect(value.limit).toBe(10); // Default limit
    });
    
    it('should reject invalid pagination parameters', () => {
      // Invalid pagination parameters
      const invalidData = {
        page: 0, // Invalid page (must be >= 1)
        limit: 101 // Invalid limit (must be <= 100)
      };
      
      // Validate data
      const { error } = userValidators.paginationSchema.validate(invalidData);
      
      // Assertions
      expect(error).toBeDefined();
      expect(error.details.length).toBe(2);
      expect(error.details.some(d => d.path.includes('page'))).toBeTruthy();
      expect(error.details.some(d => d.path.includes('limit'))).toBeTruthy();
    });
    
    it('should convert string values to numbers', () => {
      // String pagination parameters
      const stringData = {
        page: '2',
        limit: '20'
      };
      
      // Validate data
      const { error, value } = userValidators.paginationSchema.validate(stringData);
      
      // Assertions
      expect(error).toBeUndefined();
      expect(value.page).toBe(2); // Converted to number
      expect(value.limit).toBe(20); // Converted to number
    });
  });
});
