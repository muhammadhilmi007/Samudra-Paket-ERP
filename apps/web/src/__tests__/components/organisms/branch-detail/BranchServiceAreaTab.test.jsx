import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BranchServiceAreaTab from '../../../../components/organisms/branch-detail/BranchServiceAreaTab';

// Mock redux store
const mockStore = configureStore([]);
const store = mockStore({
  notifications: {
    notifications: []
  }
});

// Mock the notification handler
jest.mock('../../../../utils/notificationUtils', () => ({
  createNotificationHandler: () => ({
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  }),
}));

describe('BranchServiceAreaTab Component', () => {
  const mockBranchId = 'branch-123';
  
  beforeEach(() => {
    // Reset store before each test
    store.clearActions();
  });
  
  it('renders the component correctly', () => {
    render(
      <Provider store={store}>
        <BranchServiceAreaTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Check if the component renders correctly
    expect(screen.getByText('Service Areas')).toBeInTheDocument();
    expect(screen.getByText('Add Service Area')).toBeInTheDocument();
    expect(screen.getByText('Service Area Map')).toBeInTheDocument();
  });
  
  it('displays service areas in the table', () => {
    render(
      <Provider store={store}>
        <BranchServiceAreaTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Check if the table contains service areas
    const serviceAreaNames = screen.getAllByText(/Service Area/);
    expect(serviceAreaNames.length).toBeGreaterThan(0);
  });
  
  it('opens the add modal when clicking the add button', () => {
    render(
      <Provider store={store}>
        <BranchServiceAreaTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Click the add button
    fireEvent.click(screen.getByText('Add Service Area'));
    
    // Check if the modal is opened
    expect(screen.getByText('Add Service Area', { selector: 'h2, h3' })).toBeInTheDocument();
    expect(screen.getByLabelText('Area Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Province')).toBeInTheDocument();
    expect(screen.getByLabelText('Service Type')).toBeInTheDocument();
  });
  
  it('adds a new service area when submitting the form', async () => {
    render(
      <Provider store={store}>
        <BranchServiceAreaTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Open the add modal
    fireEvent.click(screen.getByText('Add Service Area'));
    
    // Fill the form
    fireEvent.change(screen.getByLabelText('Area Name'), { 
      target: { value: 'New Test Area' } 
    });
    
    fireEvent.change(screen.getByLabelText('Province'), { 
      target: { value: 'Test Province' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Add Service Area', { selector: 'button' }));
    
    // Wait for the modal to close
    await waitFor(() => {
      expect(screen.queryByText('Add Service Area', { selector: 'h2, h3' })).not.toBeInTheDocument();
    });
  });
  
  it('opens the edit modal when clicking the edit button', async () => {
    render(
      <Provider store={store}>
        <BranchServiceAreaTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Find and click the first edit button
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    // Check if the edit modal is opened
    expect(screen.getByText('Edit Service Area')).toBeInTheDocument();
  });
  
  it('opens the delete modal when clicking the delete button', async () => {
    render(
      <Provider store={store}>
        <BranchServiceAreaTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Find and click the first delete button
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Check if the delete modal is opened
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete the service area/)).toBeInTheDocument();
  });
  
  it('opens the map modal when clicking the map button', async () => {
    render(
      <Provider store={store}>
        <BranchServiceAreaTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Find and click the first map button
    const mapButtons = screen.getAllByText('Map');
    fireEvent.click(mapButtons[0]);
    
    // Check if the map modal is opened
    expect(screen.getByText(/Map View:/)).toBeInTheDocument();
    expect(screen.getByText('Service Area Details')).toBeInTheDocument();
  });
});
