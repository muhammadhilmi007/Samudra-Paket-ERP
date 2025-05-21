"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Table from '../../organisms/Table';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import DatePicker from '../../molecules/DatePicker';
import InvoiceForm from './InvoiceForm';
import { 
  setInvoiceFilters, 
  resetInvoiceFilters,
  setInvoiceSort,
  selectInvoiceFilters,
  selectInvoiceSort
} from '../../../store/slices/financeSlice';
import { 
  useGetInvoicesQuery,
  useDeleteInvoiceMutation 
} from '../../../store/api/financeApi';

/**
 * InvoiceList Component
 * A page for displaying and managing invoices with Redux integration
 */
const InvoiceList = ({
  onExportData,
  className = '',
}) => {
  const dispatch = useDispatch();
  
  // Get filters and sort from Redux store
  const storeFilters = useSelector(selectInvoiceFilters);
  const storeSort = useSelector(selectInvoiceSort);
  
  // Local state for UI
  const [searchTerm, setSearchTerm] = useState(storeFilters.searchTerm || '');
  const [showFilters, setShowFilters] = useState(false);
  
  // RTK Query hooks
  const { data, isLoading, isFetching } = useGetInvoicesQuery({
    ...storeFilters,
    sortField: storeSort.field,
    sortDirection: storeSort.direction
  });
  
  const [deleteInvoice] = useDeleteInvoiceMutation();
  
  // Extract invoices from the API response
  const invoices = data?.data || [];
  const loading = isLoading || isFetching;
  
  // State for invoice form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

  // Table columns
  const columns = [
    {
      accessor: 'invoiceNumber',
      header: 'Invoice Number',
      render: (value) => (
        <div className="font-medium text-blue-600">{value}</div>
      ),
    },
    {
      accessor: 'customer',
      header: 'Customer',
      render: (_, invoice) => (
        <div>
          <div className="font-medium text-gray-900">{invoice.customerName}</div>
          <div className="text-sm text-gray-500">{invoice.customerCode}</div>
        </div>
      ),
    },
    {
      accessor: 'date',
      header: 'Issue Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      accessor: 'dueDate',
      header: 'Due Date',
      render: (value) => {
        const dueDate = new Date(value);
        const today = new Date();
        const isPastDue = dueDate < today && invoice.status !== 'paid';
        
        return (
          <span className={isPastDue ? 'text-red-600 font-medium' : ''}>
            {dueDate.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      accessor: 'status',
      header: 'Status',
      render: (value) => {
        let statusColor = 'gray';
        
        switch (value) {
          case 'paid':
            statusColor = 'green';
            break;
          case 'pending':
            statusColor = 'yellow';
            break;
          case 'overdue':
            statusColor = 'red';
            break;
          case 'cancelled':
            statusColor = 'gray';
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
      accessor: 'amount',
      header: 'Amount',
      render: (value) => `Rp ${value.toLocaleString()}`,
      align: 'right',
    },
    {
      accessor: 'actions',
      header: '',
      type: 'actions',
      render: (_, invoice) => (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditInvoice(invoice)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewInvoice(invoice)}
            className="text-gray-600 hover:text-gray-800"
          >
            View
          </Button>
        </>
      ),
    },
  ];

  // Calculate totals
  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices
    .filter(invoice => invoice.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = invoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  // Handle row click to edit invoice
  const handleRowClick = (invoice) => {
    setSelectedInvoice(invoice);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Handle create new invoice
  const handleCreateClick = () => {
    setSelectedInvoice(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  // Handle form submit (create or update)
  const handleFormSubmit = (invoiceData) => {
    // Form submission is now handled in InvoiceForm component with RTK Query
    setIsModalOpen(false);
  };

  // Handle invoice delete
  const handleInvoiceDelete = (invoice) => {
    if (invoice?.id) {
      deleteInvoice(invoice.id);
    }
    setIsModalOpen(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Apply search after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setInvoiceFilters({ searchTerm }));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setInvoiceFilters({ [name]: value }));
  };

  // Handle date range change
  const handleDateRangeChange = (startDate, endDate) => {
    dispatch(setInvoiceFilters({ startDate, endDate }));
  };

  // Reset filters
  const handleResetFilters = () => {
    dispatch(resetInvoiceFilters());
    setSearchTerm('');
  };
  
  // Handle sort change
  const handleSortChange = (field, direction) => {
    dispatch(setInvoiceSort({ field, direction }));
  };

  return (
    <div className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your invoices and track payments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Total Amount</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">Rp {totalAmount.toLocaleString()}</div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Paid</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">Rp {paidAmount.toLocaleString()}</div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Pending</div>
          <div className="mt-1 text-2xl font-semibold text-yellow-600">Rp {pendingAmount.toLocaleString()}</div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Overdue</div>
          <div className="mt-1 text-2xl font-semibold text-red-600">Rp {overdueAmount.toLocaleString()}</div>
        </div>
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
              placeholder="Search invoices..."
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
            onClick={onExportData}
            className="flex items-center"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          <Button
            variant="primary"
            onClick={handleCreateClick}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Create Invoice
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                id="date-filter"
                value={storeFilters.dateRange}
                onChange={handleFilterChange}
                name="dateRange"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Custom Range</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_year">This Year</option>
              </select>
            </div>
            
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <DatePicker
                    id="start-date"
                    selected={storeFilters.startDate}
                    onChange={(date) => handleDateRangeChange(date, storeFilters.endDate)}
                    maxDate={storeFilters.endDate || new Date()}
                    placeholderText="Select start date"
                    disabled={!!storeFilters.dateRange}
                  />
                </div>
                
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <DatePicker
                    id="end-date"
                    selected={storeFilters.endDate}
                    onChange={(date) => handleDateRangeChange(storeFilters.startDate, date)}
                    minDate={storeFilters.startDate}
                    maxDate={new Date()}
                    placeholderText="Select end date"
                    disabled={!!storeFilters.dateRange}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="min-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Min Amount (Rp)
              </label>
              <Input
                id="min-amount"
                type="number"
                value={storeFilters.minAmount}
                onChange={handleFilterChange}
                name="minAmount"
                placeholder="Minimum amount"
              />
            </div>
            
            <div>
              <label htmlFor="max-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Max Amount (Rp)
              </label>
              <Input
                id="max-amount"
                type="number"
                value={storeFilters.maxAmount}
                onChange={handleFilterChange}
                name="maxAmount"
                placeholder="Maximum amount"
              />
            </div>
            
            <div className="md:col-span-3 flex justify-end">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full md:w-auto"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table
          columns={columns}
          data={invoices}
          loading={loading}
          onRowClick={handleRowClick}
          onSort={handleSortChange}
          sortField={storeSort.field}
          sortDirection={storeSort.direction}
          emptyMessage="No invoices found"
        />
      </div>

      {isModalOpen && (
        <InvoiceForm
          invoice={selectedInvoice}
          mode={modalMode}
          onSubmit={handleFormSubmit}
          onDelete={handleInvoiceDelete}
          onClose={() => setIsModalOpen(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

InvoiceList.propTypes = {
  /**
   * Callback when export data is requested
   */
  onExportData: PropTypes.func,
  /**
   * Additional class names
   */
  className: PropTypes.string,
};

export default InvoiceList;
