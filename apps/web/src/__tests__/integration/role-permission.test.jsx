import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import supertest from 'supertest';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Import components
import SettingsPage from '../../components/pages/SettingsPage';
import RoleManagementPage from '../../components/pages/RoleManagementPage';
import PermissionManagementPage from '../../components/pages/PermissionManagementPage';

// Mock API endpoints
const server = setupServer(
  // Get roles
  rest.get('/api/roles', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 'role-1', name: 'Admin', permissions: ['all'] },
        { id: 'role-2', name: 'Manager', permissions: ['read:all', 'write:own'] },
        { id: 'role-3', name: 'Employee', permissions: ['read:own'] }
      ])
    );
  }),
  
  // Get permissions
  rest.get('/api/permissions', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 'perm-1', name: 'read:all', description: 'Read all resources' },
        { id: 'perm-2', name: 'write:own', description: 'Write own resources' },
        { id: 'perm-3', name: 'read:own', description: 'Read own resources' }
      ])
    );
  }),
  
  // Create role
  rest.post('/api/roles', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ id: 'role-4', ...req.body }));
  }),
  
  // Update role
  rest.put('/api/roles/:id', (req, res, ctx) => {
    return res(ctx.json({ id: req.params.id, ...req.body }));
  }),
  
  // Delete role
  rest.delete('/api/roles/:id', (req, res, ctx) => {
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

describe('Role and Permission Management Integration Tests', () => {
  it('should display all roles with their permissions', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/settings/roles']}>
          <Routes>
            <Route path="/settings/roles" element={<RoleManagementPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for roles to load
    await waitFor(() => {
      expect(screen.getByText('Role Management')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('Manager')).toBeInTheDocument();
      expect(screen.getByText('Employee')).toBeInTheDocument();
    });
  });

  it('should create a new role with selected permissions', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/settings/roles']}>
          <Routes>
            <Route path="/settings/roles" element={<RoleManagementPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for roles to load
    await waitFor(() => {
      expect(screen.getByText('Role Management')).toBeInTheDocument();
    });

    // Click on "Add Role" button
    fireEvent.click(screen.getByText('Add Role'));

    // Fill in role details
    fireEvent.change(screen.getByLabelText('Role Name'), { target: { value: 'Supervisor' } });
    
    // Select permissions
    fireEvent.click(screen.getByLabelText('Read all resources'));
    fireEvent.click(screen.getByLabelText('Write own resources'));

    // Save the role
    fireEvent.click(screen.getByText('Save Role'));

    // Verify role was added
    await waitFor(() => {
      expect(screen.getByText('Supervisor')).toBeInTheDocument();
      expect(screen.getByText('Role created successfully')).toBeInTheDocument();
    });
  });

  it('should edit an existing role and update permissions', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/settings/roles']}>
          <Routes>
            <Route path="/settings/roles" element={<RoleManagementPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for roles to load
    await waitFor(() => {
      expect(screen.getByText('Role Management')).toBeInTheDocument();
    });

    // Find and click edit button for Manager role
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[1]); // Manager is the second role

    // Update role name
    fireEvent.change(screen.getByLabelText('Role Name'), { target: { value: 'Senior Manager' } });
    
    // Add additional permission
    fireEvent.click(screen.getByLabelText('Read all resources'));

    // Save the changes
    fireEvent.click(screen.getByText('Update Role'));

    // Verify role was updated
    await waitFor(() => {
      expect(screen.getByText('Senior Manager')).toBeInTheDocument();
      expect(screen.getByText('Role updated successfully')).toBeInTheDocument();
    });
  });

  it('should delete a role after confirmation', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/settings/roles']}>
          <Routes>
            <Route path="/settings/roles" element={<RoleManagementPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for roles to load
    await waitFor(() => {
      expect(screen.getByText('Role Management')).toBeInTheDocument();
    });

    // Find and click delete button for Employee role
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[2]); // Employee is the third role

    // Confirm deletion
    fireEvent.click(screen.getByText('Confirm'));

    // Verify role was deleted
    await waitFor(() => {
      expect(screen.queryByText('Employee')).not.toBeInTheDocument();
      expect(screen.getByText('Role deleted successfully')).toBeInTheDocument();
    });
  });

  it('should enforce permission checks when accessing protected features', async () => {
    // Override the mock store to use a non-admin role
    const restrictedStore = configureStore({
      reducer: {
        auth: (state = { user: { role: 'Employee' } }, action) => state,
        notifications: (state = { notifications: [] }, action) => state,
      },
    });

    render(
      <Provider store={restrictedStore}>
        <MemoryRouter initialEntries={['/settings/roles']}>
          <Routes>
            <Route path="/settings/roles" element={<RoleManagementPage />} />
            <Route path="/unauthorized" element={<div>Access Denied</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Should redirect to unauthorized page
    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });

  it('should test API endpoints directly with supertest', async () => {
    // This is a direct API test using supertest
    // In a real implementation, you would use the actual API URL
    const api = supertest('http://localhost:3000');
    
    // Test GET roles endpoint
    const rolesResponse = await api.get('/api/roles');
    expect(rolesResponse.status).toBe(200);
    expect(rolesResponse.body.length).toBe(3);
    
    // Test POST role endpoint
    const createResponse = await api
      .post('/api/roles')
      .send({
        name: 'Tester',
        permissions: ['read:own']
      });
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.name).toBe('Tester');
    
    // Test PUT role endpoint
    const updateResponse = await api
      .put('/api/roles/role-2')
      .send({
        name: 'Updated Manager',
        permissions: ['read:all', 'write:own', 'read:own']
      });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe('Updated Manager');
    
    // Test DELETE role endpoint
    const deleteResponse = await api.delete('/api/roles/role-3');
    expect(deleteResponse.status).toBe(204);
  });
});
