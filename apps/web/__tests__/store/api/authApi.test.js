/**
 * Auth API Tests
 * Tests for authentication API integration
 */

const { setupApiStore } = require('../../test-utils/setupApiStore');
const { apiSlice } = require('../../../src/store/api/apiSlice');
const { authApi } = require('../../../src/store/api/authApi');
const { loginSuccess, loginFailure, logout } = require('../../../src/store/slices/authSlice');

// Mock fetch implementation
global.fetch = jest.fn();

// Setup store with API middleware
const storeRef = setupApiStore(apiSlice, {
  auth: (state = {}, action) => state,
});

describe('Auth API', () => {
  beforeEach(() => {
    fetch.mockClear();
    storeRef.store.dispatch(apiSlice.util.resetApiState());
  });

  describe('login mutation', () => {
    it('should handle successful login', async () => {
      // Mock successful response
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'test-token',
          refreshToken: 'test-refresh-token',
        }),
      });

      // Spy on dispatch
      const dispatchSpy = jest.spyOn(storeRef.store, 'dispatch');

      // Execute the login mutation
      const result = await storeRef.store.dispatch(
        authApi.endpoints.login.initiate({
          email: 'test@example.com',
          password: 'password123',
        })
      );

      // Check that the API call was made correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );

      // Check that the result is correct
      expect(result.data).toEqual({
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
      });

      // Check that loginSuccess action was dispatched
      expect(dispatchSpy).toHaveBeenCalledWith(
        loginSuccess({
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'test-token',
          refreshToken: 'test-refresh-token',
        })
      );
    });

    it('should handle login failure', async () => {
      // Mock failed response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          message: 'Invalid credentials',
        }),
      });

      // Spy on dispatch
      const dispatchSpy = jest.spyOn(storeRef.store, 'dispatch');

      // Execute the login mutation
      const result = await storeRef.store.dispatch(
        authApi.endpoints.login.initiate({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      );

      // Check that the API call was made correctly
      expect(fetch).toHaveBeenCalledTimes(1);

      // Check that the result has an error
      expect(result.error).toBeDefined();

      // Check that loginFailure action was dispatched
      expect(dispatchSpy).toHaveBeenCalledWith(
        loginFailure('Invalid credentials')
      );
    });
  });

  describe('register mutation', () => {
    it('should handle successful registration', async () => {
      // Mock successful response
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          user: { id: '1', name: 'New User', email: 'new@example.com' },
        }),
      });

      // Execute the register mutation
      const result = await storeRef.store.dispatch(
        authApi.endpoints.register.initiate({
          name: 'New User',
          email: 'new@example.com',
          password: 'password123',
        })
      );

      // Check that the API call was made correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );

      // Check that the result is correct
      expect(result.data).toEqual({
        user: { id: '1', name: 'New User', email: 'new@example.com' },
      });
    });
  });

  describe('refreshToken mutation', () => {
    it('should handle successful token refresh', async () => {
      // Mock successful response
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          token: 'new-token',
          refreshToken: 'new-refresh-token',
        }),
      });

      // Execute the refreshToken mutation
      const result = await storeRef.store.dispatch(
        authApi.endpoints.refreshToken.initiate('old-refresh-token')
      );

      // Check that the API call was made correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh-token'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String),
        })
      );

      // Check that the result is correct
      expect(result.data).toEqual({
        token: 'new-token',
        refreshToken: 'new-refresh-token',
      });
    });
  });

  describe('logout mutation', () => {
    it('should handle successful logout', async () => {
      // Mock successful response
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      // Spy on dispatch
      const dispatchSpy = jest.spyOn(storeRef.store, 'dispatch');

      // Execute the logout mutation
      await storeRef.store.dispatch(authApi.endpoints.logout.initiate());

      // Check that the API call was made correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({
          method: 'POST',
        })
      );

      // Check that logout action was dispatched
      expect(dispatchSpy).toHaveBeenCalledWith(logout());
    });
  });
});
