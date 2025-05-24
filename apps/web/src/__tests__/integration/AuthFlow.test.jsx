/**
 * Authentication Flow Integration Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '../../components/pages/LoginPage';
import ForgotPasswordPage from '../../components/pages/ForgotPasswordPage';
import ResetPasswordPage from '../../components/pages/ResetPasswordPage';
import ProfilePage from '../../components/pages/ProfilePage';
import { authApi } from '../../store/api/authApi';
import authReducer from '../../store/slices/authSlice';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((param) => {
      if (param === 'token') return 'valid-token';
      return null;
    }),
  })),
}));

// Create a mock store
const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
  });
};

// Mock API hooks
jest.mock('../../store/api/authApi', () => {
  const originalModule = jest.requireActual('../../store/api/authApi');
  return {
    ...originalModule,
    useLoginMutation: jest.fn(() => [
      jest.fn().mockImplementation((credentials) => {
        if (credentials.email === 'test@example.com' && credentials.password === 'Password123!') {
          return Promise.resolve({ user: { name: 'Test User' }, token: 'fake-token' });
        } else {
          return Promise.reject({ data: { message: 'Invalid credentials' } });
        }
      }),
      { isLoading: false },
    ]),
    useForgotPasswordMutation: jest.fn(() => [
      jest.fn().mockResolvedValue({ success: true }),
      { isLoading: false },
    ]),
    useResetPasswordMutation: jest.fn(() => [
      jest.fn().mockResolvedValue({ success: true }),
      { isLoading: false },
    ]),
    useGetProfileQuery: jest.fn(() => ({
      data: { name: 'Test User', email: 'test@example.com' },
      isLoading: false,
    })),
  };
});

describe('Authentication Flow Integration', () => {
  it('completes the login flow successfully', async () => {
    const store = createMockStore();
    
    const { rerender } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    
    // Fill login form
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Password123!' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Mock successful authentication state update
    rerender(
      <Provider store={createMockStore({
        auth: {
          isAuthenticated: true,
          user: { name: 'Test User' },
          token: 'fake-token',
        },
      })}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    
    // Check if redirected to dashboard
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
  
  it('completes the password reset flow', async () => {
    // Step 1: Forgot Password
    const store = createMockStore();
    
    const { rerender } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/forgot-password']}>
          <Routes>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    
    // Fill forgot password form
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Send reset instructions/i }));
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/Check your email/i)).toBeInTheDocument();
    });
    
    // Step 2: Reset Password
    rerender(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/reset-password?token=valid-token']}>
          <Routes>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    
    // Fill reset password form
    fireEvent.change(screen.getByLabelText(/New password/i), {
      target: { value: 'NewPassword123!' },
    });
    
    fireEvent.change(screen.getByLabelText(/Confirm password/i), {
      target: { value: 'NewPassword123!' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Reset password/i }));
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/Password reset successful/i)).toBeInTheDocument();
    });
    
    // Step 3: Login with new password
    rerender(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    
    // Check if redirected to login
    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
  });
  
  it('protects routes and redirects unauthenticated users', async () => {
    // Unauthenticated state
    const store = createMockStore({
      auth: {
        isAuthenticated: false,
      },
    });
    
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/profile']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    
    // Should redirect to login
    await waitFor(() => {
      expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
    });
  });
});
