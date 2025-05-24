"use client";

/**
 * OrgChartPage Component
 * Displays the organizational structure with employee positioning
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../templates/DashboardLayout';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import OrgChart from '../organisms/OrgChart';

// Mock data for organization chart
const generateMockOrgData = () => {
  return {
    id: 'emp-001',
    name: 'John Doe',
    title: 'CEO',
    employeeId: 'EMP-2023-001',
    department: 'Management',
    email: 'john.doe@samudrapaket.com',
    phone: '081234567890',
    avatar: null,
    children: [
      {
        id: 'emp-007',
        name: 'Ahmad Rizal',
        title: 'Finance Director',
        employeeId: 'EMP-2023-007',
        department: 'Finance',
        email: 'ahmad.rizal@samudrapaket.com',
        phone: '081234567896',
        avatar: null,
        children: [
          {
            id: 'emp-008',
            name: 'Siti Rahayu',
            title: 'Accountant',
            employeeId: 'EMP-2023-008',
            department: 'Finance',
            email: 'siti.rahayu@samudrapaket.com',
            phone: '081234567897',
            avatar: null,
            children: []
          }
        ]
      },
      {
        id: 'emp-006',
        name: 'Sarah Johnson',
        title: 'HR Director',
        employeeId: 'EMP-2023-006',
        department: 'Human Resources',
        email: 'sarah.johnson@samudrapaket.com',
        phone: '081234567895',
        avatar: null,
        children: []
      },
      {
        id: 'emp-009',
        name: 'David Lee',
        title: 'IT Director',
        employeeId: 'EMP-2023-009',
        department: 'IT',
        email: 'david.lee@samudrapaket.com',
        phone: '081234567898',
        avatar: null,
        children: []
      },
      {
        id: 'emp-002',
        name: 'Jane Smith',
        title: 'Operations Director',
        employeeId: 'EMP-2023-002',
        department: 'Operations',
        email: 'jane.smith@samudrapaket.com',
        phone: '081234567891',
        avatar: null,
        children: [
          {
            id: 'emp-004',
            name: 'Dewi Susanto',
            title: 'Warehouse Manager',
            employeeId: 'EMP-2023-004',
            department: 'Warehouse',
            email: 'dewi.susanto@samudrapaket.com',
            phone: '081234567893',
            avatar: null,
            children: []
          },
          {
            id: 'emp-011',
            name: 'Budi Santoso',
            title: 'Delivery Manager',
            employeeId: 'EMP-2023-011',
            department: 'Delivery',
            email: 'budi.santoso@samudrapaket.com',
            phone: '081234567800',
            avatar: null,
            children: [
              {
                id: 'emp-005',
                name: 'Robert Chen',
                title: 'Courier Supervisor',
                employeeId: 'EMP-2023-005',
                department: 'Delivery',
                email: 'robert.chen@samudrapaket.com',
                phone: '081234567894',
                avatar: null,
                children: []
              }
            ]
          },
          {
            id: 'emp-012',
            name: 'Linda Wijaya',
            title: 'Customer Service Manager',
            employeeId: 'EMP-2023-012',
            department: 'Customer Service',
            email: 'linda.wijaya@samudrapaket.com',
            phone: '081234567801',
            avatar: null,
            children: [
              {
                id: 'emp-003',
                name: 'Michael Wong',
                title: 'Customer Service Supervisor',
                employeeId: 'EMP-2023-003',
                department: 'Customer Service',
                email: 'michael.wong@samudrapaket.com',
                phone: '081234567892',
                avatar: null,
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 'emp-010',
        name: 'Maria Gonzalez',
        title: 'Marketing Director',
        employeeId: 'EMP-2023-010',
        department: 'Marketing',
        email: 'maria.gonzalez@samudrapaket.com',
        phone: '081234567899',
        avatar: null,
        children: []
      }
    ]
  };
};

const OrgChartPage = () => {
  const router = useRouter();
  
  // State
  const [orgData, setOrgData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Load org chart data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrgData(generateMockOrgData());
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Get unique departments for filtering
  const departments = orgData ? getUniqueDepartments(orgData) : [];
  
  // Function to extract all unique departments from the org chart data
  function getUniqueDepartments(data) {
    const departments = new Set();
    
    function traverse(node) {
      if (node.department) {
        departments.add(node.department);
      }
      
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => traverse(child));
      }
    }
    
    traverse(data);
    return [...departments];
  }
  
  // Function to filter org chart data by department
  function filterOrgData(data, department) {
    if (!department) return data;
    
    function traverse(node) {
      if (node.department === department) {
        return { ...node, children: [] };
      }
      
      if (node.children && node.children.length > 0) {
        const filteredChildren = node.children
          .map(child => traverse(child))
          .filter(Boolean);
        
        if (filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }
      }
      
      return null;
    }
    
    return traverse(data);
  }
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };
  
  // Handle reset zoom
  const handleResetZoom = () => {
    setZoomLevel(1);
  };
  
  // Handle view employee
  const handleViewEmployee = (employee) => {
    router.push(`/master-data/employees/${employee.id}`);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Filter org data based on department
  const filteredOrgData = filterDepartment ? filterOrgData(orgData, filterDepartment) : orgData;
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h1" className="text-2xl font-bold">
            Organization Chart
          </Typography>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </Button>
            <Button
              variant="outline"
              onClick={handleResetZoom}
              title="Reset Zoom"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Button>
            <Button
              variant="outline"
              onClick={handleZoomIn}
              title="Zoom In"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="filterDepartment"
                label="Filter by Department"
                type="select"
                name="filterDepartment"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                options={[
                  { value: '', label: 'All Departments' },
                  ...departments.map(dept => ({ value: dept, label: dept }))
                ]}
              />
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilterDepartment('')}
                  disabled={!filterDepartment}
                  className="mb-1"
                >
                  Clear Filter
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Organization Chart */}
        <Card className="overflow-hidden">
          <div className="p-4">
            <div className="overflow-auto" style={{ minHeight: '600px' }}>
              <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.3s ease' }}>
                {filteredOrgData ? (
                  <OrgChart
                    data={filteredOrgData}
                    onNodeClick={handleViewEmployee}
                  />
                ) : (
                  <div className="text-center py-12">
                    <Typography variant="body1" className="text-gray-500">
                      No organization data available
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Legend */}
        <div className="mt-6">
          <Typography variant="h3" className="text-lg font-semibold mb-3">
            Department Legend
          </Typography>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {departments.map(dept => (
              <div
                key={dept}
                className="flex items-center space-x-2 p-2 rounded-md bg-white border border-gray-200"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getDepartmentColor(dept) }}
                ></div>
                <Typography variant="body2" className="text-sm">
                  {dept}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Function to get a consistent color for a department
function getDepartmentColor(department) {
  const colors = {
    'Management': '#3b82f6', // blue-500
    'Finance': '#10b981', // emerald-500
    'Human Resources': '#8b5cf6', // violet-500
    'IT': '#6366f1', // indigo-500
    'Operations': '#f59e0b', // amber-500
    'Warehouse': '#d97706', // amber-600
    'Delivery': '#ef4444', // red-500
    'Customer Service': '#ec4899', // pink-500
    'Marketing': '#8b5cf6', // violet-500
  };
  
  return colors[department] || '#6b7280'; // gray-500 as default
}

export default OrgChartPage;
