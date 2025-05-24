import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import EmployeesPage from '../../components/pages/EmployeesPage';
import EmployeeDetailPage from '../../components/pages/EmployeeDetailPage';
import EmployeeFormPage from '../../components/pages/EmployeeFormPage';

// Mock employee data
const mockEmployees = [
  {
    id: 'emp-001',
    fullName: 'John Doe',
    employeeId: 'EMP-2023-001',
    position: 'Software Engineer',
    department: 'Engineering',
    email: 'john.doe@example.com',
    phone: '081234567890',
    joinDate: '2023-01-15',
    status: 'active'
  },
  {
    id: 'emp-002',
    fullName: 'Jane Smith',
    employeeId: 'EMP-2023-002',
    position: 'HR Manager',
    department: 'Human Resources',
    email: 'jane.smith@example.com',
    phone: '081234567891',
    joinDate: '2023-02-01',
    status: 'active'
  },
  {
    id: 'emp-003',
    fullName: 'David Wilson',
    employeeId: 'EMP-2023-003',
    position: 'Finance Analyst',
    department: 'Finance',
    email: 'david.wilson@example.com',
    phone: '081234567892',
    joinDate: '2023-03-10',
    status: 'active'
  }
];

// Mock API endpoints
const server = setupServer(
  // Get all employees
  rest.get('/api/employees', (req, res, ctx) => {
    return res(ctx.json(mockEmployees));
  }),
  
  // Get employee by ID
  rest.get('/api/employees/:id', (req, res, ctx) => {
    const employee = mockEmployees.find(e => e.id === req.params.id);
    if (employee) {
      return res(ctx.json(employee));
    }
    return res(ctx.status(404), ctx.json({ message: 'Employee not found' }));
  }),
  
  // Create employee
  rest.post('/api/employees', (req, res, ctx) => {
    // Validate required fields
    const { fullName, employeeId, position, email } = req.body;
    
    if (!fullName || !employeeId || !position || !email) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'Validation failed',
          errors: {
            fullName: !fullName ? 'Full name is required' : null,
            employeeId: !employeeId ? 'Employee ID is required' : null,
            position: !position ? 'Position is required' : null,
            email: !email ? 'Email is required' : null
          }
        })
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'Validation failed',
          errors: {
            email: 'Invalid email format'
          }
        })
      );
    }
    
    // Validate unique employee ID
    if (mockEmployees.some(e => e.employeeId === employeeId)) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'Validation failed',
          errors: {
            employeeId: 'Employee ID already exists'
          }
        })
      );
    }
    
    const newEmployee = {
      id: `emp-${mockEmployees.length + 1}`,
      ...req.body,
      status: 'active'
    };
    
    return res(ctx.status(201), ctx.json(newEmployee));
  }),
  
  // Update employee
  rest.put('/api/employees/:id', (req, res, ctx) => {
    // Validate required fields
    const { fullName, position, email } = req.body;
    
    if (!fullName || !position || !email) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'Validation failed',
          errors: {
            fullName: !fullName ? 'Full name is required' : null,
            position: !position ? 'Position is required' : null,
            email: !email ? 'Email is required' : null
          }
        })
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'Validation failed',
          errors: {
            email: 'Invalid email format'
          }
        })
      );
    }
    
    const updatedEmployee = {
      id: req.params.id,
      ...req.body
    };
    
    return res(ctx.json(updatedEmployee));
  }),
  
  // Delete employee
  rest.delete('/api/employees/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  })
);

// Start server before all tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close server after all tests
afterAll(() => server.close());

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    notifications: (state = { notifications: [] }, action) => state,
  },
});

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    pathname: '/',
  }),
}));

// Mock API calls
jest.mock('../../services/api/employeeService', () => ({
  getEmployees: jest.fn(() => Promise.resolve([])),
  getEmployeeById: jest.fn(() => Promise.resolve({})),
  createEmployee: jest.fn(() => Promise.resolve({})),
  updateEmployee: jest.fn(() => Promise.resolve({})),
  deleteEmployee: jest.fn(() => Promise.resolve({})),
}));

describe('Employee Management Integration Tests', () => {
  it('should navigate from employee list to employee detail', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/master-data/employees']}>
          <Routes>
            <Route path="/master-data/employees" element={<EmployeesPage />} />
            <Route path="/master-data/employees/:id" element={<EmployeeDetailPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for the employee list to load
    await waitFor(() => {
      expect(screen.getByText('Employees')).toBeInTheDocument();
    });

    // Find and click on the first "View" button
    const viewButtons = screen.getAllByText('View');
    fireEvent.click(viewButtons[0]);

    // Verify navigation to employee detail page
    await waitFor(() => {
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });
  });

  it('should navigate from employee list to add employee form', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/master-data/employees']}>
          <Routes>
            <Route path="/master-data/employees" element={<EmployeesPage />} />
            <Route path="/master-data/employees/add" element={<EmployeeFormPage mode="add" />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for the employee list to load
    await waitFor(() => {
      expect(screen.getByText('Employees')).toBeInTheDocument();
    });

    // Find and click on the "Add Employee" button
    const addButton = screen.getByText('Add Employee');
    fireEvent.click(addButton);

    // Verify navigation to add employee form
    await waitFor(() => {
      expect(screen.getByText('Add New Employee')).toBeInTheDocument();
    });
  });

  it('should complete the multi-step employee form workflow', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/master-data/employees/add']}>
          <EmployeeFormPage mode="add" />
        </MemoryRouter>
      </Provider>
    );

    // Step 1: Personal Information
    await waitFor(() => {
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    // Fill in personal information
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Employee ID'), { target: { value: 'EMP-2023-001' } });
    
    // Click Next button
    fireEvent.click(screen.getByText('Next'));

    // Step 2: Employment Information
    await waitFor(() => {
      expect(screen.getByText('Employment Information')).toBeInTheDocument();
    });

    // Fill in employment information
    fireEvent.change(screen.getByLabelText('Position'), { target: { value: 'Software Engineer' } });
    
    // Click Next button
    fireEvent.click(screen.getByText('Next'));

    // Continue through all steps until Review
    for (let i = 0; i < 5; i++) {
      // Click Next button for each step
      fireEvent.click(screen.getByText('Next'));
      await waitFor(() => {
        expect(screen.getByText('Next')).toBeInTheDocument();
      });
    }

    // Final step: Review & Submit
    await waitFor(() => {
      expect(screen.getByText('Review Information')).toBeInTheDocument();
    });

    // Click Submit button
    fireEvent.click(screen.getByText('Submit'));

    // Verify submission was successful
    await waitFor(() => {
      expect(screen.getByText('Employee created successfully')).toBeInTheDocument();
    });
  });

  it('should show employee contract tab and handle contract operations', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/master-data/employees/emp-001']}>
          <EmployeeDetailPage employeeId="emp-001" />
        </MemoryRouter>
      </Provider>
    );

    // Wait for the employee detail page to load
    await waitFor(() => {
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    // Click on the Contract tab
    const contractTab = screen.getByText('Contract');
    fireEvent.click(contractTab);

    // Verify contract tab is displayed
    await waitFor(() => {
      expect(screen.getByText('Employee Contracts')).toBeInTheDocument();
    });

    // Click Add Contract button
    const addContractButton = screen.getByText('Add Contract');
    fireEvent.click(addContractButton);

    // Verify contract form is displayed
    await waitFor(() => {
      expect(screen.getByText('Add New Contract')).toBeInTheDocument();
    });

    // Fill in contract form
    fireEvent.change(screen.getByLabelText('Job Title'), { target: { value: 'Senior Developer' } });
    
    // Submit contract form
    const saveButton = screen.getByText('Save Contract');
    fireEvent.click(saveButton);

    // Verify contract was added
    await waitFor(() => {
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    });
  });

  it('should show employee attendance tab with calendar view', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/master-data/employees/emp-001']}>
          <EmployeeDetailPage employeeId="emp-001" />
        </MemoryRouter>
      </Provider>
    );

    // Wait for the employee detail page to load
    await waitFor(() => {
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    // Click on the Attendance tab
    const attendanceTab = screen.getByText('Attendance');
    fireEvent.click(attendanceTab);

    // Verify attendance tab is displayed
    await waitFor(() => {
      expect(screen.getByText('Attendance Records')).toBeInTheDocument();
      expect(screen.getByText('Calendar View')).toBeInTheDocument();
    });

    // Verify monthly summary is displayed
    expect(screen.getByText('Monthly Summary')).toBeInTheDocument();
    expect(screen.getByText('Present')).toBeInTheDocument();
    expect(screen.getByText('Late')).toBeInTheDocument();
    expect(screen.getByText('Absent')).toBeInTheDocument();
  });
});
