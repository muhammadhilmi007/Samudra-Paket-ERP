"use client";

/**
 * EmployeesPage Component
 * Displays a list of employees with filtering, search, and pagination
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import DashboardLayout from '../templates/DashboardLayout';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import DataTable from '../organisms/DataTable';
import Modal from '../molecules/Modal';
import MasterDataNavigation from '../molecules/MasterDataNavigation';
import { createNotificationHandler } from '../../utils/notificationUtils';

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
      joinDate: '2020-05-15',
      status: 'ACTIVE',
      contractType: 'PERMANENT',
      contractEnd: null,
      avatar: null,
      performance: {
        rating: 4.5,
        attendance: 98,
        taskCompletion: 95
      }
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
      joinDate: '2021-02-10',
      status: 'ACTIVE',
      contractType: 'PERMANENT',
      contractEnd: null,
      avatar: null,
      performance: {
        rating: 4.2,
        attendance: 96,
        taskCompletion: 92
      }
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
      joinDate: '2022-01-05',
      status: 'ACTIVE',
      contractType: 'CONTRACT',
      contractEnd: '2024-01-04',
      avatar: null,
      performance: {
        rating: 3.8,
        attendance: 94,
        taskCompletion: 88
      }
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
      joinDate: '2021-08-20',
      status: 'ACTIVE',
      contractType: 'PERMANENT',
      contractEnd: null,
      avatar: null,
      performance: {
        rating: 4.0,
        attendance: 97,
        taskCompletion: 90
      }
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
      joinDate: '2022-03-15',
      status: 'INACTIVE',
      contractType: 'CONTRACT',
      contractEnd: '2023-03-14',
      avatar: null,
      performance: {
        rating: 3.5,
        attendance: 85,
        taskCompletion: 82
      }
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
      joinDate: '2019-11-10',
      status: 'ACTIVE',
      contractType: 'PERMANENT',
      contractEnd: null,
      avatar: null,
      performance: {
        rating: 4.7,
        attendance: 99,
        taskCompletion: 97
      }
    }
  ];
};

const EmployeesPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State
  const [employees, setEmployees] = useState(generateMockEmployees());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterContractType, setFilterContractType] = useState('');
  
  // Get unique departments for filtering
  const departments = [...new Set(employees.map(emp => emp.department))];
  
  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === '' || employee.department === filterDepartment;
    const matchesStatus = filterStatus === '' || employee.status === filterStatus;
    const matchesContractType = filterContractType === '' || employee.contractType === filterContractType;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesContractType;
  });
  
  // Open delete modal
  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };
  
  // Handle delete employee
  const handleDeleteEmployee = () => {
    const updatedEmployees = employees.filter(emp => emp.id !== selectedEmployee.id);
    
    setEmployees(updatedEmployees);
    setIsDeleteModalOpen(false);
    notifications.success('Employee deleted successfully');
  };
  
  // Handle view employee
  const handleViewEmployee = (employee) => {
    router.push(`/master-data/employees/${employee.id}`);
  };
  
  // Handle edit employee
  const handleEditEmployee = (employee) => {
    router.push(`/master-data/employees/edit/${employee.id}`);
  };
  
  // Table columns
  const columns = [
    {
      header: 'Employee',
      accessorKey: 'name',
      cell: (info) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {info.row.original.avatar ? (
              <img
                className="h-10 w-10 rounded-full"
                src={info.row.original.avatar}
                alt={info.getValue()}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium">
                  {info.getValue().split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-xs text-gray-500">{info.row.original.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Position',
      cell: (info) => (
        <div>
          <div className="text-sm font-medium">{info.row.original.position}</div>
          <div className="text-xs text-gray-500">{info.row.original.department}</div>
        </div>
      ),
    },
    {
      header: 'Branch',
      accessorKey: 'branch',
    },
    {
      header: 'Contact',
      cell: (info) => (
        <div>
          <div className="text-sm">{info.row.original.email}</div>
          <div className="text-xs text-gray-500">{info.row.original.phone}</div>
        </div>
      ),
    },
    {
      header: 'Contract',
      cell: (info) => (
        <div>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            info.row.original.contractType === 'PERMANENT' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {info.row.original.contractType === 'PERMANENT' ? 'Permanent' : 'Contract'}
          </div>
          {info.row.original.contractEnd && (
            <div className="text-xs text-gray-500 mt-1">
              Ends: {info.row.original.contractEnd}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Performance',
      cell: (info) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
            style={{
              backgroundColor: getRatingColor(info.row.original.performance.rating),
              color: '#fff'
            }}
          >
            {info.row.original.performance.rating}
          </div>
          <div className="text-xs">
            <div>{info.row.original.performance.attendance}% Attendance</div>
            <div>{info.row.original.performance.taskCompletion}% Tasks</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            info.getValue() === 'ACTIVE'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {info.getValue() === 'ACTIVE' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (info) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewEmployee(info.row.original)}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditEmployee(info.row.original)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => openDeleteModal(info.row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  
  // Helper function to get rating color
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#22c55e'; // green-500
    if (rating >= 4.0) return '#10b981'; // emerald-500
    if (rating >= 3.5) return '#3b82f6'; // blue-500
    if (rating >= 3.0) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <MasterDataNavigation />
          </div>
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h1" className="text-2xl font-bold">
                Employees
              </Typography>
              
              <Button
                variant="primary"
                onClick={() => router.push('/master-data/employees/add')}
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Employee
              </Button>
            </div>
            
            {/* Filters */}
            <Card className="mb-6">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                      Search
                    </label>
                    <input
                      type="text"
                      id="search"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="filterDepartment" className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      id="filterDepartment"
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="filterStatus"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="filterContractType" className="block text-sm font-medium text-gray-700 mb-1">
                      Contract Type
                    </label>
                    <select
                      id="filterContractType"
                      value={filterContractType}
                      onChange={(e) => setFilterContractType(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="">All Types</option>
                      <option value="PERMANENT">Permanent</option>
                      <option value="CONTRACT">Contract</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Employees Table */}
            <Card>
              <div className="p-4">
                <DataTable
                  columns={columns}
                  data={filteredEmployees}
                  pagination={true}
                  emptyMessage="No employees found"
                />
              </div>
            </Card>
            
            {/* Import/Export Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => notifications.info('Import functionality will be implemented soon')}
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                Import
              </Button>
              <Button
                variant="outline"
                onClick={() => notifications.info('Export functionality will be implemented soon')}
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <Typography variant="body1">
            Are you sure you want to delete the employee <span className="font-semibold">{selectedEmployee?.name}</span>?
            This action cannot be undone.
          </Typography>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteEmployee}
            >
              Delete Employee
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default EmployeesPage;
