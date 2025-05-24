import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrganizationalChartTab from '../../../../components/organisms/branch-detail/OrganizationalChartTab';

describe('OrganizationalChartTab Component', () => {
  const mockBranchId = 'branch-123';
  
  it('renders the component correctly', () => {
    render(<OrganizationalChartTab branchId={mockBranchId} />);
    
    // Check if the component renders correctly
    expect(screen.getByText('Organizational Chart')).toBeInTheDocument();
    expect(screen.getByText('Legend')).toBeInTheDocument();
    expect(screen.getByText('Print')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument(); // Default zoom level
  });
  
  it('displays the organizational chart with nodes', () => {
    render(<OrganizationalChartTab branchId={mockBranchId} />);
    
    // Check if the chart contains key positions
    expect(screen.getByText('Branch Manager')).toBeInTheDocument();
    expect(screen.getByText('Operations Supervisor')).toBeInTheDocument();
    expect(screen.getByText('Administrative Assistant')).toBeInTheDocument();
  });
  
  it('changes zoom level when zoom buttons are clicked', () => {
    render(<OrganizationalChartTab branchId={mockBranchId} />);
    
    // Initial zoom level
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    // Click zoom in button
    fireEvent.click(screen.getByText('100%').previousSibling);
    
    // Zoom level should decrease
    expect(screen.getByText('90%')).toBeInTheDocument();
    
    // Click zoom out button
    fireEvent.click(screen.getByText('90%').nextSibling);
    
    // Zoom level should increase back to 100%
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    // Click reset zoom button
    fireEvent.click(screen.getByText('100%'));
    
    // Zoom level should reset to 100%
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
  
  it('opens node detail modal when a node is clicked', () => {
    render(<OrganizationalChartTab branchId={mockBranchId} />);
    
    // Find and click the Branch Manager node
    const branchManagerNode = screen.getByText('Branch Manager');
    fireEvent.click(branchManagerNode);
    
    // Check if the modal is opened with position details
    expect(screen.getByText('Position Details')).toBeInTheDocument();
    expect(screen.getByText('Direct Reports')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Phone:')).toBeInTheDocument();
    
    // Close the modal
    fireEvent.click(screen.getByText('Close'));
    
    // Modal should be closed
    expect(screen.queryByText('Position Details')).not.toBeInTheDocument();
  });
  
  it('displays the legend with department colors', () => {
    render(<OrganizationalChartTab branchId={mockBranchId} />);
    
    // Check if the legend contains all departments
    expect(screen.getByText('Management')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
    expect(screen.getByText('Customer Service')).toBeInTheDocument();
    expect(screen.getByText('Warehouse')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
    expect(screen.getByText('Administration')).toBeInTheDocument();
  });
});
