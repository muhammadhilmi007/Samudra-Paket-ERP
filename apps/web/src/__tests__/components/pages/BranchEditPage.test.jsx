import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BranchEditPage from '../../../components/pages/BranchEditPage';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    id: 'branch-123',
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

describe('BranchEditPage Component', () => {
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
        <BranchEditPage />
      </Provider>
    );
    
    // Check if the component renders correctly
    expect(screen.getByText('Edit Branch')).toBeInTheDocument();
    expect(screen.getByText('Branch Information')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Additional Information')).toBeInTheDocument();
  });
  
  it('loads branch data on mount', async () => {
    render(
      <Provider store={store}>
        <BranchEditPage />
      </Provider>
    );
    
    // Wait for the form to be populated with branch data
    await waitFor(() => {
      expect(screen.getByDisplayValue('Jakarta Branch')).toBeInTheDocument();
    });
    
    // Check if other fields are populated
    expect(screen.getByDisplayValue('JKT001')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jl. Sudirman No. 123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jakarta')).toBeInTheDocument();
    expect(screen.getByDisplayValue('DKI Jakarta')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12930')).toBeInTheDocument();
    expect(screen.getByDisplayValue('021-5551234')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jakarta@samudrapaket.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('08:00 - 17:00')).toBeInTheDocument();
  });
  
  it('validates required fields', async () => {
    render(
      <Provider store={store}>
        <BranchEditPage />
      </Provider>
    );
    
    // Wait for the form to be populated
    await waitFor(() => {
      expect(screen.getByDisplayValue('Jakarta Branch')).toBeInTheDocument();
    });
    
    // Clear required fields
    fireEvent.change(screen.getByDisplayValue('Jakarta Branch'), { target: { value: '' } });
    fireEvent.change(screen.getByDisplayValue('JKT001'), { target: { value: '' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Changes'));
    
    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText('Branch name is required')).toBeInTheDocument();
      expect(screen.getByText('Branch code is required')).toBeInTheDocument();
    });
  });
  
  it('submits the form with valid data', async () => {
    render(
      <Provider store={store}>
        <BranchEditPage />
      </Provider>
    );
    
    // Wait for the form to be populated
    await waitFor(() => {
      expect(screen.getByDisplayValue('Jakarta Branch')).toBeInTheDocument();
    });
    
    // Update some fields
    fireEvent.change(screen.getByDisplayValue('Jakarta Branch'), { 
      target: { value: 'Jakarta Branch Updated' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Changes'));
    
    // Check if the form submission is in progress
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    
    // Wait for the submission to complete
    await waitFor(() => {
      expect(screen.queryByText('Saving...')).not.toBeInTheDocument();
    });
  });
  
  it('navigates back when cancel button is clicked', () => {
    const { push } = require('next/navigation').useRouter();
    
    render(
      <Provider store={store}>
        <BranchEditPage />
      </Provider>
    );
    
    // Click the cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    // Check if router.push was called with the correct path
    expect(push).toHaveBeenCalledWith('/master-data/branches');
  });
});
