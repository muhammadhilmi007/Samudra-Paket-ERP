import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BranchAddPage from '../../../components/pages/BranchAddPage';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock redux store
const mockStore = configureStore([]);
const store = mockStore({
  notifications: {
    notifications: []
  }
});

// Mock the notification handler
jest.mock('../../../utils/notificationUtils', () => ({
  createNotificationHandler: () => ({
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  }),
}));

describe('BranchAddPage Component', () => {
  beforeEach(() => {
    // Reset store before each test
    store.clearActions();
    
    // Mock console.log to prevent noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore console mocks
    console.log.mockRestore();
    console.error.mockRestore();
  });
  
  it('renders the component correctly', () => {
    render(
      <Provider store={store}>
        <BranchAddPage />
      </Provider>
    );
    
    // Check if the component renders correctly
    expect(screen.getByText('Add New Branch')).toBeInTheDocument();
    expect(screen.getByText('Branch Information')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Additional Information')).toBeInTheDocument();
  });
  
  it('validates required fields on submission', async () => {
    render(
      <Provider store={store}>
        <BranchAddPage />
      </Provider>
    );
    
    // Submit the form without filling required fields
    fireEvent.click(screen.getByText('Create Branch'));
    
    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText('Branch name is required')).toBeInTheDocument();
      expect(screen.getByText('Branch code is required')).toBeInTheDocument();
      expect(screen.getByText('Address is required')).toBeInTheDocument();
      expect(screen.getByText('City is required')).toBeInTheDocument();
      expect(screen.getByText('Province is required')).toBeInTheDocument();
      expect(screen.getByText('Postal code is required')).toBeInTheDocument();
      expect(screen.getByText('Phone number is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });
  
  it('submits the form with valid data', async () => {
    render(
      <Provider store={store}>
        <BranchAddPage />
      </Provider>
    );
    
    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('e.g., Jakarta Branch'), { 
      target: { value: 'New Test Branch' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText('e.g., JKT001'), { 
      target: { value: 'TEST001' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText('e.g., Jl. Sudirman No. 123'), { 
      target: { value: 'Test Address 123' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText('e.g., Jakarta'), { 
      target: { value: 'Test City' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText('e.g., DKI Jakarta'), { 
      target: { value: 'Test Province' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText('e.g., 12930'), { 
      target: { value: '12345' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText('e.g., 021-5551234'), { 
      target: { value: '021-1234567' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText('e.g., jakarta@samudrapaket.com'), { 
      target: { value: 'test@samudrapaket.com' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Create Branch'));
    
    // Check if the form submission is in progress
    expect(screen.getByText('Creating...')).toBeInTheDocument();
    
    // Wait for the submission to complete
    await waitFor(() => {
      expect(screen.queryByText('Creating...')).not.toBeInTheDocument();
    });
  });
  
  it('navigates back when cancel button is clicked', () => {
    const { push } = require('next/navigation').useRouter();
    
    render(
      <Provider store={store}>
        <BranchAddPage />
      </Provider>
    );
    
    // Click the cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Check if router.push was called with the correct path
    expect(push).toHaveBeenCalledWith('/master-data/branches');
  });
});
