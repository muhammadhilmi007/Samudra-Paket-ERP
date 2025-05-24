import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Import components
import BranchesPage from '../../components/pages/BranchesPage';
import BranchDetailPage from '../../components/pages/BranchDetailPage';
import BranchFormPage from '../../components/pages/BranchFormPage';

// Mock branch data
const mockBranches = [
  {
    id: 'branch-1',
    name: 'Jakarta HQ',
    code: 'JKT-HQ',
    address: 'Jl. Sudirman No. 123, Jakarta',
    phone: '021-5551234',
    email: 'jakarta@samudrapaket.com',
    manager: 'John Doe',
    status: 'active',
    type: 'headquarters',
    coordinates: { lat: -6.2088, lng: 106.8456 }
  },
  {
    id: 'branch-2',
    name: 'Surabaya Branch',
    code: 'SBY-01',
    address: 'Jl. Pemuda No. 45, Surabaya',
    phone: '031-5559876',
    email: 'surabaya@samudrapaket.com',
    manager: 'Jane Smith',
    status: 'active',
    type: 'branch',
    coordinates: { lat: -7.2575, lng: 112.7521 }
  },
  {
    id: 'branch-3',
    name: 'Bandung Branch',
    code: 'BDG-01',
    address: 'Jl. Asia Afrika No. 67, Bandung',
    phone: '022-5557890',
    email: 'bandung@samudrapaket.com',
    manager: 'David Wilson',
    status: 'active',
    type: 'branch',
    coordinates: { lat: -6.9175, lng: 107.6191 }
  }
];

// Mock API endpoints
const server = setupServer(
  // Get all branches
  rest.get('/api/branches', (req, res, ctx) => {
    return res(ctx.json(mockBranches));
  }),
  
  // Get branch by ID
  rest.get('/api/branches/:id', (req, res, ctx) => {
    const branch = mockBranches.find(b => b.id === req.params.id);
    if (branch) {
      return res(ctx.json(branch));
    }
    return res(ctx.status(404), ctx.json({ message: 'Branch not found' }));
  }),
  
  // Create branch
  rest.post('/api/branches', (req, res, ctx) => {
    const newBranch = {
      id: `branch-${mockBranches.length + 1}`,
      ...req.body,
      status: 'active'
    };
    return res(ctx.status(201), ctx.json(newBranch));
  }),
  
  // Update branch
  rest.put('/api/branches/:id', (req, res, ctx) => {
    const updatedBranch = {
      id: req.params.id,
      ...req.body
    };
    return res(ctx.json(updatedBranch));
  }),
  
  // Delete branch
  rest.delete('/api/branches/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  })
);

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    auth: (state = { user: { role: 'Admin' } }, action) => state,
    notifications: (state = { notifications: [] }, action) => state,
  },
});

// Start server before all tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close server after all tests
afterAll(() => server.close());

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    pathname: '/',
  }),
}));

describe('Branch Management Integration Tests', () => {
  it('should display a list of branches with search and filtering', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/master-data/branches']}>
          <Routes>
            <Route path="/master-data/branches" element={<BranchesPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for branches to load
    await waitFor(() => {
      expect(screen.getByText('Branch Management')).toBeInTheDocument();
    });

    // Verify all branches are displayed
    expect(screen.getByText('Jakarta HQ')).toBeInTheDocument();
    expect(screen.getByText('Surabaya Branch')).toBeInTheDocument();
    expect(screen.getByText('Bandung Branch')).toBeInTheDocument();

    // Test search functionality
    const searchInput = screen.getByPlaceholderText('Search branches...');
    fireEvent.change(searchInput, { target: { value: 'Jakarta' } });

    // Verify filtered results
    await waitFor(() => {
      expect(screen.getByText('Jakarta HQ')).toBeInTheDocument();
      expect(screen.queryByText('Surabaya Branch')).not.toBeInTheDocument();
      expect(screen.queryByText('Bandung Branch')).not.toBeInTheDocument();
    });

    // Clear search and test status filter
    fireEvent.change(searchInput, { target: { value: '' } });
    const statusFilter = screen.getByLabelText('Status');
    fireEvent.change(statusFilter, { target: { value: 'active' } });

    // Verify all branches are shown again (all are active)
    await waitFor(() => {
      expect(screen.getByText('Jakarta HQ')).toBeInTheDocument();
      expect(screen.getByText('Surabaya Branch')).toBeInTheDocument();
      expect(screen.getByText('Bandung Branch')).toBeInTheDocument();
    });
  });

  it('should navigate from branch list to branch detail', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/master-data/branches']}>
          <Routes>
            <Route path="/master-data/branches" element={<BranchesPage />} />
            <Route path="/master-data/branches/:id" element={<BranchDetailPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for branches to load
    await waitFor(() => {
      expect(screen.getByText('Branch Management')).toBeInTheDocument();
    });

    // Find and click on the first branch
    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    // Verify navigation to branch detail page
    await waitFor(() => {
      expect(screen.getByText('Jakarta HQ')).toBeInTheDocument();
      expect(screen.getByText('JKT-HQ')).toBeInTheDocument();
      expect(screen.getByText('Jl. Sudirman No. 123, Jakarta')).toBeInTheDocument();
    });
  });

  it('should create a new branch with validation', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/master-data/branches/add']}>
          <BranchFormPage mode="add" />
        </MemoryRouter>
      </Provider>
    );

    // Verify form is displayed
    await waitFor(() => {
      expect(screen.getByText('Add New Branch')).toBeInTheDocument();
    });

    // Try to submit without required fields
    fireEvent.click(screen.getByText('Save Branch'));

    // Verify validation errors
    await waitFor(() => {
      expect(screen.getByText('Branch name is required')).toBeInTheDocument();
      expect(screen.getByText('Branch code is required')).toBeInTheDocument();
      expect(screen.getByText('Address is required')).toBeInTheDocument();
    });

    // Fill in required fields
    fireEvent.change(screen.getByLabelText('Branch Name'), { target: { value: 'Medan Branch' } });
    fireEvent.change(screen.getByLabelText('Branch Code'), { target: { value: 'MDN-01' } });
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: 'Jl. Gatot Subroto No. 123, Medan' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '061-5554321' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'medan@samudrapaket.com' } });
    fireEvent.change(screen.getByLabelText('Branch Manager'), { target: { value: 'Robert Johnson' } });
    
    // Select branch type
    const typeSelect = screen.getByLabelText('Branch Type');
    fireEvent.change(typeSelect, { target: { value: 'branch' } });

    // Submit the form
    fireEvent.click(screen.getByText('Save Branch'));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Branch created successfully')).toBeInTheDocument();
    });
  });

  it('should edit an existing branch', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/master-data/branches/edit/branch-2']}>
          <BranchFormPage mode="edit" branchId="branch-2" />
        </MemoryRouter>
      </Provider>
    );

    // Wait for branch data to load
    await waitFor(() => {
      expect(screen.getByText('Edit Branch')).toBeInTheDocument();
      expect(screen.getByLabelText('Branch Name')).toHaveValue('Surabaya Branch');
    });

    // Update branch information
    fireEvent.change(screen.getByLabelText('Branch Name'), { target: { value: 'Surabaya Main Branch' } });
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '031-5559999' } });

    // Submit the form
    fireEvent.click(screen.getByText('Update Branch'));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Branch updated successfully')).toBeInTheDocument();
    });
  });

  it('should delete a branch after confirmation', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/master-data/branches']}>
          <BranchesPage />
        </MemoryRouter>
      </Provider>
    );

    // Wait for branches to load
    await waitFor(() => {
      expect(screen.getByText('Branch Management')).toBeInTheDocument();
    });

    // Find and click delete button for a branch
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[2]); // Delete the third branch

    // Verify confirmation dialog appears
    await waitFor(() => {
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this branch?')).toBeInTheDocument();
    });

    // Confirm deletion
    fireEvent.click(screen.getByText('Confirm'));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Branch deleted successfully')).toBeInTheDocument();
    });
  });

  it('should show branch location on a map', async () => {
    // Mock the Google Maps API
    global.google = {
      maps: {
        Map: jest.fn(),
        Marker: jest.fn(() => ({
          setMap: jest.fn()
        })),
        LatLng: jest.fn((lat, lng) => ({ lat, lng }))
      }
    };

    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/master-data/branches/branch-1']}>
          <BranchDetailPage branchId="branch-1" />
        </MemoryRouter>
      </Provider>
    );

    // Wait for branch data to load
    await waitFor(() => {
      expect(screen.getByText('Jakarta HQ')).toBeInTheDocument();
    });

    // Click on the "View on Map" tab or button
    fireEvent.click(screen.getByText('Location'));

    // Verify map container is displayed
    await waitFor(() => {
      expect(screen.getByTestId('branch-map-container')).toBeInTheDocument();
    });

    // Verify Google Maps was initialized
    expect(global.google.maps.Map).toHaveBeenCalled();
    expect(global.google.maps.Marker).toHaveBeenCalled();
  });

  it('should handle network errors gracefully', async () => {
    // Override the server to simulate a network error
    server.use(
      rest.get('/api/branches', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Internal server error' }));
      })
    );

    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/master-data/branches']}>
          <BranchesPage />
        </MemoryRouter>
      </Provider>
    );

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to load branches')).toBeInTheDocument();
      expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });

    // Verify retry button is displayed and works
    const retryButton = screen.getByText('Retry');
    
    // Reset the server to normal behavior
    server.resetHandlers();
    
    // Click retry
    fireEvent.click(retryButton);

    // Verify branches load after retry
    await waitFor(() => {
      expect(screen.getByText('Jakarta HQ')).toBeInTheDocument();
    });
  });
});
