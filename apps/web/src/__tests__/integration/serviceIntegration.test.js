/**
 * Service Integration Tests
 * Tests the integration between services and API client
 */

import { authService, coreService } from '../../services';
import apiClient from '../../utils/apiClient';
import tokenManager from '../../utils/tokenManager';

// Mock the API client
jest.mock('../../utils/apiClient', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  setAuthToken: jest.fn(),
  clearAuthToken: jest.fn(),
  isAuthenticated: jest.fn(),
  refreshToken: jest.fn(),
}));

// Mock token manager
jest.mock('../../utils/tokenManager', () => ({
  setTokens: jest.fn(),
  getToken: jest.fn(),
  getRefreshToken: jest.fn(),
  removeTokens: jest.fn(),
  isAuthenticated: jest.fn(),
  parseToken: jest.fn(),
  isTokenExpired: jest.fn(),
}));

describe('Service Integration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Auth Service Integration', () => {
    test('login should call API client and set tokens correctly', async () => {
      // Mock successful login response
      const mockResponse = {
        data: {
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: { id: '123', email: 'user@example.com' }
        }
      };
      apiClient.post.mockResolvedValue(mockResponse);

      // Call login with test credentials
      const credentials = { 
        email: 'user@example.com', 
        password: 'password123',
        rememberMe: true 
      };
      const result = await authService.login(credentials);

      // Verify API client was called correctly
      expect(apiClient.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        { email: 'user@example.com', password: 'password123' }
      );

      // Verify tokens were set correctly
      expect(apiClient.setAuthToken).toHaveBeenCalledWith(
        {
          token: 'mock-token',
          refreshToken: 'mock-refresh-token'
        },
        true
      );

      // Verify response was returned correctly
      expect(result).toEqual(mockResponse.data);
    });

    test('logout should call API client and clear tokens', async () => {
      // Mock refresh token
      tokenManager.getRefreshToken.mockReturnValue('mock-refresh-token');
      
      // Mock successful logout response
      apiClient.post.mockResolvedValue({ data: { success: true } });

      // Call logout
      const result = await authService.logout();

      // Verify API client was called correctly
      expect(apiClient.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        { refreshToken: 'mock-refresh-token' }
      );

      // Verify tokens were cleared
      expect(apiClient.clearAuthToken).toHaveBeenCalled();

      // Verify response was returned correctly
      expect(result).toEqual({ success: true });
    });

    test('refreshToken should use API client refreshToken method if available', async () => {
      // Mock successful token refresh
      apiClient.refreshToken.mockResolvedValue({
        token: 'new-token',
        refreshToken: 'new-refresh-token'
      });

      // Call refreshToken
      await authService.refreshToken();

      // Verify API client refreshToken was called
      expect(apiClient.refreshToken).toHaveBeenCalled();
    });
  });

  describe('Core Service Integration', () => {
    test('getShipments should call API client correctly', async () => {
      // Mock successful response
      const mockResponse = {
        data: {
          data: [
            { id: '1', trackingNumber: 'TRACK001' },
            { id: '2', trackingNumber: 'TRACK002' }
          ],
          pagination: {
            total: 2,
            page: 1,
            limit: 10
          }
        }
      };
      apiClient.get.mockResolvedValue(mockResponse);

      // Call getShipments with params
      const params = { page: 1, limit: 10 };
      const result = await coreService.getShipments(params);

      // Verify API client was called correctly
      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/shipments'),
        params
      );

      // Verify response was returned correctly
      expect(result).toEqual(mockResponse.data);
    });

    test('createShipment should call API client correctly', async () => {
      // Mock successful response
      const mockResponse = {
        data: {
          id: '3',
          trackingNumber: 'TRACK003',
          status: 'pending'
        }
      };
      apiClient.post.mockResolvedValue(mockResponse);

      // Call createShipment with data
      const shipmentData = {
        origin: 'Jakarta',
        destination: 'Surabaya',
        weight: 5,
        dimensions: { length: 30, width: 20, height: 10 },
        customer: '123'
      };
      const result = await coreService.createShipment(shipmentData);

      // Verify API client was called correctly
      expect(apiClient.post).toHaveBeenCalledWith(
        expect.stringContaining('/shipments'),
        shipmentData
      );

      // Verify response was returned correctly
      expect(result).toEqual(mockResponse.data);
    });

    test('trackShipment should call API client correctly', async () => {
      // Mock successful response
      const mockResponse = {
        data: {
          trackingNumber: 'TRACK001',
          status: 'in transit',
          origin: 'Jakarta',
          destination: 'Surabaya',
          events: [
            {
              description: 'Package received',
              location: 'Jakarta Hub',
              timestamp: '2025-05-18T10:00:00Z'
            },
            {
              description: 'In transit',
              location: 'Jakarta Hub',
              timestamp: '2025-05-18T14:00:00Z'
            }
          ]
        }
      };
      apiClient.get.mockResolvedValue(mockResponse);

      // Call trackShipment with tracking number
      const trackingNumber = 'TRACK001';
      const result = await coreService.trackShipment(trackingNumber);

      // Verify API client was called correctly
      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining(`/shipments/tracking/${trackingNumber}`)
      );

      // Verify response was returned correctly
      expect(result).toEqual(mockResponse.data);
    });
  });
});
