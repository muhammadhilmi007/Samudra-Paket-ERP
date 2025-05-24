/**
 * BranchDivisionsPage Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '../../../store/api/apiSlice';
import { masterDataApi } from '../../../store/api/masterDataApi';
import BranchDivisionsPage from '../../../components/pages/BranchDivisionsPage';

// Mock the DashboardLayout component
jest.mock('../../../components/templates/DashboardLayout', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div data-testid="dashboard-layout">{children}</div>,
  };
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

const mockBranchDivisions = [
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
];

const mockDivisionBranches = [
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
];

// Mock API responses
const handlers = [
  {
    endpoint: masterDataApi.endpoints.getBranches.name,
    handler: () => mockBranches,
  },
  {
    endpoint: masterDataApi.endpoints.getDivisions.name,
    handler: () => mockDivisions,
  },
  {
    endpoint: masterDataApi.endpoints.getDivisionsByBranch.name,
    handler: () => mockBranchDivisions,
  },
  {
    endpoint: masterDataApi.endpoints.getBranchesByDivision.name,
    handler: () => mockDivisionBranches,
  },
  {
    endpoint: masterDataApi.endpoints.assignDivisionsToBranch.name,
    handler: () => ({ success: true }),
  },
  {
    endpoint: masterDataApi.endpoints.assignBranchesToDivision.name,
    handler: () => ({ success: true }),
  },
];

describe('BranchDivisionsPage Component', () => {
  let store;

  beforeEach(() => {
    store = setupStore();
    handlers.forEach(({ endpoint, handler }) => {
      store.dispatch(
        apiSlice.util.updateQueryData(
          'get' + endpoint.charAt(0).toUpperCase() + endpoint.slice(1),
          undefined,
          () => handler()
        )
      );
    });
  });

  it('renders the branch divisions page with tabs', async () => {
    render(
      <Provider store={store}>
        <BranchDivisionsPage />
      </Provider>
    );

    // Check if the page title is rendered
    expect(screen.getByText('Branch & Division Management')).toBeInTheDocument();
    
    // Check if both tabs are rendered
    expect(screen.getByText('Branches')).toBeInTheDocument();
    expect(screen.getByText('Divisions')).toBeInTheDocument();
    
    // Check if the branches table is rendered by default
    await waitFor(() => {
      expect(screen.getByText('Jakarta')).toBeInTheDocument();
      expect(screen.getByText('Bandung')).toBeInTheDocument();
    });
  });

  it('switches to divisions tab when clicked', async () => {
    render(
      <Provider store={store}>
        <BranchDivisionsPage />
      </Provider>
    );

    // Click the divisions tab
    fireEvent.click(screen.getByText('Divisions'));
    
    // Check if the divisions table is rendered
    await waitFor(() => {
      expect(screen.getByText('Operations')).toBeInTheDocument();
      expect(screen.getByText('Finance')).toBeInTheDocument();
    });
  });

  it('displays branch details and assigned divisions when a branch is selected', async () => {
    render(
      <Provider store={store}>
        <BranchDivisionsPage />
      </Provider>
    );

    // Wait for the branches table to be rendered
    await waitFor(() => {
      expect(screen.getByText('Jakarta')).toBeInTheDocument();
    });
    
    // Click the view divisions button for the first branch
    const viewButtons = screen.getAllByText('View Divisions');
    fireEvent.click(viewButtons[0]);
    
    // Check if the branch details and assigned divisions are displayed
    await waitFor(() => {
      expect(screen.getByText('Divisions in Jakarta')).toBeInTheDocument();
      expect(screen.getByText('Branch Code')).toBeInTheDocument();
      expect(screen.getByText('JKT')).toBeInTheDocument();
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });
  });

  it('displays division details and assigned branches when a division is selected', async () => {
    render(
      <Provider store={store}>
        <BranchDivisionsPage />
      </Provider>
    );

    // Click the divisions tab
    fireEvent.click(screen.getByText('Divisions'));
    
    // Wait for the divisions table to be rendered
    await waitFor(() => {
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });
    
    // Click the view branches button for the first division
    const viewButtons = screen.getAllByText('View Branches');
    fireEvent.click(viewButtons[0]);
    
    // Check if the division details and assigned branches are displayed
    await waitFor(() => {
      expect(screen.getByText('Branches with Operations Division')).toBeInTheDocument();
      expect(screen.getByText('Division Code')).toBeInTheDocument();
      expect(screen.getByText('OPS')).toBeInTheDocument();
      expect(screen.getByText('Jakarta')).toBeInTheDocument();
    });
  });

  it('opens the manage divisions modal when manage divisions button is clicked', async () => {
    render(
      <Provider store={store}>
        <BranchDivisionsPage />
      </Provider>
    );

    // Wait for the branches table to be rendered
    await waitFor(() => {
      expect(screen.getByText('Jakarta')).toBeInTheDocument();
    });
    
    // Click the view divisions button for the first branch
    const viewButtons = screen.getAllByText('View Divisions');
    fireEvent.click(viewButtons[0]);
    
    // Wait for the branch details to be displayed
    await waitFor(() => {
      expect(screen.getByText('Divisions in Jakarta')).toBeInTheDocument();
    });
    
    // Click the manage divisions button
    fireEvent.click(screen.getByText('Manage Divisions'));
    
    // Check if the modal is opened with the correct title
    await waitFor(() => {
      expect(screen.getByText('Manage Divisions for Jakarta')).toBeInTheDocument();
      expect(screen.getByText('Select divisions to assign to this branch:')).toBeInTheDocument();
    });
  });

  it('opens the manage branches modal when manage branches button is clicked', async () => {
    render(
      <Provider store={store}>
        <BranchDivisionsPage />
      </Provider>
    );

    // Click the divisions tab
    fireEvent.click(screen.getByText('Divisions'));
    
    // Wait for the divisions table to be rendered
    await waitFor(() => {
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });
    
    // Click the view branches button for the first division
    const viewButtons = screen.getAllByText('View Branches');
    fireEvent.click(viewButtons[0]);
    
    // Wait for the division details to be displayed
    await waitFor(() => {
      expect(screen.getByText('Branches with Operations Division')).toBeInTheDocument();
    });
    
    // Click the manage branches button
    fireEvent.click(screen.getByText('Manage Branches'));
    
    // Check if the modal is opened with the correct title
    await waitFor(() => {
      expect(screen.getByText('Manage Branches for Operations')).toBeInTheDocument();
      expect(screen.getByText('Select branches to assign to this division:')).toBeInTheDocument();
    });
  });
});
