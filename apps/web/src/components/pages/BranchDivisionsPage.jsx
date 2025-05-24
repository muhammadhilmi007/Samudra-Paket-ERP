'use client';

/**
 * BranchDivisionsPage Component
 * Manage relationships between branches and divisions
 */

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import DashboardLayout from '../templates/DashboardLayout';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import DataTable from '../organisms/DataTable';
import Modal from '../molecules/Modal';
import MasterDataNavigation from '../molecules/MasterDataNavigation';
import {
  useGetBranchesQuery,
  useGetDivisionsQuery,
  useGetBranchesByDivisionQuery,
  useGetDivisionsByBranchQuery,
  useAssignDivisionsToBranchMutation,
  useAssignBranchesToDivisionMutation,
} from '../../store/api/masterDataApi';
import { createNotificationHandler } from '../../utils/notificationUtils';

// Assignment validation schema
const branchAssignmentSchema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  divisionIds: z.array(z.string()).min(1, 'At least one division must be selected'),
});

const divisionAssignmentSchema = z.object({
  divisionId: z.string().min(1, 'Division is required'),
  branchIds: z.array(z.string()).min(1, 'At least one branch must be selected'),
});

// Dynamic schema based on active tab
const getValidationSchema = (tab) => {
  return tab === 'branches' ? branchAssignmentSchema : divisionAssignmentSchema;
};

const BranchDivisionsPage = () => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);

  // State for tabs and selection
  const [activeTab, setActiveTab] = useState('branches'); // 'branches' or 'divisions'
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // RTK Query hooks
  const { data: branchesData, isLoading: isLoadingBranches } = useGetBranchesQuery({ limit: 100 });

  const { data: divisionsData, isLoading: isLoadingDivisions } = useGetDivisionsQuery({
    limit: 100,
  });

  const {
    data: branchDivisionsData,
    isLoading: isLoadingBranchDivisions,
    refetch: refetchBranchDivisions,
  } = useGetDivisionsByBranchQuery(selectedBranch?.id, {
    skip: !selectedBranch?.id,
  });

  const {
    data: divisionBranchesData,
    isLoading: isLoadingDivisionBranches,
    refetch: refetchDivisionBranches,
  } = useGetBranchesByDivisionQuery(selectedDivision?.id, {
    skip: !selectedDivision?.id,
  });

  // Form setup
  const methods = useForm({
    resolver: zodResolver(getValidationSchema(activeTab)),
    defaultValues:
      activeTab === 'branches'
        ? { branchId: '', divisionIds: [] }
        : { divisionId: '', branchIds: [] },
  });

  // Update form validation when tab changes
  useEffect(() => {
    methods.reset(
      activeTab === 'branches'
        ? { branchId: selectedBranch?.id || '', divisionIds: [] }
        : { divisionId: selectedDivision?.id || '', branchIds: [] }
    );
  }, [activeTab, methods, selectedBranch, selectedDivision]);

  const { reset, handleSubmit } = methods;

  // Reset form when modal is opened
  useEffect(() => {
    if (isAssignModalOpen) {
      if (activeTab === 'branches' && selectedBranch) {
        reset({
          branchId: selectedBranch.id,
          divisionIds: branchDivisionsData?.map((division) => division.id) || [],
        });
      } else if (activeTab === 'divisions' && selectedDivision) {
        reset({
          divisionId: selectedDivision.id,
          branchIds: divisionBranchesData?.map((branch) => branch.id) || [],
        });
      }
    }
  }, [
    isAssignModalOpen,
    activeTab,
    selectedBranch,
    selectedDivision,
    branchDivisionsData,
    divisionBranchesData,
    reset,
  ]);

  // RTK Query mutations for assignments
  const [assignDivisionsToBranch, { isLoading: isAssigningDivisions }] =
    useAssignDivisionsToBranchMutation();
  const [assignBranchesToDivision, { isLoading: isAssigningBranches }] =
    useAssignBranchesToDivisionMutation();

  // Handle assignment submission
  const handleAssignSubmit = async (data) => {
    try {
      if (activeTab === 'branches' && selectedBranch) {
        // Assign divisions to branch
        await assignDivisionsToBranch({
          branchId: selectedBranch.id,
          divisionIds: data.divisionIds,
        }).unwrap();
        notifications.success('Divisions assigned to branch successfully');
        refetchBranchDivisions();
      } else if (activeTab === 'divisions' && selectedDivision) {
        // Assign branches to division
        await assignBranchesToDivision({
          divisionId: selectedDivision.id,
          branchIds: data.branchIds,
        }).unwrap();
        notifications.success('Branches assigned to division successfully');
        refetchDivisionBranches();
      }
      setIsAssignModalOpen(false);
    } catch (error) {
      console.error('Failed to update assignments:', error);
      notifications.error(error?.data?.message || 'Failed to update assignments');
    }
  };

  // Handle branch selection
  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setSelectedDivision(null);
  };

  // Handle division selection
  const handleDivisionSelect = (division) => {
    setSelectedDivision(division);
    setSelectedBranch(null);
  };

  // Open assignment modal
  const openAssignModal = () => {
    setIsAssignModalOpen(true);
  };

  // Branch columns configuration
  const branchColumns = [
    {
      header: 'Code',
      accessorKey: 'code',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'City',
      accessorKey: 'city',
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: (info) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (info) => (
        <Button variant="outline" size="sm" onClick={() => handleBranchSelect(info.row.original)}>
          View Divisions
        </Button>
      ),
    },
  ];

  // Division columns configuration
  const divisionColumns = [
    {
      header: 'Code',
      accessorKey: 'code',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Manager',
      accessorKey: 'manager',
      cell: (info) => info.getValue() || '-',
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: (info) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (info) => (
        <Button variant="outline" size="sm" onClick={() => handleDivisionSelect(info.row.original)}>
          View Branches
        </Button>
      ),
    },
  ];

  // Assigned divisions columns
  const assignedDivisionsColumns = [
    {
      header: 'Code',
      accessorKey: 'code',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Manager',
      accessorKey: 'manager',
      cell: (info) => info.getValue() || '-',
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: (info) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  // Assigned branches columns
  const assignedBranchesColumns = [
    {
      header: 'Code',
      accessorKey: 'code',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'City',
      accessorKey: 'city',
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: (info) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            info.getValue() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <MasterDataNavigation />
          </div>
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <Typography variant="h1" className="text-2xl font-bold">
                  Branch & Division Management
                </Typography>
                <Typography variant="body2" className="text-gray-600 mt-1">
                  Manage relationships between branches and divisions
                </Typography>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    className={`py-4 px-6 text-sm font-medium ${
                      activeTab === 'branches'
                        ? 'border-b-2 border-primary-500 text-primary-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setActiveTab('branches');
                      setSelectedBranch(null);
                      setSelectedDivision(null);
                    }}
                  >
                    Branches
                  </button>
                  <button
                    className={`py-4 px-6 text-sm font-medium ${
                      activeTab === 'divisions'
                        ? 'border-b-2 border-primary-500 text-primary-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setActiveTab('divisions');
                      setSelectedBranch(null);
                      setSelectedDivision(null);
                    }}
                  >
                    Divisions
                  </button>
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left panel */}
              <Card>
                <div className="p-6">
                  <Typography variant="h2" className="text-lg font-medium mb-4">
                    {activeTab === 'branches' ? 'Branches' : 'Divisions'}
                  </Typography>

                  <DataTable
                    columns={activeTab === 'branches' ? branchColumns : divisionColumns}
                    data={
                      activeTab === 'branches'
                        ? branchesData?.data || []
                        : divisionsData?.data || []
                    }
                    isLoading={activeTab === 'branches' ? isLoadingBranches : isLoadingDivisions}
                    emptyMessage={`No ${activeTab} found`}
                  />
                </div>
              </Card>

              {/* Right panel */}
              <Card>
                <div className="p-6">
                  {selectedBranch && (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <Typography variant="h2" className="text-lg font-medium">
                          Divisions in {selectedBranch.name}
                        </Typography>
                        <Button variant="primary" size="sm" onClick={openAssignModal}>
                          Manage Divisions
                        </Button>
                      </div>

                      <div className="mb-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Typography variant="body2" className="text-gray-500">
                                Branch Code
                              </Typography>
                              <Typography variant="body1" className="font-medium">
                                {selectedBranch.code}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="body2" className="text-gray-500">
                                City
                              </Typography>
                              <Typography variant="body1" className="font-medium">
                                {selectedBranch.city}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="body2" className="text-gray-500">
                                Province
                              </Typography>
                              <Typography variant="body1" className="font-medium">
                                {selectedBranch.province}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="body2" className="text-gray-500">
                                Status
                              </Typography>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  selectedBranch.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {selectedBranch.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <DataTable
                        columns={assignedDivisionsColumns}
                        data={branchDivisionsData || []}
                        isLoading={isLoadingBranchDivisions}
                        emptyMessage="No divisions assigned to this branch"
                      />
                    </>
                  )}

                  {selectedDivision && (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <Typography variant="h2" className="text-lg font-medium">
                          Branches with {selectedDivision.name} Division
                        </Typography>
                        <Button variant="primary" size="sm" onClick={openAssignModal}>
                          Manage Branches
                        </Button>
                      </div>

                      <div className="mb-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Typography variant="body2" className="text-gray-500">
                                Division Code
                              </Typography>
                              <Typography variant="body1" className="font-medium">
                                {selectedDivision.code}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="body2" className="text-gray-500">
                                Manager
                              </Typography>
                              <Typography variant="body1" className="font-medium">
                                {selectedDivision.manager || '-'}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="body2" className="text-gray-500">
                                Contact Email
                              </Typography>
                              <Typography variant="body1" className="font-medium">
                                {selectedDivision.contactEmail || '-'}
                              </Typography>
                            </div>
                            <div>
                              <Typography variant="body2" className="text-gray-500">
                                Status
                              </Typography>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  selectedDivision.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {selectedDivision.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <DataTable
                        columns={assignedBranchesColumns}
                        data={divisionBranchesData || []}
                        isLoading={isLoadingDivisionBranches}
                        emptyMessage="No branches assigned to this division"
                      />
                    </>
                  )}

                  {!selectedBranch && !selectedDivision && (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                        />
                      </svg>
                      <Typography variant="h3" className="mt-2 text-sm font-medium text-gray-900">
                        {activeTab === 'branches'
                          ? 'Select a branch to view assigned divisions'
                          : 'Select a division to view assigned branches'}
                      </Typography>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={
          activeTab === 'branches'
            ? `Manage Divisions for ${selectedBranch?.name}`
            : `Manage Branches for ${selectedDivision?.name}`
        }
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleAssignSubmit)} className="space-y-6">
            {activeTab === 'branches' && (
              <div>
                <Typography variant="body2" className="mb-2">
                  Select divisions to assign to this branch:
                </Typography>

                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {divisionsData?.data?.map((division) => (
                    <div key={division.id} className="flex items-center p-2 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`division-${division.id}`}
                        value={division.id}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        {...methods.register('divisionIds')}
                      />
                      <label
                        htmlFor={`division-${division.id}`}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {division.name} ({division.code})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'divisions' && (
              <div>
                <Typography variant="body2" className="mb-2">
                  Select branches to assign to this division:
                </Typography>

                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {branchesData?.data?.map((branch) => (
                    <div key={branch.id} className="flex items-center p-2 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`branch-${branch.id}`}
                        value={branch.id}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        {...methods.register('branchIds')}
                      />
                      <label
                        htmlFor={`branch-${branch.id}`}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {branch.name} ({branch.code})
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isAssigningDivisions || isAssigningBranches}
              >
                {isAssigningDivisions || isAssigningBranches ? 'Saving...' : 'Save Assignments'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </DashboardLayout>
  );
};

export default BranchDivisionsPage;
