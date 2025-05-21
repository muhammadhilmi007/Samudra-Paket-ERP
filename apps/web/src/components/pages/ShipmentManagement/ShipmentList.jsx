"use client";

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Table from '../../organisms/Table';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import ShipmentForm from './ShipmentForm';

/**
 * ShipmentList Component
 * A page for displaying and managing shipments
 */
const ShipmentList = ({
  shipments = [],
  onShipmentCreate,
  onShipmentUpdate,
  onShipmentDelete,
  onExportData,
  loading = false,
  className = '',
}) => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    service: '',
    dateRange: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // State for shipment form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

  // Table columns
  const columns = [
    {
      accessor: 'trackingNumber',
      header: 'Tracking Number',
      render: (value) => (
        <div className="font-medium text-blue-600">{value}</div>
      ),
    },
    {
      accessor: 'customer',
      header: 'Customer',
      render: (_, shipment) => (
        <div>
          <div className="font-medium text-gray-900">{shipment.customerName}</div>
          <div className="text-sm text-gray-500">{shipment.customerCode}</div>
        </div>
      ),
    },
    {
      accessor: 'route',
      header: 'Route',
      render: (_, shipment) => (
        <div className="text-sm">
          <div>{shipment.origin}</div>
          <div className="text-gray-500">→</div>
          <div>{shipment.destination}</div>
        </div>
      ),
    },
    {
      accessor: 'service',
      header: 'Service',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      accessor: 'status',
      header: 'Status',
      render: (value) => {
        let statusColor = 'gray';
        
        switch (value) {
          case 'delivered':
            statusColor = 'green';
            break;
          case 'in_transit':
            statusColor = 'blue';
            break;
          case 'pending':
            statusColor = 'yellow';
            break;
          case 'cancelled':
            statusColor = 'red';
            break;
        }
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
            {value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        );
      },
    },
    {
      accessor: 'createdAt',
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      accessor: 'amount',
      header: 'Amount',
      render: (value) => `Rp ${value.toLocaleString()}`,
      align: 'right',
    },
    {
      accessor: 'actions',
      header: '',
      type: 'actions',
      render: (_, shipment) => (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditShipment(shipment)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewShipment(shipment)}
            className="text-gray-600 hover:text-gray-800"
          >
            View
          </Button>
        </>
      ),
    },
  ];

  // Filter shipments based on search term and filters
  const filteredShipments = shipments.filter((shipment) => {
    // Search term filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm ||
      shipment.trackingNumber.toLowerCase().includes(searchLower) ||
      shipment.customerName.toLowerCase().includes(searchLower) ||
      shipment.customerCode.toLowerCase().includes(searchLower) ||
      shipment.origin.toLowerCase().includes(searchLower) ||
      shipment.destination.toLowerCase().includes(searchLower);
    
    // Status filter
    const matchesStatus = !filters.status || shipment.status === filters.status;
    
    // Service filter
    const matchesService = !filters.service || shipment.service === filters.service;
    
    // Date range filter
    let matchesDateRange = true;
    if (filters.dateRange) {
      const shipmentDate = new Date(shipment.createdAt);
      const today = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          matchesDateRange = shipmentDate.toDateString() === today.toDateString();
          break;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          matchesDateRange = shipmentDate.toDateString() === yesterday.toDateString();
          break;
        case 'this_week':
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          matchesDateRange = shipmentDate >= startOfWeek;
          break;
        case 'this_month':
          matchesDateRange = 
            shipmentDate.getMonth() === today.getMonth() && 
            shipmentDate.getFullYear() === today.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesService && matchesDateRange;
  });

  // Handle opening the create shipment modal
  const handleCreateShipment = () => {
    setModalMode('create');
    setSelectedShipment(null);
    setIsModalOpen(true);
  };

  // Handle opening the edit shipment modal
  const handleEditShipment = (shipment) => {
    setModalMode('edit');
    setSelectedShipment(shipment);
    setIsModalOpen(true);
  };

  // Handle opening the view shipment modal
  const handleViewShipment = (shipment) => {
    setModalMode('view');
    setSelectedShipment(shipment);
    setIsModalOpen(true);
  };

  // Handle shipment form submission
  const handleShipmentSubmit = async (data) => {
    try {
      if (modalMode === 'create') {
        if (onShipmentCreate) {
          await onShipmentCreate({
            ...data,
            id: Math.random().toString(36).substr(2, 9), // In a real app, this would be generated by the server
            trackingNumber: generateTrackingNumber(),
            createdAt: new Date().toISOString(),
          });
        }
      } else if (modalMode === 'edit') {
        if (onShipmentUpdate) {
          await onShipmentUpdate({
            ...selectedShipment,
            ...data,
            updatedAt: new Date().toISOString(),
          });
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving shipment:', error);
    }
  };

  // Handle shipment deletion
  const handleShipmentDelete = async (shipmentId) => {
    try {
      if (onShipmentDelete) {
        await onShipmentDelete(shipmentId);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting shipment:', error);
    }
  };

  // Handle export data
  const handleExportData = () => {
    if (onExportData) {
      onExportData(filteredShipments);
    }
  };

  // Generate a random tracking number
  const generateTrackingNumber = () => {
    const prefix = 'SP';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  // Get unique services for filter options
  const serviceOptions = [...new Set(shipments.map(shipment => shipment.service))];

  // Render filters
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-md mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="service-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Service
          </label>
          <select
            id="service-filter"
            value={filters.service}
            onChange={(e) => setFilters({ ...filters, service: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Services</option>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <select
            id="date-filter"
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
          </select>
        </div>
        
        <div className="md:col-span-3 flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setFilters({ status: '', service: '', dateRange: '' });
            }}
            className="w-full md:w-auto"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your shipments and track their status
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shipments..."
              className="pl-10"
            />
          </div>
          
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center"
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            Filters
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleExportData}
            className="flex items-center"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          <Button
            variant="primary"
            onClick={handleCreateShipment}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Create Shipment
          </Button>
        </div>
      </div>

      {renderFilters()}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table
          data={filteredShipments}
          columns={columns}
          loading={loading}
          emptyMessage="No shipments found"
          pagination={true}
          itemsPerPage={10}
        />
      </div>

      {isModalOpen && (
        <ShipmentForm
          shipment={selectedShipment}
          mode={modalMode}
          onSubmit={handleShipmentSubmit}
          onDelete={handleShipmentDelete}
          onClose={() => setIsModalOpen(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

ShipmentList.propTypes = {
  /**
   * Array of shipment objects
   */
  shipments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      trackingNumber: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired,
      customerCode: PropTypes.string.isRequired,
      origin: PropTypes.string.isRequired,
      destination: PropTypes.string.isRequired,
      service: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string,
    })
  ),
  /**
   * Callback when a shipment is created
   */
  onShipmentCreate: PropTypes.func,
  /**
   * Callback when a shipment is updated
   */
  onShipmentUpdate: PropTypes.func,
  /**
   * Callback when a shipment is deleted
   */
  onShipmentDelete: PropTypes.func,
  /**
   * Callback when data is exported
   */
  onExportData: PropTypes.func,
  /**
   * Whether the component is in a loading state
   */
  loading: PropTypes.bool,
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
};

export default ShipmentList;
