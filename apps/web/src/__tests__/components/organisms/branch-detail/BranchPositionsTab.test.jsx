import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BranchPositionsTab from '../../../../components/organisms/branch-detail/BranchPositionsTab';

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

describe('BranchPositionsTab Component', () => {
  const mockBranchId = 'branch-123';
  
  beforeEach(() => {
    // Reset store before each test
    store.clearActions();
  });
  
  it('renders the component correctly', () => {
    render(
      <Provider store={store}>
        <BranchPositionsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Check if the component renders correctly
    expect(screen.getByText('Positions')).toBeInTheDocument();
    expect(screen.getByText('Add Position')).toBeInTheDocument();
    expect(screen.getByLabelText('Department')).toBeInTheDocument();
    expect(screen.getByLabelText('Level')).toBeInTheDocument();
  });
  
  it('displays positions in the table', () => {
    render(
      <Provider store={store}>
        <BranchPositionsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Check if the table contains positions
    expect(screen.getByText('Branch Manager')).toBeInTheDocument();
    expect(screen.getByText('Operations Supervisor')).toBeInTheDocument();
    expect(screen.getByText('Customer Service Representative')).toBeInTheDocument();
  });
  
  it('opens the add modal when clicking the add button', () => {
    render(
      <Provider store={store}>
        <BranchPositionsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Click the add button
    fireEvent.click(screen.getByText('Add Position'));
    
    // Check if the modal is opened
    expect(screen.getByText('Add Position', { selector: 'h2, h3' })).toBeInTheDocument();
    expect(screen.getByLabelText('Position Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Department *')).toBeInTheDocument();
    expect(screen.getByLabelText('Level *')).toBeInTheDocument();
  });
  
  it('adds a new position when submitting the form', async () => {
    render(
      <Provider store={store}>
        <BranchPositionsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Open the add modal
    fireEvent.click(screen.getByText('Add Position'));
    
    // Fill the form
    fireEvent.change(screen.getByLabelText('Position Name *'), { 
      target: { value: 'New Test Position' } 
    });
    
    fireEvent.change(screen.getByLabelText('Department *'), { 
      target: { value: 'Test Department' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Add Position', { selector: 'button' }));
    
    // Wait for the modal to close
    await waitFor(() => {
      expect(screen.queryByText('Add Position', { selector: 'h2, h3' })).not.toBeInTheDocument();
    });
    
    // Check if the new position is added to the table
    expect(screen.getByText('New Test Position')).toBeInTheDocument();
    expect(screen.getByText('Test Department')).toBeInTheDocument();
  });
  
  it('opens the edit modal when clicking the edit button', () => {
    render(
      <Provider store={store}>
        <BranchPositionsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Find and click the first edit button
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    // Check if the edit modal is opened
    expect(screen.getByText('Edit Position')).toBeInTheDocument();
  });
  
  it('opens the view modal when clicking the view button', () => {
    render(
      <Provider store={store}>
        <BranchPositionsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Find and click the first view button
    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);
    
    // Check if the view modal is opened
    expect(screen.getByText('Position Details')).toBeInTheDocument();
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    expect(screen.getByText('Responsibilities')).toBeInTheDocument();
  });
  
  it('opens the delete modal when clicking the delete button', () => {
    render(
      <Provider store={store}>
        <BranchPositionsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Find and click the first delete button
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Check if the delete modal is opened
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete the position/)).toBeInTheDocument();
  });
  
  it('deletes a position when confirming deletion', async () => {
    render(
      <Provider store={store}>
        <BranchPositionsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Get the initial count of positions
    const initialDeleteButtons = screen.getAllByText('Delete');
    const initialCount = initialDeleteButtons.length;
    
    // Find and click the first delete button
    fireEvent.click(initialDeleteButtons[0]);
    
    // Confirm deletion
    fireEvent.click(screen.getByText('Delete Position'));
    
    // Wait for the modal to close
    await waitFor(() => {
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    });
    
    // Check if the position count has decreased
    const deleteButtonsAfterDelete = screen.getAllByText('Delete');
    expect(deleteButtonsAfterDelete.length).toBe(initialCount - 1);
  });
  
  it('filters positions by department', () => {
    render(
      <Provider store={store}>
        <BranchPositionsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Select a department
    fireEvent.change(screen.getByLabelText('Department'), { 
      target: { value: 'Operations' } 
    });
    
    // Check if the filtered list shows only Operations positions
    expect(screen.getByText('Operations Supervisor')).toBeInTheDocument();
    expect(screen.queryByText('Branch Manager')).not.toBeInTheDocument();
  });
});
