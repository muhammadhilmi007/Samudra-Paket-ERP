"use client";

/**
 * ForwardersPage Component
 * Displays a list of forwarders with filtering, search, and pagination
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

// Mock data for forwarders
const generateMockForwarders = () => {
  return [
    {
      id: 'fwd-001',
      name: 'Express Logistics',
      code: 'EL001',
      type: 'NATIONAL',
      contactPerson: 'John Smith',
      phone: '021-5551234',
      email: 'contact@expresslogistics.com',
      address: 'Jl. Sudirman No. 123, Jakarta',
      contractNumber: 'CTR-2023-001',
      contractStartDate: '2023-01-01',
      contractEndDate: '2024-12-31',
      isActive: true,
      serviceAreas: 15,
      rates: 48,
      performance: {
        onTimeDelivery: 92,
        damageRate: 0.5,
        returnRate: 1.2
      }
    },
    {
      id: 'fwd-002',
      name: 'Global Shipping Partners',
      code: 'GSP002',
      type: 'INTERNATIONAL',
      contactPerson: 'Sarah Johnson',
      phone: '021-5552345',
      email: 'info@globalshipping.com',
      address: 'Jl. Gatot Subroto No. 45, Jakarta',
      contractNumber: 'CTR-2023-002',
      contractStartDate: '2023-02-15',
      contractEndDate: '2025-02-14',
      isActive: true,
      serviceAreas: 28,
      rates: 120,
      performance: {
        onTimeDelivery: 88,
        damageRate: 0.8,
        returnRate: 2.1
      }
    },
    {
      id: 'fwd-003',
      name: 'Regional Delivery Services',
      code: 'RDS003',
      type: 'REGIONAL',
      contactPerson: 'Michael Wong',
      phone: '021-5553456',
      email: 'support@regionaldelivery.com',
      address: 'Jl. Hayam Wuruk No. 78, Jakarta',
      contractNumber: 'CTR-2023-003',
      contractStartDate: '2023-03-10',
      contractEndDate: '2024-03-09',
      isActive: true,
      serviceAreas: 8,
      rates: 32,
      performance: {
        onTimeDelivery: 95,
        damageRate: 0.3,
        returnRate: 0.9
      }
    },
    {
      id: 'fwd-004',
      name: 'Island Courier Network',
      code: 'ICN004',
      type: 'REGIONAL',
      contactPerson: 'Dewi Susanto',
      phone: '021-5554567',
      email: 'info@islandcourier.com',
      address: 'Jl. Diponegoro No. 56, Jakarta',
      contractNumber: 'CTR-2023-004',
      contractStartDate: '2023-04-05',
      contractEndDate: '2024-04-04',
      isActive: false,
      serviceAreas: 5,
      rates: 18,
      performance: {
        onTimeDelivery: 87,
        damageRate: 1.2,
        returnRate: 2.5
      }
    },
    {
      id: 'fwd-005',
      name: 'Premium Freight Solutions',
      code: 'PFS005',
      type: 'NATIONAL',
      contactPerson: 'Robert Chen',
      phone: '021-5555678',
      email: 'contact@premiumfreight.com',
      address: 'Jl. Thamrin No. 32, Jakarta',
      contractNumber: 'CTR-2023-005',
      contractStartDate: '2023-05-20',
      contractEndDate: '2025-05-19',
      isActive: true,
      serviceAreas: 20,
      rates: 65,
      performance: {
        onTimeDelivery: 91,
        damageRate: 0.6,
        returnRate: 1.5
      }
    }
  ];
};

const ForwardersPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State
  const [forwarders, setForwarders] = useState(generateMockForwarders());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedForwarder, setSelectedForwarder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Filter forwarders
  const filteredForwarders = forwarders.filter(forwarder => {
    const matchesSearch = searchTerm === '' || 
      forwarder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forwarder.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forwarder.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === '' || forwarder.type === filterType;
    const matchesStatus = filterStatus === '' || 
      (filterStatus === 'ACTIVE' && forwarder.isActive) ||
      (filterStatus === 'INACTIVE' && !forwarder.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Open delete modal
  const openDeleteModal = (forwarder) => {
    setSelectedForwarder(forwarder);
    setIsDeleteModalOpen(true);
  };
  
  // Handle delete forwarder
  const handleDeleteForwarder = () => {
    const updatedForwarders = forwarders.filter(f => f.id !== selectedForwarder.id);
    
    setForwarders(updatedForwarders);
    setIsDeleteModalOpen(false);
    notifications.success('Forwarder deleted successfully');
  };
  
  // Handle view forwarder
  const handleViewForwarder = (forwarder) => {
    router.push(`/master-data/forwarders/${forwarder.id}`);
  };
  
  // Handle edit forwarder
  const handleEditForwarder = (forwarder) => {
    router.push(`/master-data/forwarders/edit/${forwarder.id}`);
  };
  
  // Table columns
  const columns = [
    {
      header: 'Forwarder',
      accessorKey: 'name',
      cell: (info) => (
        <div>
          <div className="font-medium">{info.getValue()}</div>
          <div className="text-xs text-gray-500">{info.row.original.code}</div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: (info) => {
        const value = info.getValue();
        let bgColor = 'bg-gray-100 text-gray-800';
        
        if (value === 'NATIONAL') bgColor = 'bg-blue-100 text-blue-800';
        if (value === 'INTERNATIONAL') bgColor = 'bg-purple-100 text-purple-800';
        if (value === 'REGIONAL') bgColor = 'bg-green-100 text-green-800';
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
            {value}
          </span>
        );
      },
    },
    {
      header: 'Contact',
      cell: (info) => (
        <div>
          <div className="text-sm">{info.row.original.contactPerson}</div>
          <div className="text-xs text-gray-500">{info.row.original.phone}</div>
        </div>
      ),
    },
    {
      header: 'Contract',
      cell: (info) => (
        <div>
          <div className="text-sm">{info.row.original.contractNumber}</div>
          <div className="text-xs text-gray-500">
            {info.row.original.contractStartDate} to {info.row.original.contractEndDate}
          </div>
        </div>
      ),
    },
    {
      header: 'Coverage',
      cell: (info) => (
        <div>
          <div className="text-sm">{info.row.original.serviceAreas} Areas</div>
          <div className="text-xs text-gray-500">{info.row.original.rates} Rates</div>
        </div>
      ),
    },
    {
      header: 'Performance',
      cell: (info) => (
        <div>
          <div className="text-sm">{info.row.original.performance.onTimeDelivery}% On-time</div>
          <div className="text-xs text-gray-500">
            {info.row.original.performance.damageRate}% Damage
          </div>
        </div>
      ),
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
            onClick={() => handleViewForwarder(info.row.original)}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditForwarder(info.row.original)}
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
                Forwarders
              </Typography>
              
              <Button
                variant="primary"
                onClick={() => router.push('/master-data/forwarders/add')}
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Forwarder
              </Button>
            </div>
            
            {/* Filters */}
            <Card className="mb-6">
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                      Search
                    </label>
                    <input
                      type="text"
                      id="search"
                      placeholder="Search forwarders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      id="filterType"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="">All Types</option>
                      <option value="NATIONAL">National</option>
                      <option value="INTERNATIONAL">International</option>
                      <option value="REGIONAL">Regional</option>
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
                </div>
              </div>
            </Card>
            
            {/* Forwarders Table */}
            <Card>
              <div className="p-4">
                <DataTable
                  columns={columns}
                  data={filteredForwarders}
                  pagination={true}
                  emptyMessage="No forwarders found"
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
            Are you sure you want to delete the forwarder <span className="font-semibold">{selectedForwarder?.name}</span>?
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
              onClick={handleDeleteForwarder}
            >
              Delete Forwarder
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default ForwardersPage;
