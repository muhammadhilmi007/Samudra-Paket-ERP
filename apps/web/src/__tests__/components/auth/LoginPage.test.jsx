/**
 * LoginPage Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useRouter } from 'next/navigation';
import LoginPage from '../../../components/pages/LoginPage';
import { authApi } from '../../../store/api/authApi';
import authReducer from '../../../store/slices/authSlice';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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

// Mock useLoginMutation
jest.mock('../../../store/api/authApi', () => {
  const originalModule = jest.requireActual('../../../store/api/authApi');
  return {
    ...originalModule,
    useLoginMutation: jest.fn(() => [
      jest.fn().mockImplementation((credentials) => {
        if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
          return Promise.resolve({ user: { name: 'Test User' }, token: 'fake-token' });
        } else {
          return Promise.reject({ data: { message: 'Invalid credentials' } });
        }
      }),
      { isLoading: false },
    ]),
  };
});

describe('LoginPage Component', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders login form correctly', () => {
    render(
      <Provider store={createMockStore()}>
        <LoginPage />
      </Provider>
    );
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/Forgot your password/i)).toBeInTheDocument();
  });
  
  it('validates form inputs', async () => {
    render(
      <Provider store={createMockStore()}>
        <LoginPage />
      </Provider>
    );
    
    // Submit form without filling inputs
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });
  
  it('handles successful login', async () => {
    render(
      <Provider store={createMockStore()}>
        <LoginPage />
      </Provider>
    );
    
    // Fill form with valid credentials
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
    
    // Check if login mutation was called
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
  
  it('handles login failure', async () => {
    render(
      <Provider store={createMockStore({
        auth: {
          isAuthenticated: false,
          error: 'Invalid credentials',
        },
      })}>
        <LoginPage />
      </Provider>
    );
    
    // Check if error message is displayed
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
  
  it('redirects if already authenticated', () => {
    render(
      <Provider store={createMockStore({
        auth: {
          isAuthenticated: true,
          user: { name: 'Test User' },
        },
      })}>
        <LoginPage />
      </Provider>
    );
    
    // Check if redirect was called
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
