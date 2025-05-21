"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Table from '../../organisms/Table';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import DatePicker from '../../molecules/DatePicker';
import PaymentForm from './PaymentForm';
import { 
  setPaymentFilters, 
  resetPaymentFilters,
  setPaymentSort,
  selectPaymentFilters,
  selectPaymentSort
} from '../../../store/slices/financeSlice';
import { 
  useGetPaymentsQuery,
  useDeletePaymentMutation 
} from '../../../store/api/financeApi';

/**
 * PaymentList Component
 * A page for displaying and managing payments with Redux integration
 */
const PaymentList = ({
  onExportData,
  className = '',
}) => {
  const dispatch = useDispatch();
  
  // Get filters and sort from Redux store
  const storeFilters = useSelector(selectPaymentFilters);
  const storeSort = useSelector(selectPaymentSort);
  
  // Local state for UI
  const [searchTerm, setSearchTerm] = useState(storeFilters.searchTerm || '');
  const [showFilters, setShowFilters] = useState(false);
  
  // RTK Query hooks
  const { data, isLoading, isFetching } = useGetPaymentsQuery({
    ...storeFilters,
    sortField: storeSort.field,
    sortDirection: storeSort.direction
  });
  
  const [deletePayment] = useDeletePaymentMutation();
  
  // Extract payments from the API response
  const payments = data?.data || [];
  const loading = isLoading || isFetching;
  
  // State for payment form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

  // Table columns
  const columns = [
    {
      accessor: 'reference',
      header: 'Reference',
      render: (value) => (
        <div className="font-medium text-blue-600">{value}</div>
      ),
    },
    {
      accessor: 'invoiceNumber',
      header: 'Invoice',
      render: (value) => value || '-',
    },
    {
      accessor: 'customer',
      header: 'Customer',
      render: (_, payment) => (
        <div>
          <div className="font-medium text-gray-900">{payment.customerName}</div>
          <div className="text-sm text-gray-500">{payment.customerCode}</div>
        </div>
      ),
    },
    {
      accessor: 'date',
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      accessor: 'method',
      header: 'Method',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      ),
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
      render: (_, payment) => (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditPayment(payment)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewPayment(payment)}
            className="text-gray-600 hover:text-gray-800"
          >
            View
          </Button>
        </>
      ),
    },
  ];

  // Handle row click to edit payment
  const handleRowClick = (payment) => {
    setSelectedPayment(payment);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Handle create new payment
  const handleCreateClick = () => {
    setSelectedPayment(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  // Handle form submit (create or update)
  const handleFormSubmit = (paymentData) => {
    // Form submission is now handled in PaymentForm component with RTK Query
    setIsModalOpen(false);
  };

  // Handle payment delete
  const handlePaymentDelete = (payment) => {
    if (payment?.id) {
      deletePayment(payment.id);
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
      dispatch(setPaymentFilters({ searchTerm }));
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setPaymentFilters({ [name]: value }));
  };

  // Handle date range change
  const handleDateRangeChange = (startDate, endDate) => {
    dispatch(setPaymentFilters({ startDate, endDate }));
  };

  // Reset filters
  const handleResetFilters = () => {
    dispatch(resetPaymentFilters());
    setSearchTerm('');
  };
  
  // Handle sort change
  const handleSortChange = (field, direction) => {
    dispatch(setPaymentSort({ field, direction }));
  };

  return (
    <div className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your payment transactions
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
              placeholder="Search payments..."
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
            Record Payment
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="method-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                id="method-filter"
                value={storeFilters.method}
                onChange={handleFilterChange}
                name="method"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Methods</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="e_wallet">E-Wallet</option>
                <option value="check">Check</option>
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

      {/* Payment Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table
          columns={columns}
          data={payments}
          loading={loading}
          onRowClick={handleRowClick}
          onSort={handleSortChange}
          sortField={storeSort.field}
          sortDirection={storeSort.direction}
          emptyMessage="No payments found"
        />
      </div>

      {isModalOpen && (
        <PaymentForm
          payment={selectedPayment}
          mode={modalMode}
          onSubmit={handleFormSubmit}
          onDelete={handlePaymentDelete}
          onClose={() => setIsModalOpen(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

PaymentList.propTypes = {
  /**
   * Callback when export data is requested
   */
  onExportData: PropTypes.func,
  /**
   * Additional class names
   */
  className: PropTypes.string,
};

export default PaymentList;
