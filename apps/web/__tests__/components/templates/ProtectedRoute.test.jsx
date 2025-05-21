/**
 * ProtectedRoute Component Tests
 * Tests for the ProtectedRoute component that handles authentication protection
 */

const React = require('react');
const { render, screen, waitFor } = require('@testing-library/react');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const { useRouter } = require('next/navigation');
const ProtectedRoute = require('../../../src/components/templates/ProtectedRoute').default;
const authReducer = require('../../../src/store/slices/authSlice').default;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn().mockReturnValue('/dashboard'),
}));

// Setup test store
const setupStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });
};

describe('ProtectedRoute Component', () => {
  let mockRouter;
  
  beforeEach(() => {
    // Setup mock router
    mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should render children when user is authenticated', () => {
    // Setup store with authenticated state
    const store = setupStore({
      auth: {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    });
    
    render(
      <Provider store={store}>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </Provider>
    );
    
    // Check that protected content is rendered
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    
    // Check that router was not called to redirect
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
  
  it('should redirect to login when user is not authenticated', async () => {
    // Setup store with unauthenticated state
    const store = setupStore({
      auth: {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
    });
    
    render(
      <Provider store={store}>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </Provider>
    );
    
    // Wait for the redirect to happen
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/login?redirect=/dashboard');
    });
    
    // Protected content should not be rendered
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
  
  it('should show loading state while authentication is being checked', () => {
    // Setup store with loading state
    const store = setupStore({
      auth: {
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
      },
    });
    
    render(
      <Provider store={store}>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </Provider>
    );
    
    // Check that loading indicator is shown
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    
    // Protected content should not be rendered yet
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    
    // Router should not have been called yet
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
  
  it('should accept and apply custom roles requirement', async () => {
    // Setup store with authenticated state but insufficient roles
    const store = setupStore({
      auth: {
        user: { 
          id: '1', 
          name: 'Test User', 
          email: 'test@example.com',
          roles: ['user'] 
        },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    });
    
    render(
      <Provider store={store}>
        <ProtectedRoute requiredRoles={['admin']}>
          <div data-testid="protected-content">Admin Content</div>
        </ProtectedRoute>
      </Provider>
    );
    
    // Wait for the redirect to happen (to unauthorized page)
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/unauthorized');
    });
    
    // Protected content should not be rendered
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
  
  it('should render children when user has required roles', () => {
    // Setup store with authenticated state and sufficient roles
    const store = setupStore({
      auth: {
        user: { 
          id: '1', 
          name: 'Test User', 
          email: 'test@example.com',
          roles: ['admin', 'user'] 
        },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    });
    
    render(
      <Provider store={store}>
        <ProtectedRoute requiredRoles={['admin']}>
          <div data-testid="protected-content">Admin Content</div>
        </ProtectedRoute>
      </Provider>
    );
    
    // Check that protected content is rendered
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Admin Content')).toBeInTheDocument();
    
    // Check that router was not called to redirect
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
