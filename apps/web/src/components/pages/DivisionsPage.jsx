"use client";

/**
 * DivisionsPage Component
 * Master data management for divisions with CRUD operations
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
  useGetDivisionsQuery,
  useCreateDivisionMutation,
  useUpdateDivisionMutation,
  useDeleteDivisionMutation,
  useGetBranchesByDivisionQuery
} from '../../store/api/masterDataApi';
import { createNotificationHandler } from '../../utils/notificationUtils';

// Division validation schema
const divisionSchema = z.object({
  code: z.string()
    .min(2, 'Division code must be at least 2 characters')
    .max(10, 'Division code must not exceed 10 characters'),
  name: z.string()
    .min(3, 'Division name must be at least 3 characters')
    .max(100, 'Division name must not exceed 100 characters'),
  description: z.string()
    .max(255, 'Description must not exceed 255 characters')
    .optional(),
  manager: z.string()
    .max(100, 'Manager name must not exceed 100 characters')
    .optional(),
  contactEmail: z.string()
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters')
    .optional(),
  contactPhone: z.string()
    .max(20, 'Phone number must not exceed 20 characters')
    .optional(),
  isActive: z.boolean().optional(),
});

const DivisionsPage = () => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State for modal and CRUD operations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [divisionToDelete, setDivisionToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // RTK Query hooks
  const { 
    data: divisionsData, 
    isLoading: isLoadingDivisions,
    isFetching: isFetchingDivisions,
    refetch: refetchDivisions
  } = useGetDivisionsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
  });
  
  const [createDivision, { isLoading: isCreating }] = useCreateDivisionMutation();
  const [updateDivision, { isLoading: isUpdating }] = useUpdateDivisionMutation();
  const [deleteDivision, { isLoading: isDeleting }] = useDeleteDivisionMutation();
  
  // Form setup
  const methods = useForm({
    resolver: zodResolver(divisionSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      manager: '',
      contactEmail: '',
      contactPhone: '',
      isActive: true,
    },
  });
  
  const { reset, handleSubmit } = methods;
  
  // Reset form when modal is opened/closed
  useEffect(() => {
    if (isModalOpen && modalMode === 'create') {
      reset({
        code: '',
        name: '',
        description: '',
        manager: '',
        contactEmail: '',
        contactPhone: '',
        isActive: true,
      });
    } else if (isModalOpen && modalMode === 'edit' && selectedDivision) {
      reset({
        code: selectedDivision.code,
        name: selectedDivision.name,
        description: selectedDivision.description || '',
        manager: selectedDivision.manager || '',
        contactEmail: selectedDivision.contactEmail || '',
        contactPhone: selectedDivision.contactPhone || '',
        isActive: selectedDivision.isActive,
      });
    }
  }, [isModalOpen, modalMode, selectedDivision, reset]);
  
  // Handle create division
  const handleCreateDivision = async (data) => {
    try {
      await createDivision(data).unwrap();
      notifications.success('Division created successfully');
      setIsModalOpen(false);
      refetchDivisions();
    } catch (error) {
      console.error('Failed to create division:', error);
      notifications.error(error?.data?.message || 'Failed to create division');
    }
  };
  
  // Handle update division
  const handleUpdateDivision = async (data) => {
    try {
      await updateDivision({
        id: selectedDivision.id,
        ...data,
      }).unwrap();
      notifications.success('Division updated successfully');
      setIsModalOpen(false);
      refetchDivisions();
    } catch (error) {
      console.error('Failed to update division:', error);
      notifications.error(error?.data?.message || 'Failed to update division');
    }
  };
  
  // Handle delete division
  const handleDeleteDivision = async () => {
    try {
      await deleteDivision(divisionToDelete.id).unwrap();
      notifications.success('Division deleted successfully');
      setConfirmDelete(false);
      setDivisionToDelete(null);
      refetchDivisions();
    } catch (error) {
      console.error('Failed to delete division:', error);
      notifications.error(error?.data?.message || 'Failed to delete division');
    }
  };
  
  // Handle form submission
  const onSubmit = (data) => {
    if (modalMode === 'create') {
      handleCreateDivision(data);
    } else {
      handleUpdateDivision(data);
    }
  };
  
  // Open create modal
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedDivision(null);
    setIsModalOpen(true);
  };
  
  // Open edit modal
  const openEditModal = (division) => {
    setModalMode('edit');
    setSelectedDivision(division);
    setIsModalOpen(true);
  };
  
  // Open delete confirmation
  const openDeleteConfirmation = (division) => {
    setDivisionToDelete(division);
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
      header: 'Manager',
      accessorKey: 'manager',
      cell: (info) => info.getValue() || '-',
    },
    {
      header: 'Contact Email',
      accessorKey: 'contactEmail',
      cell: (info) => info.getValue() || '-',
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
                  Divisions
                </Typography>
                <Typography variant="body2" className="text-gray-600 mt-1">
                  Manage company divisions for Samudra Paket ERP
                </Typography>
              </div>
          
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => refetchDivisions()}
                  disabled={isLoadingDivisions || isFetchingDivisions}
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
                  Add Division
                </Button>
              </div>
            </div>
            
            <Card>
              <div className="p-6">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search divisions..."
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
              data={divisionsData?.data || []}
              isLoading={isLoadingDivisions || isFetchingDivisions}
              pagination={{
                pageCount: divisionsData?.meta?.totalPages || 0,
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
      </div>
      
      {/* Create/Edit Division Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Add New Division' : 'Edit Division'}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="code"
                label="Division Code"
                type="text"
                required
                placeholder="e.g., OPS"
              />
              
              <FormField
                name="name"
                label="Division Name"
                type="text"
                required
                placeholder="e.g., Operations"
              />
              
              <div className="md:col-span-2">
                <FormField
                  name="description"
                  label="Description"
                  type="textarea"
                  placeholder="Enter division description"
                />
              </div>
              
              <FormField
                name="manager"
                label="Manager"
                type="text"
                placeholder="e.g., John Doe"
              />
              
              <FormField
                name="contactEmail"
                label="Contact Email"
                type="email"
                placeholder="e.g., operations@samudrapaket.com"
              />
              
              <FormField
                name="contactPhone"
                label="Contact Phone"
                type="tel"
                placeholder="e.g., +62 812 3456 7890"
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
                  ? 'Create Division'
                  : 'Update Division'}
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
          setDivisionToDelete(null);
        }}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <Typography variant="body1">
            Are you sure you want to delete the division <span className="font-semibold">{divisionToDelete?.name}</span>?
            This action cannot be undone.
          </Typography>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfirmDelete(false);
                setDivisionToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteDivision}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Division'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default DivisionsPage;
