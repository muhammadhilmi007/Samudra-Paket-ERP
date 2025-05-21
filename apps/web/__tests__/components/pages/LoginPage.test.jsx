/**
 * LoginPage Component Tests
 * Integration tests for the LoginPage component
 */

const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { Provider } = require('react-redux');
const { configureStore } = require('@reduxjs/toolkit');
const { setupListeners } = require('@reduxjs/toolkit/query');
const { useRouter } = require('next/navigation');
const LoginPage = require('../../../src/components/pages/LoginPage').default;
const { apiSlice } = require('../../../src/store/api/apiSlice');
const authReducer = require('../../../src/store/slices/authSlice').default;
const uiReducer = require('../../../src/store/slices/uiSlice').default;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn().mockReturnValue('/login'),
}));

// Mock AuthLayout component
jest.mock('../../../src/components/templates/AuthLayout', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div data-testid="auth-layout">{children}</div>,
  };
});

// Setup test store
const setupStore = (preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    preloadedState,
  });
  
  setupListeners(store.dispatch);
  return store;
};

describe('LoginPage Component', () => {
  let mockRouter;
  let store;
  
  beforeEach(() => {
    // Setup mock router
    mockRouter = {
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);
    
    // Setup store
    store = setupStore();
    
    // Mock fetch for API calls
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
      }),
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should render the login form', () => {
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });
  
  it('should show validation errors for invalid inputs', async () => {
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );
    
    // Submit form with empty fields
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });
  
  it('should submit the form and redirect on successful login', async () => {
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Wait for the API call and redirect
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('email'),
        })
      );
      
      // Check that we're redirected to dashboard
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });
  
  it('should show error message on login failure', async () => {
    // Mock fetch to return an error
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        message: 'Invalid credentials',
      }),
    });
    
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
  
  it('should redirect to dashboard if already authenticated', async () => {
    // Setup store with authenticated state
    const authenticatedStore = setupStore({
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
      <Provider store={authenticatedStore}>
        <LoginPage />
      </Provider>
    );
    
    // Check that we're redirected to dashboard
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });
});
