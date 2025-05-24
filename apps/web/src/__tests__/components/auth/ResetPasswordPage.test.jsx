/**
 * ResetPasswordPage Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useRouter, useSearchParams } from 'next/navigation';
import ResetPasswordPage from '../../../components/pages/ResetPasswordPage';
import { authApi } from '../../../store/api/authApi';
import authReducer from '../../../store/slices/authSlice';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
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

// Mock useResetPasswordMutation
jest.mock('../../../store/api/authApi', () => {
  const originalModule = jest.requireActual('../../../store/api/authApi');
  return {
    ...originalModule,
    useResetPasswordMutation: jest.fn(() => [
      jest.fn().mockImplementation((data) => {
        if (data.token === 'valid-token') {
          return Promise.resolve({ success: true });
        } else {
          return Promise.reject({ data: { message: 'Invalid or expired token' } });
        }
      }),
      { isLoading: false, isError: false },
    ]),
  };
});

describe('ResetPasswordPage Component', () => {
  const mockPush = jest.fn();
  const mockGet = jest.fn();
  
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
    
    useSearchParams.mockImplementation(() => ({
      get: mockGet.mockReturnValue('valid-token'),
    }));
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders reset password form correctly', () => {
    render(
      <Provider store={createMockStore()}>
        <ResetPasswordPage />
      </Provider>
    );
    
    expect(screen.getByText('Reset your password')).toBeInTheDocument();
    expect(screen.getByLabelText(/New password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset password/i })).toBeInTheDocument();
    expect(screen.getByText(/Back to login/i)).toBeInTheDocument();
  });
  
  it('validates password inputs', async () => {
    render(
      <Provider store={createMockStore()}>
        <ResetPasswordPage />
      </Provider>
    );
    
    // Submit form with weak password
    fireEvent.change(screen.getByLabelText(/New password/i), {
      target: { value: 'weak' },
    });
    
    fireEvent.change(screen.getByLabelText(/Confirm password/i), {
      target: { value: 'weak' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Reset password/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });
  
  it('validates password match', async () => {
    render(
      <Provider store={createMockStore()}>
        <ResetPasswordPage />
      </Provider>
    );
    
    // Submit form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/New password/i), {
      target: { value: 'StrongPassword123!' },
    });
    
    fireEvent.change(screen.getByLabelText(/Confirm password/i), {
      target: { value: 'DifferentPassword123!' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Reset password/i }));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });
  
  it('handles successful password reset', async () => {
    render(
      <Provider store={createMockStore()}>
        <ResetPasswordPage />
      </Provider>
    );
    
    // Fill form with valid passwords
    fireEvent.change(screen.getByLabelText(/New password/i), {
      target: { value: 'StrongPassword123!' },
    });
    
    fireEvent.change(screen.getByLabelText(/Confirm password/i), {
      target: { value: 'StrongPassword123!' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Reset password/i }));
    
    // Check if success message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Password reset successful/i)).toBeInTheDocument();
      expect(screen.getByText(/You can now log in with your new password/i)).toBeInTheDocument();
    });
  });
  
  it('handles password reset failure', async () => {
    // Mock the token to be invalid
    mockGet.mockReturnValue('invalid-token');
    
    // Mock the API to return an error
    const useResetPasswordMutationMock = jest.requireMock('../../../store/api/authApi').useResetPasswordMutation;
    useResetPasswordMutationMock.mockImplementation(() => [
      jest.fn().mockRejectedValue({ data: { message: 'Invalid or expired token' } }),
      { isLoading: false, isError: true, error: { data: { message: 'Invalid or expired token' } } },
    ]);
    
    render(
      <Provider store={createMockStore()}>
        <ResetPasswordPage />
      </Provider>
    );
    
    // Fill form with valid passwords
    fireEvent.change(screen.getByLabelText(/New password/i), {
      target: { value: 'StrongPassword123!' },
    });
    
    fireEvent.change(screen.getByLabelText(/Confirm password/i), {
      target: { value: 'StrongPassword123!' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Reset password/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Invalid or expired token/i)).toBeInTheDocument();
    });
  });
  
  it('redirects to forgot password if no token', () => {
    // Mock no token in URL
    mockGet.mockReturnValue(null);
    
    render(
      <Provider store={createMockStore()}>
        <ResetPasswordPage />
      </Provider>
    );
    
    // Check if redirect was called
    expect(mockPush).toHaveBeenCalledWith('/auth/forgot-password');
  });
});
