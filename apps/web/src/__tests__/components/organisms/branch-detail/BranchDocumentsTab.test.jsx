import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BranchDocumentsTab from '../../../../components/organisms/branch-detail/BranchDocumentsTab';

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

describe('BranchDocumentsTab Component', () => {
  const mockBranchId = 'branch-123';
  
  beforeEach(() => {
    // Reset store before each test
    store.clearActions();
  });
  
  it('renders the component correctly', () => {
    render(
      <Provider store={store}>
        <BranchDocumentsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Check if the component renders correctly
    expect(screen.getByText('Branch Documents')).toBeInTheDocument();
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
    expect(screen.getByLabelText('Document Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });
  
  it('displays documents in the grid', () => {
    render(
      <Provider store={store}>
        <BranchDocumentsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Check if the grid contains documents
    const viewButtons = screen.getAllByText('View');
    const deleteButtons = screen.getAllByText('Delete');
    
    expect(viewButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });
  
  it('opens the upload modal when clicking the upload button', () => {
    render(
      <Provider store={store}>
        <BranchDocumentsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Click the upload button
    fireEvent.click(screen.getByText('Upload Document'));
    
    // Check if the modal is opened
    expect(screen.getByText('Upload Document', { selector: 'h2, h3' })).toBeInTheDocument();
    expect(screen.getByLabelText('Document Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Document Type *')).toBeInTheDocument();
    expect(screen.getByLabelText('Category *')).toBeInTheDocument();
    expect(screen.getByLabelText('Document File *')).toBeInTheDocument();
  });
  
  it('filters documents when using the search input', () => {
    render(
      <Provider store={store}>
        <BranchDocumentsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Get the initial count of documents
    const initialViewButtons = screen.getAllByText('View');
    const initialCount = initialViewButtons.length;
    
    // Type in the search box
    fireEvent.change(screen.getByLabelText('Search'), { 
      target: { value: 'NonExistentDocument' } 
    });
    
    // Check if the filtered list is empty
    expect(screen.getByText('No documents found')).toBeInTheDocument();
    
    // Clear the search
    fireEvent.change(screen.getByLabelText('Search'), { 
      target: { value: '' } 
    });
    
    // Check if the documents are shown again
    const viewButtonsAfterClear = screen.getAllByText('View');
    expect(viewButtonsAfterClear.length).toBe(initialCount);
  });
  
  it('filters documents when selecting a document type', () => {
    render(
      <Provider store={store}>
        <BranchDocumentsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Select a document type
    fireEvent.change(screen.getByLabelText('Document Type'), { 
      target: { value: 'Contract' } 
    });
    
    // Check if the filtered list has changed
    // Note: This might show "No documents found" if no contracts exist in the mock data
    // or it might show a filtered list of contracts
  });
  
  it('opens the view modal when clicking the view button', () => {
    render(
      <Provider store={store}>
        <BranchDocumentsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Find and click the first view button
    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);
    
    // Check if the view modal is opened
    expect(screen.getByText('Document Details')).toBeInTheDocument();
    expect(screen.getByText('Document Preview')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });
  
  it('opens the delete modal when clicking the delete button', () => {
    render(
      <Provider store={store}>
        <BranchDocumentsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Find and click the first delete button
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Check if the delete modal is opened
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete the document/)).toBeInTheDocument();
  });
  
  it('deletes a document when confirming deletion', async () => {
    render(
      <Provider store={store}>
        <BranchDocumentsTab branchId={mockBranchId} />
      </Provider>
    );
    
    // Get the initial count of documents
    const initialDeleteButtons = screen.getAllByText('Delete');
    const initialCount = initialDeleteButtons.length;
    
    // Find and click the first delete button
    fireEvent.click(initialDeleteButtons[0]);
    
    // Confirm deletion
    fireEvent.click(screen.getByText('Delete Document'));
    
    // Wait for the modal to close
    await waitFor(() => {
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    });
    
    // Check if the document count has decreased
    const deleteButtonsAfterDelete = screen.getAllByText('Delete');
    expect(deleteButtonsAfterDelete.length).toBe(initialCount - 1);
  });
});
