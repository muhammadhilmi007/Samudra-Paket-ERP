/**
 * Auth Service Tests
 * Tests the Auth service functionality
 */

const { authService, tokenService, passwordService } = require('../../application/services');
const { userRepository, sessionRepository, securityLogRepository } = require('../../infrastructure/repositories');
const { User } = require('../../domain/models/User');
const { Session } = require('../../domain/models/Session');
const { SecurityLog } = require('../../domain/models/SecurityLog');
const { NotFoundError, AuthenticationError } = require('../../utils/errorHandler');

// Mock repositories
jest.mock('../../infrastructure/repositories/userRepository');
jest.mock('../../infrastructure/repositories/sessionRepository');
jest.mock('../../infrastructure/repositories/securityLogRepository');

// Mock services
jest.mock('../../application/services/tokenService');
jest.mock('../../application/services/passwordService');
jest.mock('../../application/services/emailService');

// Test user data
const testUser = {
  _id: '60d21b4667d0d8992e610c85',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  username: 'testuser',
  password: 'hashedPassword',
  role: 'customer',
  isActive: true,
  isEmailVerified: true,
  isLocked: false,
  failedLoginAttempts: 0,
  comparePassword: jest.fn()
};

// Test session data
const testSession = {
  _id: '60d21b4667d0d8992e610c86',
  userId: testUser._id,
  refreshToken: 'refresh-token',
  userAgent: 'Test User Agent',
  ipAddress: '127.0.0.1'
};

// Test metadata
const testMetadata = {
  ipAddress: '127.0.0.1',
  userAgent: 'Test User Agent'
};

// Test tokens
const testTokens = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token'
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock user repository
  userRepository.createUser.mockResolvedValue(testUser);
  userRepository.findById.mockResolvedValue(testUser);
  userRepository.findByEmail.mockResolvedValue(testUser);
  userRepository.findByUsername.mockResolvedValue(testUser);
  userRepository.findByEmailOrUsername.mockResolvedValue(testUser);
  userRepository.updateUser.mockResolvedValue(testUser);
  
  // Mock session repository
  sessionRepository.createSession.mockResolvedValue(testSession);
  sessionRepository.findByRefreshToken.mockResolvedValue(testSession);
  sessionRepository.deleteByRefreshToken.mockResolvedValue(testSession);
  
  // Mock security log repository
  securityLogRepository.createLog.mockResolvedValue({});
  
  // Mock token service
  tokenService.generateTokenPair.mockReturnValue(testTokens);
  tokenService.verifyRefreshToken.mockReturnValue({ id: testUser._id });
  tokenService.blacklistToken.mockResolvedValue(true);
  
  // Mock password service
  passwordService.validatePasswordComplexity.mockReturnValue({ isValid: true });
  passwordService.containsPersonalInfo.mockReturnValue(false);
  passwordService.isPasswordInHistory.mockResolvedValue(false);
  passwordService.hashPassword.mockResolvedValue('hashedPassword');
  
  // Mock user password comparison
  testUser.comparePassword.mockResolvedValue(true);
});

describe('Auth Service', () => {
  describe('registerUser', () => {
    it('should register a new user', async () => {
      const userData = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        username: 'newuser',
        password: 'Password123!',
        role: 'customer'
      };
      
      // Mock user not found (for unique email/username check)
      userRepository.findByEmail.mockResolvedValueOnce(null);
      userRepository.findByUsername.mockResolvedValueOnce(null);
      
      const result = await authService.registerUser(userData);
      
      expect(result).toBeDefined();
      expect(passwordService.validatePasswordComplexity).toHaveBeenCalledWith(userData.password);
      expect(passwordService.containsPersonalInfo).toHaveBeenCalledWith(userData.password, expect.objectContaining({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username
      }));
      expect(passwordService.hashPassword).toHaveBeenCalledWith(userData.password);
      expect(userRepository.createUser).toHaveBeenCalledWith(expect.objectContaining({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username,
        password: 'hashedPassword'
      }));
    });
    
    it('should throw error if email already exists', async () => {
      const userData = {
        firstName: 'New',
        lastName: 'User',
        email: 'test@example.com', // Existing email
        username: 'newuser',
        password: 'Password123!'
      };
      
      await expect(authService.registerUser(userData)).rejects.toThrow();
    });
    
    it('should throw error if username already exists', async () => {
      const userData = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        username: 'testuser', // Existing username
        password: 'Password123!'
      };
      
      // Mock email not found but username found
      userRepository.findByEmail.mockResolvedValueOnce(null);
      
      await expect(authService.registerUser(userData)).rejects.toThrow();
    });
    
    it('should throw error if password is invalid', async () => {
      const userData = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        username: 'newuser',
        password: 'weak'
      };
      
      // Mock validation failure
      passwordService.validatePasswordComplexity.mockReturnValueOnce({ 
        isValid: false, 
        message: 'Password is too weak' 
      });
      
      await expect(authService.registerUser(userData)).rejects.toThrow();
    });
    
    it('should throw error if password contains personal info', async () => {
      const userData = {
        firstName: 'New',
        lastName: 'User',
        email: 'new@example.com',
        username: 'newuser',
        password: 'NewUser123!' // Contains name
      };
      
      // Mock personal info check
      passwordService.containsPersonalInfo.mockReturnValueOnce(true);
      
      await expect(authService.registerUser(userData)).rejects.toThrow();
    });
  });
  
  describe('loginUser', () => {
    it('should login user with valid credentials', async () => {
      const result = await authService.loginUser('testuser', 'Password123!', testMetadata);
      
      expect(result).toBeDefined();
      expect(result.accessToken).toBe(testTokens.accessToken);
      expect(result.refreshToken).toBe(testTokens.refreshToken);
      expect(result.user).toBeDefined();
      
      expect(userRepository.findByEmailOrUsername).toHaveBeenCalledWith('testuser');
      expect(testUser.comparePassword).toHaveBeenCalledWith('Password123!');
      expect(sessionRepository.createSession).toHaveBeenCalledWith(expect.objectContaining({
        userId: testUser._id,
        refreshToken: testTokens.refreshToken,
        userAgent: testMetadata.userAgent,
        ipAddress: testMetadata.ipAddress
      }));
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
        userId: testUser._id,
        eventType: 'LOGIN_SUCCESS',
        userAgent: testMetadata.userAgent,
        ipAddress: testMetadata.ipAddress
      }));
    });
    
    it('should throw error if user not found', async () => {
      // Mock user not found
      userRepository.findByEmailOrUsername.mockResolvedValueOnce(null);
      
      await expect(authService.loginUser('nonexistent', 'Password123!', testMetadata))
        .rejects.toThrow(AuthenticationError);
      
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
        eventType: 'LOGIN_FAILURE',
        userAgent: testMetadata.userAgent,
        ipAddress: testMetadata.ipAddress,
        details: expect.objectContaining({
          reason: 'User not found'
        })
      }));
    });
    
    it('should throw error if user is inactive', async () => {
      // Mock inactive user
      const inactiveUser = { ...testUser, isActive: false };
      userRepository.findByEmailOrUsername.mockResolvedValueOnce(inactiveUser);
      
      await expect(authService.loginUser('testuser', 'Password123!', testMetadata))
        .rejects.toThrow(AuthenticationError);
      
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
        userId: testUser._id,
        eventType: 'LOGIN_FAILURE',
        details: expect.objectContaining({
          reason: 'Account is inactive'
        })
      }));
    });
    
    it('should throw error if account is locked', async () => {
      // Mock locked account
      const lockedUser = { 
        ...testUser, 
        isLocked: true, 
        lockedUntil: new Date(Date.now() + 3600000) // 1 hour from now
      };
      userRepository.findByEmailOrUsername.mockResolvedValueOnce(lockedUser);
      
      await expect(authService.loginUser('testuser', 'Password123!', testMetadata))
        .rejects.toThrow(AuthenticationError);
      
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
        userId: testUser._id,
        eventType: 'LOGIN_FAILURE',
        details: expect.objectContaining({
          reason: 'Account is locked'
        })
      }));
    });
    
    it('should throw error if password is incorrect', async () => {
      // Mock password comparison failure
      testUser.comparePassword.mockResolvedValueOnce(false);
      
      await expect(authService.loginUser('testuser', 'WrongPassword', testMetadata))
        .rejects.toThrow(AuthenticationError);
      
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
        userId: testUser._id,
        eventType: 'LOGIN_FAILURE',
        details: expect.objectContaining({
          reason: 'Invalid password'
        })
      }));
      expect(userRepository.updateUser).toHaveBeenCalledWith(
        testUser._id,
        expect.objectContaining({
          failedLoginAttempts: 1
        })
      );
    });
  });
  
  describe('refreshToken', () => {
    it('should refresh token with valid refresh token', async () => {
      const result = await authService.refreshToken('refresh-token', testMetadata);
      
      expect(result).toBeDefined();
      expect(result.accessToken).toBe(testTokens.accessToken);
      expect(result.refreshToken).toBe(testTokens.refreshToken);
      
      expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith('refresh-token');
      expect(sessionRepository.findByRefreshToken).toHaveBeenCalledWith('refresh-token');
      expect(userRepository.findById).toHaveBeenCalledWith(testUser._id);
      expect(sessionRepository.deleteByRefreshToken).toHaveBeenCalledWith('refresh-token');
      expect(sessionRepository.createSession).toHaveBeenCalledWith(expect.objectContaining({
        userId: testUser._id,
        refreshToken: testTokens.refreshToken,
        userAgent: testMetadata.userAgent,
        ipAddress: testMetadata.ipAddress
      }));
    });
    
    it('should throw error if refresh token is invalid', async () => {
      // Mock token verification failure
      tokenService.verifyRefreshToken.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });
      
      await expect(authService.refreshToken('invalid-token', testMetadata))
        .rejects.toThrow();
      
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
        eventType: 'TOKEN_REFRESH_FAILURE',
        userAgent: testMetadata.userAgent,
        ipAddress: testMetadata.ipAddress
      }));
    });
    
    it('should throw error if session not found', async () => {
      // Mock session not found
      sessionRepository.findByRefreshToken.mockResolvedValueOnce(null);
      
      await expect(authService.refreshToken('refresh-token', testMetadata))
        .rejects.toThrow();
      
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
        eventType: 'TOKEN_REFRESH_FAILURE',
        userAgent: testMetadata.userAgent,
        ipAddress: testMetadata.ipAddress,
        details: expect.objectContaining({
          reason: 'Session not found'
        })
      }));
    });
    
    it('should throw error if user not found', async () => {
      // Mock user not found
      userRepository.findById.mockResolvedValueOnce(null);
      
      await expect(authService.refreshToken('refresh-token', testMetadata))
        .rejects.toThrow(NotFoundError);
      
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
        eventType: 'TOKEN_REFRESH_FAILURE',
        userAgent: testMetadata.userAgent,
        ipAddress: testMetadata.ipAddress,
        details: expect.objectContaining({
          reason: 'User not found'
        })
      }));
    });
  });
  
  describe('logoutUser', () => {
    it('should logout user with valid refresh token', async () => {
      await authService.logoutUser('refresh-token', testMetadata);
      
      expect(tokenService.verifyRefreshToken).toHaveBeenCalledWith('refresh-token');
      expect(sessionRepository.findByRefreshToken).toHaveBeenCalledWith('refresh-token');
      expect(sessionRepository.deleteByRefreshToken).toHaveBeenCalledWith('refresh-token');
      expect(securityLogRepository.createLog).toHaveBeenCalledWith(expect.objectContaining({
        userId: testUser._id,
        eventType: 'LOGOUT',
        userAgent: testMetadata.userAgent,
        ipAddress: testMetadata.ipAddress
      }));
    });
    
    it('should throw error if refresh token is invalid', async () => {
      // Mock token verification failure
      tokenService.verifyRefreshToken.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });
      
      await expect(authService.logoutUser('invalid-token', testMetadata))
        .rejects.toThrow();
    });
    
    it('should throw error if session not found', async () => {
      // Mock session not found
      sessionRepository.findByRefreshToken.mockResolvedValueOnce(null);
      
      await expect(authService.logoutUser('refresh-token', testMetadata))
        .rejects.toThrow();
    });
  });
});
