"use client";

/**
 * EmployeeDetailPage Component
 * Displays comprehensive information about an employee with tabbed interface
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import DashboardLayout from '../templates/DashboardLayout';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';
import Tabs from '../molecules/Tabs';
import MasterDataNavigation from '../molecules/MasterDataNavigation';
import { createNotificationHandler } from '../../utils/notificationUtils';

// Tab components
import EmployeeGeneralInfo from '../organisms/employee-detail/EmployeeGeneralInfo';
import EmployeeDocumentsTab from '../organisms/employee-detail/EmployeeDocumentsTab';
import EmployeeAssignmentTab from '../organisms/employee-detail/EmployeeAssignmentTab';
import EmployeeHistoryTab from '../organisms/employee-detail/EmployeeHistoryTab';
import EmployeePerformanceTab from '../organisms/employee-detail/EmployeePerformanceTab';
import EmployeeAttendanceTab from '../organisms/employee-detail/EmployeeAttendanceTab';
import EmployeeLeaveTab from '../organisms/employee-detail/EmployeeLeaveTab';
import EmployeeOvertimeTab from '../organisms/employee-detail/EmployeeOvertimeTab';
import EmployeeSkillsTab from '../organisms/employee-detail/EmployeeSkillsTab';
import EmployeeTrainingTab from '../organisms/employee-detail/EmployeeTrainingTab';
import EmployeeContractTab from '../organisms/employee-detail/EmployeeContractTab';

// Mock employee data
const getMockEmployee = (id) => {
  return {
    id,
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
    address: 'Jl. Sudirman No. 123, Jakarta',
    dateOfBirth: '1985-07-15',
    gender: 'MALE',
    nationality: 'Indonesian',
    identityNumber: '3175012345678901',
    taxNumber: '12.345.678.9-012.000',
    bankAccount: {
      bank: 'BCA',
      accountNumber: '1234567890',
      accountName: 'John Doe'
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '081234567899'
    },
    education: [
      {
        level: 'Bachelor',
        institution: 'University of Indonesia',
        major: 'Business Management',
        graduationYear: '2007'
      }
    ],
    performance: {
      rating: 4.5,
      attendance: 98,
      taskCompletion: 95
    }
  };
};

const EmployeeDetailPage = ({ employeeId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('general');
  
  // State for employee data
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load employee data
  useEffect(() => {
    if (employeeId) {
      // Simulate API call
      setTimeout(() => {
        const data = getMockEmployee(employeeId);
        setEmployee(data);
        setIsLoading(false);
      }, 500);
    }
  }, [employeeId]);
  
  // Define tabs
  const tabs = [
    {
      id: 'general',
      label: 'General Information',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'History',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'leave',
      label: 'Leave',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
    },
    {
      id: 'overtime',
      label: 'Overtime',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'training',
      label: 'Training',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: 'contract',
      label: 'Contract',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <MasterDataNavigation />
            </div>
            <div className="lg:col-span-3">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Error state
  if (!employee && !isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <MasterDataNavigation />
            </div>
            <div className="lg:col-span-3">
              <div className="flex flex-col items-center justify-center h-64">
                <svg className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Typography variant="h2" className="text-xl font-semibold text-gray-700">
                  Employee Not Found
                </Typography>
                <Typography variant="body1" className="text-gray-500 mt-2">
                  The employee you are looking for does not exist or has been deleted.
                </Typography>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => router.push('/master-data/employees')}
                >
                  Back to Employees
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <MasterDataNavigation />
          </div>
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-16 w-16">
                  {employee.avatar ? (
                    <img
                      className="h-16 w-16 rounded-full"
                      src={employee.avatar}
                      alt={employee.name}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-bold text-xl">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <Typography variant="h1" className="text-2xl font-bold mr-3">
                      {employee.name}
                    </Typography>
                    <Badge
                      variant={employee.status === 'ACTIVE' ? 'success' : 'danger'}
                      size="md"
                    >
                      {employee.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <Typography variant="body2" className="text-gray-600 mt-1">
                    {employee.position} | {employee.department} | {employee.employeeId}
                  </Typography>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => router.push('/master-data/employees')}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push(`/master-data/employees/edit/${employeeId}`)}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </Button>
              </div>
            </div>
            
            {/* Tabs */}
            <Card>
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={handleTabChange}
              />
              
              <div className="p-6">
                {activeTab === 'general' && (
                  <EmployeeGeneralInfo employee={employee} />
                )}
                
                {activeTab === 'documents' && (
                  <EmployeeDocumentsTab employeeId={employeeId} />
                )}
                
                {activeTab === 'assignments' && (
                  <EmployeeAssignmentTab employeeId={employeeId} />
                )}
                
                {activeTab === 'history' && (
                  <EmployeeHistoryTab employeeId={employeeId} />
                )}
                
                {activeTab === 'performance' && (
                  <EmployeePerformanceTab employeeId={employeeId} />
                )}
                
                {activeTab === 'attendance' && (
                  <EmployeeAttendanceTab employeeId={employeeId} />
                )}
                
                {activeTab === 'leave' && (
                  <EmployeeLeaveTab employeeId={employeeId} />
                )}
                
                {activeTab === 'overtime' && (
                  <EmployeeOvertimeTab employeeId={employeeId} />
                )}
                
                {activeTab === 'skills' && (
                  <EmployeeSkillsTab employeeId={employeeId} />
                )}
                
                {activeTab === 'training' && (
                  <EmployeeTrainingTab employeeId={employeeId} />
                )}
                
                {activeTab === 'contract' && (
                  <EmployeeContractTab employeeId={employeeId} />
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDetailPage;
