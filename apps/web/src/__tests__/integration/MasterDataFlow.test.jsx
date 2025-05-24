/**
 * Master Data Flow Integration Tests
 * Tests the integration between branches, divisions, and their relationships
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '../../store/api/apiSlice';
import { masterDataApi } from '../../store/api/masterDataApi';
import BranchesPage from '../../components/pages/BranchesPage';
import DivisionsPage from '../../components/pages/DivisionsPage';
import BranchDivisionsPage from '../../components/pages/BranchDivisionsPage';

// Mock the DashboardLayout component
jest.mock('../../components/templates/DashboardLayout', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div data-testid="dashboard-layout">{children}</div>,
  };
});

// Mock the notification handler
jest.mock('../../utils/notificationUtils', () => ({
  createNotificationHandler: () => ({
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  }),
}));

// Setup test store
const setupStore = (preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    preloadedState,
  });
  setupListeners(store.dispatch);
  return store;
};

// Mock data
const mockBranches = {
  data: [
    {
      id: '1',
      code: 'JKT',
      name: 'Jakarta',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '12345',
      phone: '+62 21 1234 5678',
      email: 'jakarta@samudrapaket.com',
      isActive: true,
    },
    {
      id: '2',
      code: 'BDG',
      name: 'Bandung',
      address: 'Jl. Asia Afrika No. 456',
      city: 'Bandung',
      province: 'Jawa Barat',
      postalCode: '40111',
      phone: '+62 22 1234 5678',
      email: 'bandung@samudrapaket.com',
      isActive: true,
    },
  ],
  meta: {
    totalItems: 2,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  },
};

const mockDivisions = {
  data: [
    {
      id: '1',
      code: 'OPS',
      name: 'Operations',
      description: 'Operations Division',
      manager: 'John Doe',
      contactEmail: 'operations@samudrapaket.com',
      contactPhone: '+62 812 3456 7890',
      isActive: true,
    },
    {
      id: '2',
      code: 'FIN',
      name: 'Finance',
      description: 'Finance Division',
      manager: 'Jane Smith',
      contactEmail: 'finance@samudrapaket.com',
      contactPhone: '+62 812 3456 7891',
      isActive: true,
    },
  ],
  meta: {
    totalItems: 2,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  },
};

// New branch and division data
const newBranch = {
  code: 'SBY',
  name: 'Surabaya',
  address: 'Jl. Pemuda No. 789',
  city: 'Surabaya',
  province: 'Jawa Timur',
  postalCode: '60111',
  phone: '+62 31 1234 5678',
  email: 'surabaya@samudrapaket.com',
  isActive: true,
};

const newDivision = {
  code: 'IT',
  name: 'Information Technology',
  description: 'IT Division',
  manager: 'Bob Johnson',
  contactEmail: 'it@samudrapaket.com',
  contactPhone: '+62 812 3456 7892',
  isActive: true,
};

// Mock API responses
const setupMockHandlers = (store) => {
  // Initial data
  store.dispatch(
    apiSlice.util.updateQueryData('getBranches', undefined, () => mockBranches)
  );
  store.dispatch(
    apiSlice.util.updateQueryData('getDivisions', undefined, () => mockDivisions)
  );
  
  // Empty relationship data initially
  store.dispatch(
    apiSlice.util.updateQueryData('getDivisionsByBranch', '1', () => [])
  );
  store.dispatch(
    apiSlice.util.updateQueryData('getBranchesByDivision', '1', () => [])
  );
  
  // Mock create branch
  masterDataApi.endpoints.createBranch.provide = jest.fn().mockImplementation(() => ({
    data: { id: '3', ...newBranch },
  }));
  
  // Mock create division
  masterDataApi.endpoints.createDivision.provide = jest.fn().mockImplementation(() => ({
    data: { id: '3', ...newDivision },
  }));
  
  // Mock assign divisions to branch
  masterDataApi.endpoints.assignDivisionsToBranch.provide = jest.fn().mockImplementation(() => ({
    data: { success: true },
  }));
  
  // Mock assign branches to division
  masterDataApi.endpoints.assignBranchesToDivision.provide = jest.fn().mockImplementation(() => ({
    data: { success: true },
  }));
  
  // After assignment, update the relationship data
  const assignedDivisions = [mockDivisions.data[0]];
  const assignedBranches = [mockBranches.data[0]];
  
  store.dispatch(
    apiSlice.util.updateQueryData('getDivisionsByBranch', '1', () => assignedDivisions)
  );
  store.dispatch(
    apiSlice.util.updateQueryData('getBranchesByDivision', '1', () => assignedBranches)
  );
};

describe('Master Data Flow Integration', () => {
  let store;

  beforeEach(() => {
    store = setupStore();
    setupMockHandlers(store);
  });

  it('creates a new branch and then assigns divisions to it', async () => {
    // Step 1: Render BranchesPage and create a new branch
    const { unmount } = render(
      <Provider store={store}>
        <BranchesPage />
      </Provider>
    );
    
    // Open the create branch modal
    fireEvent.click(screen.getByText('Add Branch'));
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Branch Code'), { target: { value: newBranch.code } });
    fireEvent.change(screen.getByLabelText('Branch Name'), { target: { value: newBranch.name } });
    fireEvent.change(screen.getByLabelText('City'), { target: { value: newBranch.city } });
    fireEvent.change(screen.getByLabelText('Province'), { target: { value: newBranch.province } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Create Branch'));
    
    // Wait for the success notification
    await waitFor(() => {
      expect(masterDataApi.endpoints.createBranch.provide).toHaveBeenCalled();
    });
    
    unmount();
    
    // Step 2: Render BranchDivisionsPage and assign divisions to the branch
    // Add the new branch to the mock data
    mockBranches.data.push({ id: '3', ...newBranch });
    
    render(
      <Provider store={store}>
        <BranchDivisionsPage />
      </Provider>
    );
    
    // Wait for the branches table to be rendered
    await waitFor(() => {
      expect(screen.getByText('Jakarta')).toBeInTheDocument();
      expect(screen.getByText('Surabaya')).toBeInTheDocument();
    });
    
    // Click on the first branch to view its divisions
    const viewButtons = screen.getAllByText('View Divisions');
    fireEvent.click(viewButtons[0]);
    
    // Wait for the branch details to be displayed
    await waitFor(() => {
      expect(screen.getByText('Divisions in Jakarta')).toBeInTheDocument();
    });
    
    // Click the manage divisions button
    fireEvent.click(screen.getByText('Manage Divisions'));
    
    // Wait for the modal to open
    await waitFor(() => {
      expect(screen.getByText('Manage Divisions for Jakarta')).toBeInTheDocument();
    });
    
    // Select a division
    const operationsCheckbox = screen.getByLabelText(/Operations/);
    fireEvent.click(operationsCheckbox);
    
    // Save the assignments
    fireEvent.click(screen.getByText('Save Assignments'));
    
    // Wait for the success notification
    await waitFor(() => {
      expect(masterDataApi.endpoints.assignDivisionsToBranch.provide).toHaveBeenCalled();
    });
  });

  it('creates a new division and then assigns branches to it', async () => {
    // Step 1: Render DivisionsPage and create a new division
    const { unmount } = render(
      <Provider store={store}>
        <DivisionsPage />
      </Provider>
    );
    
    // Open the create division modal
    fireEvent.click(screen.getByText('Add Division'));
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Division Code'), { target: { value: newDivision.code } });
    fireEvent.change(screen.getByLabelText('Division Name'), { target: { value: newDivision.name } });
    fireEvent.change(screen.getByLabelText('Manager'), { target: { value: newDivision.manager } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Create Division'));
    
    // Wait for the success notification
    await waitFor(() => {
      expect(masterDataApi.endpoints.createDivision.provide).toHaveBeenCalled();
    });
    
    unmount();
    
    // Step 2: Render BranchDivisionsPage and assign branches to the division
    // Add the new division to the mock data
    mockDivisions.data.push({ id: '3', ...newDivision });
    
    render(
      <Provider store={store}>
        <BranchDivisionsPage />
      </Provider>
    );
    
    // Switch to divisions tab
    fireEvent.click(screen.getByText('Divisions'));
    
    // Wait for the divisions table to be rendered
    await waitFor(() => {
      expect(screen.getByText('Operations')).toBeInTheDocument();
      expect(screen.getByText('Information Technology')).toBeInTheDocument();
    });
    
    // Click on the first division to view its branches
    const viewButtons = screen.getAllByText('View Branches');
    fireEvent.click(viewButtons[0]);
    
    // Wait for the division details to be displayed
    await waitFor(() => {
      expect(screen.getByText('Branches with Operations Division')).toBeInTheDocument();
    });
    
    // Click the manage branches button
    fireEvent.click(screen.getByText('Manage Branches'));
    
    // Wait for the modal to open
    await waitFor(() => {
      expect(screen.getByText('Manage Branches for Operations')).toBeInTheDocument();
    });
    
    // Select a branch
    const jakartaCheckbox = screen.getByLabelText(/Jakarta/);
    fireEvent.click(jakartaCheckbox);
    
    // Save the assignments
    fireEvent.click(screen.getByText('Save Assignments'));
    
    // Wait for the success notification
    await waitFor(() => {
      expect(masterDataApi.endpoints.assignBranchesToDivision.provide).toHaveBeenCalled();
    });
  });

  it('verifies the bidirectional relationship between branches and divisions', async () => {
    render(
      <Provider store={store}>
        <BranchDivisionsPage />
      </Provider>
    );
    
    // Step 1: View divisions for Jakarta branch
    await waitFor(() => {
      expect(screen.getByText('Jakarta')).toBeInTheDocument();
    });
    
    const viewDivisionsButtons = screen.getAllByText('View Divisions');
    fireEvent.click(viewDivisionsButtons[0]);
    
    // Verify Operations division is assigned to Jakarta
    await waitFor(() => {
      expect(screen.getByText('Divisions in Jakarta')).toBeInTheDocument();
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });
    
    // Step 2: Switch to divisions tab
    fireEvent.click(screen.getByText('Divisions'));
    
    // Wait for divisions to load
    await waitFor(() => {
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });
    
    // View branches for Operations division
    const viewBranchesButtons = screen.getAllByText('View Branches');
    fireEvent.click(viewBranchesButtons[0]);
    
    // Verify Jakarta branch is assigned to Operations
    await waitFor(() => {
      expect(screen.getByText('Branches with Operations Division')).toBeInTheDocument();
      expect(screen.getByText('Jakarta')).toBeInTheDocument();
    });
  });
});
