import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ForwardersPage from '../../../components/pages/ForwardersPage';

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

describe('ForwardersPage Component', () => {
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
        <ForwardersPage />
      </Provider>
    );
    
    // Check if the component renders correctly
    expect(screen.getByText('Forwarders')).toBeInTheDocument();
    expect(screen.getByText('Add Forwarder')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
  });
  
  it('displays forwarders in the table', () => {
    render(
      <Provider store={store}>
        <ForwardersPage />
      </Provider>
    );
    
    // Check if the table contains forwarders
    expect(screen.getByText('Express Logistics')).toBeInTheDocument();
    expect(screen.getByText('Global Shipping Partners')).toBeInTheDocument();
    expect(screen.getByText('Regional Delivery Services')).toBeInTheDocument();
  });
  
  it('filters forwarders by search term', () => {
    render(
      <Provider store={store}>
        <ForwardersPage />
      </Provider>
    );
    
    // Get the initial count of forwarders
    const initialViewButtons = screen.getAllByText('View');
    const initialCount = initialViewButtons.length;
    
    // Type in the search box
    fireEvent.change(screen.getByLabelText('Search'), { 
      target: { value: 'Express' } 
    });
    
    // Check if the filtered list shows only Express Logistics
    expect(screen.getByText('Express Logistics')).toBeInTheDocument();
    expect(screen.queryByText('Global Shipping Partners')).not.toBeInTheDocument();
    
    // Clear the search
    fireEvent.change(screen.getByLabelText('Search'), { 
      target: { value: '' } 
    });
    
    // Check if all forwarders are shown again
    const viewButtonsAfterClear = screen.getAllByText('View');
    expect(viewButtonsAfterClear.length).toBe(initialCount);
  });
  
  it('filters forwarders by type', () => {
    render(
      <Provider store={store}>
        <ForwardersPage />
      </Provider>
    );
    
    // Select a type
    fireEvent.change(screen.getByLabelText('Type'), { 
      target: { value: 'NATIONAL' } 
    });
    
    // Check if the filtered list shows only National forwarders
    expect(screen.getByText('Express Logistics')).toBeInTheDocument();
    expect(screen.getByText('Premium Freight Solutions')).toBeInTheDocument();
    expect(screen.queryByText('Global Shipping Partners')).not.toBeInTheDocument();
  });
  
  it('filters forwarders by status', () => {
    render(
      <Provider store={store}>
        <ForwardersPage />
      </Provider>
    );
    
    // Select inactive status
    fireEvent.change(screen.getByLabelText('Status'), { 
      target: { value: 'INACTIVE' } 
    });
    
    // Check if the filtered list shows only inactive forwarders
    expect(screen.getByText('Island Courier Network')).toBeInTheDocument();
    expect(screen.queryByText('Express Logistics')).not.toBeInTheDocument();
    
    // Select active status
    fireEvent.change(screen.getByLabelText('Status'), { 
      target: { value: 'ACTIVE' } 
    });
    
    // Check if the filtered list shows only active forwarders
    expect(screen.getByText('Express Logistics')).toBeInTheDocument();
    expect(screen.queryByText('Island Courier Network')).not.toBeInTheDocument();
  });
  
  it('opens the delete modal when clicking the delete button', () => {
    render(
      <Provider store={store}>
        <ForwardersPage />
      </Provider>
    );
    
    // Find and click the first delete button
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Check if the delete modal is opened
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete the forwarder/)).toBeInTheDocument();
  });
  
  it('deletes a forwarder when confirming deletion', async () => {
    render(
      <Provider store={store}>
        <ForwardersPage />
      </Provider>
    );
    
    // Get the initial count of forwarders
    const initialDeleteButtons = screen.getAllByText('Delete');
    const initialCount = initialDeleteButtons.length;
    
    // Find and click the first delete button
    fireEvent.click(initialDeleteButtons[0]);
    
    // Confirm deletion
    fireEvent.click(screen.getByText('Delete Forwarder'));
    
    // Wait for the modal to close
    await waitFor(() => {
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    });
    
    // Check if the forwarder count has decreased
    const deleteButtonsAfterDelete = screen.getAllByText('Delete');
    expect(deleteButtonsAfterDelete.length).toBe(initialCount - 1);
  });
  
  it('navigates to add forwarder page when clicking the add button', () => {
    const { push } = require('next/navigation').useRouter();
    
    render(
      <Provider store={store}>
        <ForwardersPage />
      </Provider>
    );
    
    // Click the add button
    fireEvent.click(screen.getByText('Add Forwarder'));
    
    // Check if router.push was called with the correct path
    expect(push).toHaveBeenCalledWith('/master-data/forwarders/add');
  });
  
  it('navigates to view forwarder page when clicking the view button', () => {
    const { push } = require('next/navigation').useRouter();
    
    render(
      <Provider store={store}>
        <ForwardersPage />
      </Provider>
    );
    
    // Find and click the first view button
    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);
    
    // Check if router.push was called with the correct path
    expect(push).toHaveBeenCalledWith('/master-data/forwarders/fwd-001');
  });
  
  it('navigates to edit forwarder page when clicking the edit button', () => {
    const { push } = require('next/navigation').useRouter();
    
    render(
      <Provider store={store}>
        <ForwardersPage />
      </Provider>
    );
    
    // Find and click the first edit button
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    // Check if router.push was called with the correct path
    expect(push).toHaveBeenCalledWith('/master-data/forwarders/edit/fwd-001');
  });
});
