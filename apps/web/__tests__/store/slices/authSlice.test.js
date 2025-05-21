/**
 * Auth Slice Tests
 * Tests for authentication state management
 */

const {
  default: authReducer,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  updateUserProfile,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthToken,
  selectAuthLoading,
  selectAuthError,
} = require('../../../src/store/slices/authSlice');

describe('Auth Slice', () => {
  // Initial state tests
  describe('initial state', () => {
    it('should return the initial state', () => {
      const initialState = {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
      
      expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
    });
  });

  // Reducer tests
  describe('reducers', () => {
    it('should handle loginStart', () => {
      const initialState = {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
      
      const nextState = authReducer(initialState, loginStart());
      
      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBe(null);
    });

    it('should handle loginSuccess', () => {
      const initialState = {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
      };
      
      const payload = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
      };
      
      const nextState = authReducer(initialState, loginSuccess(payload));
      
      expect(nextState.isLoading).toBe(false);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.user).toEqual(payload.user);
      expect(nextState.token).toBe(payload.token);
      expect(nextState.refreshToken).toBe(payload.refreshToken);
      expect(nextState.error).toBe(null);
    });

    it('should handle loginFailure', () => {
      const initialState = {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
      };
      
      const error = 'Authentication failed';
      const nextState = authReducer(initialState, loginFailure(error));
      
      expect(nextState.isLoading).toBe(false);
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.user).toBe(null);
      expect(nextState.token).toBe(null);
      expect(nextState.refreshToken).toBe(null);
      expect(nextState.error).toBe(error);
    });

    it('should handle logout', () => {
      const initialState = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
      const nextState = authReducer(initialState, logout());
      
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.user).toBe(null);
      expect(nextState.token).toBe(null);
      expect(nextState.refreshToken).toBe(null);
      expect(nextState.error).toBe(null);
    });

    it('should handle refreshTokenStart', () => {
      const initialState = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
      const nextState = authReducer(initialState, refreshTokenStart());
      
      expect(nextState.isLoading).toBe(true);
    });

    it('should handle refreshTokenSuccess', () => {
      const initialState = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'old-token',
        refreshToken: 'old-refresh-token',
        isAuthenticated: true,
        isLoading: true,
        error: null,
      };
      
      const payload = {
        token: 'new-token',
        refreshToken: 'new-refresh-token',
      };
      
      const nextState = authReducer(initialState, refreshTokenSuccess(payload));
      
      expect(nextState.isLoading).toBe(false);
      expect(nextState.token).toBe(payload.token);
      expect(nextState.refreshToken).toBe(payload.refreshToken);
    });

    it('should handle refreshTokenFailure', () => {
      const initialState = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        isAuthenticated: true,
        isLoading: true,
        error: null,
      };
      
      const error = 'Token refresh failed';
      const nextState = authReducer(initialState, refreshTokenFailure(error));
      
      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe(error);
    });

    it('should handle updateUserProfile', () => {
      const initialState = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
      const updatedUser = { 
        id: '1', 
        name: 'Updated User', 
        email: 'test@example.com',
        avatar: 'avatar.jpg'
      };
      
      const nextState = authReducer(initialState, updateUserProfile(updatedUser));
      
      expect(nextState.user).toEqual(updatedUser);
    });
  });

  // Selector tests
  describe('selectors', () => {
    const state = {
      auth: {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        isAuthenticated: true,
        isLoading: false,
        error: 'Some error',
      },
    };

    it('should select current user', () => {
      expect(selectCurrentUser(state)).toEqual(state.auth.user);
    });

    it('should select isAuthenticated', () => {
      expect(selectIsAuthenticated(state)).toBe(state.auth.isAuthenticated);
    });

    it('should select auth token', () => {
      expect(selectAuthToken(state)).toBe(state.auth.token);
    });

    it('should select loading state', () => {
      expect(selectAuthLoading(state)).toBe(state.auth.isLoading);
    });

    it('should select auth error', () => {
      expect(selectAuthError(state)).toBe(state.auth.error);
    });
  });
});
