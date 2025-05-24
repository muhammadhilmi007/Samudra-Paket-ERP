"use client";

/**
 * BranchesPage Component
 * Master data management for branches with CRUD operations
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
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useGetDivisionsByBranchQuery
} from '../../store/api/masterDataApi';
import { createNotificationHandler } from '../../utils/notificationUtils';

// Branch validation schema
const branchSchema = z.object({
  code: z.string()
    .min(2, 'Branch code must be at least 2 characters')
    .max(10, 'Branch code must not exceed 10 characters'),
  name: z.string()
    .min(3, 'Branch name must be at least 3 characters')
    .max(100, 'Branch name must not exceed 100 characters'),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address must not exceed 255 characters'),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters'),
  province: z.string()
    .min(2, 'Province must be at least 2 characters')
    .max(100, 'Province must not exceed 100 characters'),
  postalCode: z.string()
    .min(5, 'Postal code must be at least 5 characters')
    .max(10, 'Postal code must not exceed 10 characters'),
  phone: z.string()
    .min(8, 'Phone number must be at least 8 characters')
    .max(20, 'Phone number must not exceed 20 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters'),
  isActive: z.boolean().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

const BranchesPage = () => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State for modal and CRUD operations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // RTK Query hooks
  const { 
    data: branchesData, 
    isLoading: isLoadingBranches,
    isFetching: isFetchingBranches,
    refetch: refetchBranches
  } = useGetBranchesQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
  });
  
  const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();
  
  // Form setup
  const methods = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      code: '',
      name: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      phone: '',
      email: '',
      isActive: true,
      latitude: '',
      longitude: '',
    },
  });
  
  const { reset, handleSubmit } = methods;
  
  // Reset form when modal is opened/closed
  useEffect(() => {
    if (isModalOpen && modalMode === 'create') {
      reset({
        code: '',
        name: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        phone: '',
        email: '',
        isActive: true,
        latitude: '',
        longitude: '',
      });
    } else if (isModalOpen && modalMode === 'edit' && selectedBranch) {
      reset({
        code: selectedBranch.code,
        name: selectedBranch.name,
        address: selectedBranch.address,
        city: selectedBranch.city,
        province: selectedBranch.province,
        postalCode: selectedBranch.postalCode,
        phone: selectedBranch.phone,
        email: selectedBranch.email,
        isActive: selectedBranch.isActive,
        latitude: selectedBranch.latitude || '',
        longitude: selectedBranch.longitude || '',
      });
    }
  }, [isModalOpen, modalMode, selectedBranch, reset]);
  
  // Handle create branch
  const handleCreateBranch = async (data) => {
    try {
      await createBranch(data).unwrap();
      notifications.success('Branch created successfully');
      setIsModalOpen(false);
      refetchBranches();
    } catch (error) {
      console.error('Failed to create branch:', error);
      notifications.error(error?.data?.message || 'Failed to create branch');
    }
  };
  
  // Handle update branch
  const handleUpdateBranch = async (data) => {
    try {
      await updateBranch({
        id: selectedBranch.id,
        ...data,
      }).unwrap();
      notifications.success('Branch updated successfully');
      setIsModalOpen(false);
      refetchBranches();
    } catch (error) {
      console.error('Failed to update branch:', error);
      notifications.error(error?.data?.message || 'Failed to update branch');
    }
  };
  
  // Handle delete branch
  const handleDeleteBranch = async () => {
    try {
      await deleteBranch(branchToDelete.id).unwrap();
      notifications.success('Branch deleted successfully');
      setConfirmDelete(false);
      setBranchToDelete(null);
      refetchBranches();
    } catch (error) {
      console.error('Failed to delete branch:', error);
      notifications.error(error?.data?.message || 'Failed to delete branch');
    }
  };
  
  // Handle form submission
  const onSubmit = (data) => {
    if (modalMode === 'create') {
      handleCreateBranch(data);
    } else {
      handleUpdateBranch(data);
    }
  };
  
  // Open create modal
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedBranch(null);
    setIsModalOpen(true);
  };
  
  // Open edit modal
  const openEditModal = (branch) => {
    setModalMode('edit');
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };
  
  // Open delete confirmation
  const openDeleteConfirmation = (branch) => {
    setBranchToDelete(branch);
    setConfirmDelete(true);
  };
  
  // Table columns configuration
  const columns = [
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
      header: 'Province',
      accessorKey: 'province',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: (info) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            info.getValue()
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {info.getValue() ? 'Active' : 'Inactive'}
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
            onClick={() => openEditModal(info.row.original)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => openDeleteConfirmation(info.row.original)}
          >
            Delete
          </Button>
        </div>
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
                  Branches
                </Typography>
                <Typography variant="body2" className="text-gray-600 mt-1">
                  Manage company branches for Samudra Paket ERP
                </Typography>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => refetchBranches()}
                  disabled={isLoadingBranches || isFetchingBranches}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={openCreateModal}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Branch
                </Button>
              </div>
            </div>
        
            <Card>
              <div className="p-6">
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search branches..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <DataTable
                  columns={columns}
                  data={branchesData?.data || []}
                  isLoading={isLoadingBranches || isFetchingBranches}
                  pagination={{
                    pageCount: branchesData?.meta?.totalPages || 0,
                    pageIndex: currentPage - 1,
                    pageSize,
                    onPageChange: (page) => setCurrentPage(page + 1),
                    onPageSizeChange: (size) => {
                      setPageSize(size);
                      setCurrentPage(1);
                    },
                  }}
                />
              </div>
            </Card>
          </div>
        </div>
        
        {/* Create/Edit Branch Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalMode === 'create' ? 'Add New Branch' : 'Edit Branch'}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  name="code"
                  label="Branch Code"
                  type="text"
                  required
                  placeholder="e.g., JKT01"
                />
                
                <FormField
                  name="name"
                  label="Branch Name"
                  type="text"
                  required
                  placeholder="e.g., Jakarta Pusat"
                />
                
                <div className="md:col-span-2">
                  <FormField
                    name="address"
                    label="Address"
                    type="textarea"
                    required
                    placeholder="Enter branch address"
                  />
                </div>
                
                <FormField
                  name="city"
                  label="City"
                  type="text"
                  required
                  placeholder="e.g., Jakarta"
                />
                
                <FormField
                  name="province"
                  label="Province"
                  type="text"
                  required
                  placeholder="e.g., DKI Jakarta"
                />
                
                <FormField
                  name="postalCode"
                  label="Postal Code"
                  type="text"
                  required
                  placeholder="e.g., 10110"
                />
                
                <FormField
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  required
                  placeholder="e.g., +62 21 12345678"
                />
                
                <FormField
                  name="email"
                  label="Email Address"
                  type="email"
                  required
                  placeholder="e.g., jakarta@samudrapaket.com"
                />
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    {...methods.register('isActive')}
                  />
                  <label htmlFor="isActive" className="font-medium text-gray-700">
                    Active
                  </label>
                </div>
                
                <div className="md:col-span-2">
                  <Typography variant="h3" className="text-md font-medium mb-4">
                    Location Coordinates (Optional)
                  </Typography>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      name="latitude"
                      label="Latitude"
                      type="text"
                      placeholder="e.g., -6.1751"
                    />
                    
                    <FormField
                      name="longitude"
                      label="Longitude"
                      type="text"
                      placeholder="e.g., 106.8650"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating
                    ? 'Saving...'
                    : modalMode === 'create'
                    ? 'Create Branch'
                    : 'Update Branch'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </Modal>
        
        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={confirmDelete}
          onClose={() => {
            setConfirmDelete(false);
            setBranchToDelete(null);
          }}
          title="Confirm Delete"
        >
          <div className="space-y-4">
            <Typography variant="body1">
              Are you sure you want to delete the branch <span className="font-semibold">{branchToDelete?.name}</span>?
              This action cannot be undone.
            </Typography>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setConfirmDelete(false);
                  setBranchToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleDeleteBranch}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Branch'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default BranchesPage;
