import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmployeeContractTab from '../../../../components/organisms/employee-detail/EmployeeContractTab';

// Mock the Dialog component from shadcn/ui
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }) => (open ? <div data-testid="dialog-content">{children}</div> : null),
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <div>{children}</div>,
  DialogTrigger: ({ children }) => <div>{children}</div>,
}));

// Mock the Button component from shadcn/ui
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, ...props }) => (
    <button onClick={onClick} data-variant={variant} data-size={size} {...props}>
      {children}
    </button>
  ),
}));

describe('EmployeeContractTab', () => {
  const mockEmployeeId = 'EMP001';

  it('renders the component with contract data', () => {
    render(<EmployeeContractTab employeeId={mockEmployeeId} />);
    
    // Check if the component title is rendered
    expect(screen.getByText('Employee Contracts')).toBeInTheDocument();
    
    // Check if the add contract button is rendered
    expect(screen.getByText('Add Contract')).toBeInTheDocument();
    
    // Check if contract data is displayed in the table
    expect(screen.getByText('Permanent')).toBeInTheDocument();
    expect(screen.getByText('Fixed-Term')).toBeInTheDocument();
  });

  it('opens the add contract dialog when the add button is clicked', () => {
    render(<EmployeeContractTab employeeId={mockEmployeeId} />);
    
    // Click the add contract button
    fireEvent.click(screen.getByText('Add Contract'));
    
    // Check if the dialog is opened with the correct title
    expect(screen.getByText('Add New Contract')).toBeInTheDocument();
    
    // Check if form fields are rendered
    expect(screen.getByText('Contract Type')).toBeInTheDocument();
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
    expect(screen.getByText('Job Title')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Salary (IDR)')).toBeInTheDocument();
  });

  it('highlights contracts that are nearing expiration', () => {
    render(<EmployeeContractTab employeeId="EMP002" />);
    
    // Check if the warning icon is present for contracts nearing expiration
    const warningIcons = screen.getAllByTitle('Nearing expiration');
    expect(warningIcons.length).toBeGreaterThan(0);
  });

  it('shows renew button for active contracts with end dates', () => {
    render(<EmployeeContractTab employeeId={mockEmployeeId} />);
    
    // Check if the renew button is present for active contracts with end dates
    const renewButtons = screen.getAllByText('Renew');
    expect(renewButtons.length).toBeGreaterThan(0);
  });

  it('displays view document link for contracts', () => {
    render(<EmployeeContractTab employeeId={mockEmployeeId} />);
    
    // Check if the view document link is present
    const viewDocLinks = screen.getAllByText('View Doc');
    expect(viewDocLinks.length).toBeGreaterThan(0);
  });
});
