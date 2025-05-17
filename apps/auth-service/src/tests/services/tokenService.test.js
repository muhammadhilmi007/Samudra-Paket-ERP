/**
 * Token Service Tests
 * Tests the Token service functionality
 */

const jwt = require('jsonwebtoken');
const { tokenService } = require('../../application/services');
const config = require('../../config');

// Mock Redis client
jest.mock('../../infrastructure/database/redis', () => ({
  blacklistToken: jest.fn().mockResolvedValue('OK'),
  isTokenBlacklisted: jest.fn().mockResolvedValue(false)
}));

// Test user data
const testUser = {
  _id: '60d21b4667d0d8992e610c85',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  username: 'testuser',
  role: 'customer'
};

describe('Token Service', () => {
  it('should generate access token', () => {
    const accessToken = tokenService.generateAccessToken(testUser);
    
    expect(accessToken).toBeDefined();
    expect(typeof accessToken).toBe('string');
    
    // Verify token
    const decoded = jwt.verify(accessToken, config.jwt.secret);
    
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(testUser._id);
    expect(decoded.email).toBe(testUser.email);
    expect(decoded.role).toBe(testUser.role);
    expect(decoded.iss).toBe(config.jwt.issuer);
    expect(decoded.aud).toBe(config.jwt.audience);
    expect(decoded.exp).toBeDefined();
  });
  
  it('should generate refresh token', () => {
    const refreshToken = tokenService.generateRefreshToken(testUser);
    
    expect(refreshToken).toBeDefined();
    expect(typeof refreshToken).toBe('string');
    
    // Verify token
    const decoded = jwt.verify(refreshToken, config.jwt.secret);
    
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(testUser._id);
    expect(decoded.type).toBe('refresh');
    expect(decoded.iss).toBe(config.jwt.issuer);
    expect(decoded.aud).toBe(config.jwt.audience);
    expect(decoded.exp).toBeDefined();
  });
  
  it('should generate token pair', () => {
    const { accessToken, refreshToken } = tokenService.generateTokenPair(testUser);
    
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(typeof accessToken).toBe('string');
    expect(typeof refreshToken).toBe('string');
  });
  
  it('should verify access token', () => {
    const accessToken = tokenService.generateAccessToken(testUser);
    const decoded = tokenService.verifyAccessToken(accessToken);
    
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(testUser._id);
    expect(decoded.email).toBe(testUser.email);
    expect(decoded.role).toBe(testUser.role);
  });
  
  it('should verify refresh token', () => {
    const refreshToken = tokenService.generateRefreshToken(testUser);
    const decoded = tokenService.verifyRefreshToken(refreshToken);
    
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(testUser._id);
    expect(decoded.type).toBe('refresh');
  });
  
  it('should throw error for invalid access token', () => {
    const invalidToken = 'invalid-token';
    
    expect(() => {
      tokenService.verifyAccessToken(invalidToken);
    }).toThrow();
  });
  
  it('should throw error for invalid refresh token', () => {
    const invalidToken = 'invalid-token';
    
    expect(() => {
      tokenService.verifyRefreshToken(invalidToken);
    }).toThrow();
  });
  
  it('should throw error for expired token', () => {
    // Generate token with short expiration
    const expiredToken = jwt.sign(
      { id: testUser._id, email: testUser.email },
      config.jwt.secret,
      { expiresIn: '1ms' }
    );
    
    // Wait for token to expire
    setTimeout(() => {
      expect(() => {
        tokenService.verifyAccessToken(expiredToken);
      }).toThrow();
    }, 5);
  });
  
  it('should blacklist token', async () => {
    const accessToken = tokenService.generateAccessToken(testUser);
    
    await tokenService.blacklistToken(accessToken);
    
    // Mock Redis client should have been called
    const { blacklistToken } = require('../../infrastructure/database/redis');
    expect(blacklistToken).toHaveBeenCalledWith(accessToken, expect.any(Number));
  });
  
  it('should check if token is blacklisted', async () => {
    const accessToken = tokenService.generateAccessToken(testUser);
    
    const { isTokenBlacklisted } = require('../../infrastructure/database/redis');
    
    // Mock Redis client to return false
    isTokenBlacklisted.mockResolvedValueOnce(false);
    
    const result = await tokenService.isTokenBlacklisted(accessToken);
    expect(result).toBe(false);
    
    // Mock Redis client to return true
    isTokenBlacklisted.mockResolvedValueOnce(true);
    
    const result2 = await tokenService.isTokenBlacklisted(accessToken);
    expect(result2).toBe(true);
  });
});
