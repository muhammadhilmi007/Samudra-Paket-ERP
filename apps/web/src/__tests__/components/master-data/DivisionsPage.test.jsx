/**
 * DivisionsPage Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '../../../store/api/apiSlice';
import { masterDataApi } from '../../../store/api/masterDataApi';
import DivisionsPage from '../../../components/pages/DivisionsPage';

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

// Mock API responses
const handlers = [
  {
    endpoint: masterDataApi.endpoints.getDivisions.name,
    handler: () => mockDivisions,
  },
  {
    endpoint: masterDataApi.endpoints.createDivision.name,
    handler: () => ({ id: '3', ...newDivision }),
  },
  {
    endpoint: masterDataApi.endpoints.updateDivision.name,
    handler: (arg) => ({ id: arg.id, ...arg }),
  },
  {
    endpoint: masterDataApi.endpoints.deleteDivision.name,
    handler: () => ({ success: true }),
  },
];

// New division data
const newDivision = {
  code: 'IT',
  name: 'Information Technology',
  description: 'IT Division',
  manager: 'Bob Johnson',
  contactEmail: 'it@samudrapaket.com',
  contactPhone: '+62 812 3456 7892',
  isActive: true,
};

describe('DivisionsPage Component', () => {
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

  it('renders the divisions page with table', async () => {
    render(
      <Provider store={store}>
        <DivisionsPage />
      </Provider>
    );

    // Check if the page title is rendered
    expect(screen.getByText('Divisions')).toBeInTheDocument();
    
    // Check if the add division button is rendered
    expect(screen.getByText('Add Division')).toBeInTheDocument();
    
    // Check if the table is rendered with division data
    await waitFor(() => {
      expect(screen.getByText('Operations')).toBeInTheDocument();
      expect(screen.getByText('Finance')).toBeInTheDocument();
    });
  });

  it('opens the create division modal when add button is clicked', async () => {
    render(
      <Provider store={store}>
        <DivisionsPage />
      </Provider>
    );

    // Click the add division button
    fireEvent.click(screen.getByText('Add Division'));
    
    // Check if the modal is opened with the correct title
    await waitFor(() => {
      expect(screen.getByText('Add New Division')).toBeInTheDocument();
      expect(screen.getByLabelText('Division Code')).toBeInTheDocument();
      expect(screen.getByLabelText('Division Name')).toBeInTheDocument();
    });
  });

  it('validates form inputs when creating a division', async () => {
    render(
      <Provider store={store}>
        <DivisionsPage />
      </Provider>
    );

    // Open the create division modal
    fireEvent.click(screen.getByText('Add Division'));
    
    // Submit the form without filling required fields
    fireEvent.click(screen.getByText('Create Division'));
    
    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText('Division code must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Division name must be at least 3 characters')).toBeInTheDocument();
    });
  });

  it('opens the edit division modal when edit button is clicked', async () => {
    render(
      <Provider store={store}>
        <DivisionsPage />
      </Provider>
    );

    // Wait for the table to be rendered
    await waitFor(() => {
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });
    
    // Click the edit button for the first division
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    // Check if the modal is opened with the correct title and pre-filled values
    await waitFor(() => {
      expect(screen.getByText('Edit Division')).toBeInTheDocument();
      expect(screen.getByDisplayValue('OPS')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Operations')).toBeInTheDocument();
    });
  });

  it('opens the delete confirmation when delete button is clicked', async () => {
    render(
      <Provider store={store}>
        <DivisionsPage />
      </Provider>
    );

    // Wait for the table to be rendered
    await waitFor(() => {
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });
    
    // Click the delete button for the first division
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Check if the confirmation modal is opened
    await waitFor(() => {
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete the division/)).toBeInTheDocument();
    });
  });
});
