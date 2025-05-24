"use client";

/**
 * EmployeeDirectoryPage Component
 * Displays a searchable directory of all employees
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../templates/DashboardLayout';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';

// Mock data for employees
const generateMockEmployees = () => {
  return [
    {
      id: 'emp-001',
      name: 'John Doe',
      employeeId: 'EMP-2023-001',
      position: 'Branch Manager',
      department: 'Management',
      branch: 'Jakarta Branch',
      email: 'john.doe@samudrapaket.com',
      phone: '081234567890',
      avatar: null,
    },
    {
      id: 'emp-002',
      name: 'Jane Smith',
      employeeId: 'EMP-2023-002',
      position: 'Operations Supervisor',
      department: 'Operations',
      branch: 'Jakarta Branch',
      email: 'jane.smith@samudrapaket.com',
      phone: '081234567891',
      avatar: null,
    },
    {
      id: 'emp-003',
      name: 'Michael Wong',
      employeeId: 'EMP-2023-003',
      position: 'Customer Service Representative',
      department: 'Customer Service',
      branch: 'Jakarta Branch',
      email: 'michael.wong@samudrapaket.com',
      phone: '081234567892',
      avatar: null,
    },
    {
      id: 'emp-004',
      name: 'Dewi Susanto',
      employeeId: 'EMP-2023-004',
      position: 'Warehouse Coordinator',
      department: 'Warehouse',
      branch: 'Jakarta Branch',
      email: 'dewi.susanto@samudrapaket.com',
      phone: '081234567893',
      avatar: null,
    },
    {
      id: 'emp-005',
      name: 'Robert Chen',
      employeeId: 'EMP-2023-005',
      position: 'Courier',
      department: 'Delivery',
      branch: 'Jakarta Branch',
      email: 'robert.chen@samudrapaket.com',
      phone: '081234567894',
      avatar: null,
    },
    {
      id: 'emp-006',
      name: 'Sarah Johnson',
      employeeId: 'EMP-2023-006',
      position: 'HR Manager',
      department: 'Human Resources',
      branch: 'Jakarta Branch',
      email: 'sarah.johnson@samudrapaket.com',
      phone: '081234567895',
      avatar: null,
    },
    {
      id: 'emp-007',
      name: 'Ahmad Rizal',
      employeeId: 'EMP-2023-007',
      position: 'Finance Manager',
      department: 'Finance',
      branch: 'Bandung Branch',
      email: 'ahmad.rizal@samudrapaket.com',
      phone: '081234567896',
      avatar: null,
    },
    {
      id: 'emp-008',
      name: 'Siti Rahayu',
      employeeId: 'EMP-2023-008',
      position: 'Accountant',
      department: 'Finance',
      branch: 'Bandung Branch',
      email: 'siti.rahayu@samudrapaket.com',
      phone: '081234567897',
      avatar: null,
    },
    {
      id: 'emp-009',
      name: 'David Lee',
      employeeId: 'EMP-2023-009',
      position: 'IT Manager',
      department: 'IT',
      branch: 'Jakarta Branch',
      email: 'david.lee@samudrapaket.com',
      phone: '081234567898',
      avatar: null,
    },
    {
      id: 'emp-010',
      name: 'Maria Gonzalez',
      employeeId: 'EMP-2023-010',
      position: 'Marketing Specialist',
      department: 'Marketing',
      branch: 'Jakarta Branch',
      email: 'maria.gonzalez@samudrapaket.com',
      phone: '081234567899',
      avatar: null,
    },
    {
      id: 'emp-011',
      name: 'Budi Santoso',
      employeeId: 'EMP-2023-011',
      position: 'Delivery Driver',
      department: 'Delivery',
      branch: 'Surabaya Branch',
      email: 'budi.santoso@samudrapaket.com',
      phone: '081234567800',
      avatar: null,
    },
    {
      id: 'emp-012',
      name: 'Linda Wijaya',
      employeeId: 'EMP-2023-012',
      position: 'Customer Service Manager',
      department: 'Customer Service',
      branch: 'Surabaya Branch',
      email: 'linda.wijaya@samudrapaket.com',
      phone: '081234567801',
      avatar: null,
    }
  ];
};

const EmployeeDirectoryPage = () => {
  const router = useRouter();
  
  // State
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Load employees
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEmployees(generateMockEmployees());
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Get unique departments and branches for filtering
  const departments = [...new Set(employees.map(emp => emp.department))];
  const branches = [...new Set(employees.map(emp => emp.branch))];
  
  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === '' || employee.department === filterDepartment;
    const matchesBranch = filterBranch === '' || employee.branch === filterBranch;
    
    return matchesSearch && matchesDepartment && matchesBranch;
  });
  
  // Handle view employee
  const handleViewEmployee = (employee) => {
    router.push(`/master-data/employees/${employee.id}`);
  };
  
  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
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
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h1" className="text-2xl font-bold">
            Employee Directory
          </Typography>
          
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                id="search"
                label="Search"
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, ID, position..."
              />
              
              <FormField
                id="filterDepartment"
                label="Department"
                type="select"
                name="filterDepartment"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                options={[
                  { value: '', label: 'All Departments' },
                  ...departments.map(dept => ({ value: dept, label: dept }))
                ]}
              />
              
              <FormField
                id="filterBranch"
                label="Branch"
                type="select"
                name="filterBranch"
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                options={[
                  { value: '', label: 'All Branches' },
                  ...branches.map(branch => ({ value: branch, label: branch }))
                ]}
              />
            </div>
          </div>
        </Card>
        
        {/* Directory */}
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <Typography variant="h2" className="mt-2 text-lg font-medium text-gray-900">
              No employees found
            </Typography>
            <Typography variant="body1" className="mt-1 text-gray-500">
              Try adjusting your search or filter criteria
            </Typography>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-4 flex flex-col items-center text-center">
                  <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    {employee.avatar ? (
                      <img
                        className="h-20 w-20 rounded-full"
                        src={employee.avatar}
                        alt={employee.name}
                      />
                    ) : (
                      <span className="text-primary-700 font-bold text-xl">
                        {getInitials(employee.name)}
                      </span>
                    )}
                  </div>
                  
                  <Typography variant="h3" className="text-lg font-semibold text-gray-900 mb-1">
                    {employee.name}
                  </Typography>
                  
                  <Typography variant="body2" className="text-sm text-gray-500 mb-2">
                    {employee.position}
                  </Typography>
                  
                  <div className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600 mb-3">
                    {employee.department}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    <div>{employee.email}</div>
                    <div>{employee.phone}</div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleViewEmployee(employee)}
                  >
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branch
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {employee.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={employee.avatar}
                                alt={employee.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-primary-700 font-medium">
                                  {getInitials(employee.name)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{employee.name}</div>
                            <div className="text-xs text-gray-500">{employee.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium">{employee.position}</div>
                          <div className="text-xs text-gray-500">{employee.department}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm">{employee.email}</div>
                          <div className="text-xs text-gray-500">{employee.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewEmployee(employee)}
                        >
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDirectoryPage;
