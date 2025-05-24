"use client";

/**
 * EmployeeFormPage Component
 * Provides a multi-step wizard for creating and editing employees
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import DashboardLayout from '../templates/DashboardLayout';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import Stepper from '../molecules/Stepper';
import MasterDataNavigation from '../molecules/MasterDataNavigation';
import { createNotificationHandler } from '../../utils/notificationUtils';

// Form steps
import PersonalInfoForm from '../organisms/employee-form/PersonalInfoForm';
import EmploymentInfoForm from '../organisms/employee-form/EmploymentInfoForm';
import ContactInfoForm from '../organisms/employee-form/ContactInfoForm';
import DocumentsForm from '../organisms/employee-form/DocumentsForm';
import BankInfoForm from '../organisms/employee-form/BankInfoForm';
import EmergencyContactForm from '../organisms/employee-form/EmergencyContactForm';
import EducationForm from '../organisms/employee-form/EducationForm';
import ReviewForm from '../organisms/employee-form/ReviewForm';

// Mock data for an employee
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
    documents: []
  };
};

const EmployeeFormPage = ({ mode, employeeId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State for employee data
  const [employeeData, setEmployeeData] = useState({
    name: '',
    employeeId: '',
    position: '',
    department: '',
    branch: '',
    email: '',
    phone: '',
    joinDate: '',
    status: 'ACTIVE',
    contractType: 'PERMANENT',
    contractEnd: null,
    avatar: null,
    address: '',
    dateOfBirth: '',
    gender: 'MALE',
    nationality: 'Indonesian',
    identityNumber: '',
    taxNumber: '',
    bankAccount: {
      bank: '',
      accountNumber: '',
      accountName: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    education: [],
    documents: []
  });
  
  // State for current step
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  
  // Load employee data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && employeeId) {
      // Simulate API call
      setTimeout(() => {
        const data = getMockEmployee(employeeId);
        setEmployeeData(data);
        setIsLoading(false);
      }, 500);
    }
  }, [mode, employeeId]);
  
  // Steps configuration
  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Basic personal details',
      component: PersonalInfoForm,
    },
    {
      id: 'employment',
      title: 'Employment Details',
      description: 'Job and contract information',
      component: EmploymentInfoForm,
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Address and contact details',
      component: ContactInfoForm,
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Upload required documents',
      component: DocumentsForm,
    },
    {
      id: 'bank',
      title: 'Bank Information',
      description: 'Banking details for salary',
      component: BankInfoForm,
    },
    {
      id: 'emergency',
      title: 'Emergency Contact',
      description: 'Contact in case of emergency',
      component: EmergencyContactForm,
    },
    {
      id: 'education',
      title: 'Education',
      description: 'Educational background',
      component: EducationForm,
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Verify all information',
      component: ReviewForm,
    },
  ];
  
  // Handle form update
  const updateEmployeeData = (stepId, data) => {
    setEmployeeData(prevData => ({
      ...prevData,
      ...data
    }));
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      notifications.success(`Employee ${mode === 'add' ? 'created' : 'updated'} successfully`);
      router.push('/master-data/employees');
    }, 1000);
  };
  
  // Current step component
  const StepComponent = steps[currentStep].component;
  
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
                {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
              </Typography>
              
              <Button
                variant="outline"
                onClick={() => router.push('/master-data/employees')}
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancel
              </Button>
            </div>
            
            {/* Stepper */}
            <div className="mb-6">
              <Stepper
                steps={steps}
                currentStep={currentStep}
                onChange={(step) => setCurrentStep(step)}
              />
            </div>
            
            {/* Form */}
            <Card>
              <div className="p-6">
                <StepComponent
                  data={employeeData}
                  updateData={(data) => updateEmployeeData(steps[currentStep].id, data)}
                  mode={mode}
                />
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Button>
                  
                  {currentStep < steps.length - 1 ? (
                    <Button
                      variant="primary"
                      onClick={handleNextStep}
                    >
                      Next
                      <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          Submit
                          <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

EmployeeFormPage.propTypes = {
  mode: PropTypes.oneOf(['add', 'edit']).isRequired,
  employeeId: PropTypes.string,
};

export default EmployeeFormPage;
