/**
 * ForgotPasswordPage Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ForgotPasswordPage from '../../../components/pages/ForgotPasswordPage';
import { authApi } from '../../../store/api/authApi';
import authReducer from '../../../store/slices/authSlice';

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

// Mock useForgotPasswordMutation
jest.mock('../../../store/api/authApi', () => {
  const originalModule = jest.requireActual('../../../store/api/authApi');
  return {
    ...originalModule,
    useForgotPasswordMutation: jest.fn(() => [
      jest.fn().mockImplementation((data) => {
        if (data.email === 'test@example.com') {
          return Promise.resolve({ success: true });
        } else {
          return Promise.reject({ data: { message: 'Email not found' } });
        }
      }),
      { isLoading: false, isError: false },
    ]),
  };
});

describe('ForgotPasswordPage Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders forgot password form correctly', () => {
    render(
      <Provider store={createMockStore()}>
        <ForgotPasswordPage />
      </Provider>
    );
    
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send reset instructions/i })).toBeInTheDocument();
    expect(screen.getByText(/Back to login/i)).toBeInTheDocument();
  });
  
  it('validates email input', async () => {
    render(
      <Provider store={createMockStore()}>
        <ForgotPasswordPage />
      </Provider>
    );
    
    // Submit form with invalid email
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'invalid-email' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Send reset instructions/i }));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });
  
  it('handles successful password reset request', async () => {
    render(
      <Provider store={createMockStore()}>
        <ForgotPasswordPage />
      </Provider>
    );
    
    // Fill form with valid email
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Send reset instructions/i }));
    
    // Check if success message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Check your email/i)).toBeInTheDocument();
      expect(screen.getByText(/We've sent a password reset link to/i)).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });
  
  it('handles password reset request failure', async () => {
    // Mock the API to return an error
    const useForgotPasswordMutationMock = jest.requireMock('../../../store/api/authApi').useForgotPasswordMutation;
    useForgotPasswordMutationMock.mockImplementation(() => [
      jest.fn().mockRejectedValue({ data: { message: 'Email not found' } }),
      { isLoading: false, isError: true, error: { data: { message: 'Email not found' } } },
    ]);
    
    render(
      <Provider store={createMockStore()}>
        <ForgotPasswordPage />
      </Provider>
    );
    
    // Fill form with email
    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'nonexistent@example.com' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Send reset instructions/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Email not found/i)).toBeInTheDocument();
    });
  });
});
