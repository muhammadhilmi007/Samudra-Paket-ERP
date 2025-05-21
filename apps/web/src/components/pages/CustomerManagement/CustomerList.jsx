"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Table from '../../organisms/Table';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import CustomerForm from './CustomerForm';
import { 
  setCustomerFilters, 
  resetCustomerFilters,
  setCustomerSort,
  selectCustomerFilters,
  selectCustomerSort
} from '../../../store/slices/customerSlice';
import { 
  useGetCustomersQuery,
  useDeleteCustomerMutation 
} from '../../../store/api/customerApi';

/**
 * CustomerList Component
 * A page for displaying and managing customers with Redux integration
 */
const CustomerList = ({
  className = '',
}) => {
  const dispatch = useDispatch();
  
  // Get filters and sort from Redux store
  const storeFilters = useSelector(selectCustomerFilters);
  const storeSort = useSelector(selectCustomerSort);
  
  // Local state for UI
  const [searchTerm, setSearchTerm] = useState(storeFilters.searchTerm || '');
  const [showFilters, setShowFilters] = useState(false);
  
  // RTK Query hooks
  const { data, isLoading, isFetching } = useGetCustomersQuery({
    ...storeFilters,
    sortField: storeSort.field,
    sortDirection: storeSort.direction
  });
  
  const [deleteCustomer] = useDeleteCustomerMutation();
  
  // Extract customers from the API response
  const customers = data?.data || [];
  const loading = isLoading || isFetching;
  
  // State for customer form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

  // Table columns
  const columns = [
    {
      accessor: 'name',
      header: 'Customer Name',
      render: (_, customer) => (
        <div>
          <div className="font-medium text-gray-900">
            {customer.name}
          </div>
          <div className="text-sm text-gray-500">
            {customer.code}
          </div>
        </div>
      ),
    },
    {
      accessor: 'contact',
      header: 'Contact',
      render: (_, customer) => (
        <div>
          <div className="text-gray-900">{customer.contactPerson}</div>
          <div className="text-sm text-gray-500">{customer.email}</div>
          <div className="text-sm text-gray-500">{customer.phone}</div>
        </div>
      ),
    },
    {
      accessor: 'address',
      header: 'Address',
      render: (_, customer) => (
        <div className="text-sm text-gray-500">
          {customer.address}, {customer.city}
          {customer.state && `, ${customer.state}`}
          {customer.zipCode && ` ${customer.zipCode}`}
          <div>{customer.country}</div>
        </div>
      ),
    },
    {
      accessor: 'type',
      header: 'Type',
      render: (_, customer) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          customer.type === 'corporate' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {customer.type === 'corporate' ? 'Corporate' : 'Individual'}
        </span>
      ),
    },
    {
      accessor: 'status',
      header: 'Status',
      render: (_, customer) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          customer.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {customer.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      accessor: 'actions',
      header: '',
      type: 'actions',
      render: (_, customer) => (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditCustomer(customer)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewCustomer(customer)}
            className="text-gray-600 hover:text-gray-800"
          >
            View
          </Button>
        </>
      ),
    },
  ];

  // Handle opening the create customer modal
  const handleCreateCustomer = () => {
    setModalMode('create');
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  // Handle opening the edit customer modal
  const handleEditCustomer = (customer) => {
    setModalMode('edit');
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  // Handle opening the view customer modal
  const handleViewCustomer = (customer) => {
    setModalMode('view');
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  // Handle row click to edit customer
  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Handle create new customer
  const handleCreateClick = () => {
    setSelectedCustomer(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  // Handle form submit (create or update)
  const handleFormSubmit = (customerData) => {
    // Form submission is now handled in CustomerForm component with RTK Query
    setIsModalOpen(false);
  };

  // Handle customer deletion
  const handleCustomerDelete = (customer) => {
    if (customer?.id) {
      deleteCustomer(customer.id);
    }
    setIsModalOpen(false);
  };

  // Handle sort change
  const handleSortChange = (field, direction) => {
    dispatch(setCustomerSort({ field, direction }));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Apply search after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setCustomerFilters({ searchTerm }));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setCustomerFilters({ [name]: value }));
  };

  // Reset filters
  const handleResetFilters = () => {
    dispatch(resetCustomerFilters());
    setSearchTerm('');
  };

  return (
    <div className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your customer database
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
              onChange={handleSearchChange}
              placeholder="Search customers..."
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
        
        <Button
          variant="primary"
          onClick={handleCreateClick}
          className="flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Customer
        </Button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Type
            </label>
            <select
              id="type-filter"
              value={storeFilters.type}
              onChange={handleFilterChange}
              name="type"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="corporate">Corporate</option>
              <option value="individual">Individual</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={storeFilters.status}
              onChange={handleFilterChange}
              name="status"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Customer Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table
          columns={columns}
          data={customers}
          loading={loading}
          onRowClick={handleRowClick}
          onSort={handleSortChange}
          sortField={storeSort.field}
          sortDirection={storeSort.direction}
          emptyMessage="No customers found"
        />
      </div>

      {/* Customer Form Modal */}
      {isModalOpen && (
        <CustomerForm
          customer={selectedCustomer}
          mode={modalMode}
          onSubmit={handleFormSubmit}
          onDelete={handleCustomerDelete}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

CustomerList.propTypes = {
  /**
   * Additional class names
   */
  className: PropTypes.string,
};

export default CustomerList;
