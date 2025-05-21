"use client";

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CalendarIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { LineChart, BarChart, PieChart } from '../../organisms/Chart';
import Table from '../../organisms/Table';
import { DatePicker } from '../../molecules/DatePicker/index';
import Button from '../../atoms/Button';
import { 
  useGetRevenueByPeriodQuery,
  useGetRevenueByServiceQuery,
  useGetProfitMarginQuery,
  useGetAccountsReceivableQuery,
  useGetTopCustomersByRevenueQuery,
  useGetTransactionDetailsQuery
} from '../../../store/api/financeApi';

/**
 * FinancialReport Component
 * A detailed report of financial performance and analytics
 * Integrated with Redux store and RTK Query
 */
const FinancialReport = ({
  className = '',
}) => {
  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });
  
  // Filter state
  const [filters, setFilters] = useState({
    transactionType: '',
    paymentStatus: '',
    minAmount: '',
    maxAmount: '',
  });
  
  // Show filters state
  const [showFilters, setShowFilters] = useState(false);
  
  // Query parameters for API calls
  const queryParams = {
    startDate: dateRange.startDate.toISOString(),
    endDate: dateRange.endDate.toISOString(),
    ...filters
  };
  
  // RTK Query hooks
  const { data: revenueByPeriod, isLoading: isLoadingRevenue } = useGetRevenueByPeriodQuery(queryParams);
  const { data: revenueByService, isLoading: isLoadingServiceRevenue } = useGetRevenueByServiceQuery(queryParams);
  const { data: profitMargin, isLoading: isLoadingProfitMargin } = useGetProfitMarginQuery(queryParams);
  const { data: accountsReceivable, isLoading: isLoadingAR } = useGetAccountsReceivableQuery(queryParams);
  const { data: topCustomers, isLoading: isLoadingTopCustomers } = useGetTopCustomersByRevenueQuery(queryParams);
  const { data: transactionDetailsData, isLoading: isLoadingTransactions } = useGetTransactionDetailsQuery(queryParams);
  
  // Combined loading state
  const loading = isLoadingRevenue || isLoadingServiceRevenue || isLoadingProfitMargin || 
                isLoadingAR || isLoadingTopCustomers || isLoadingTransactions;
  
  // Combine data from different queries
  const data = {
    revenueByPeriod: revenueByPeriod?.data || {},
    revenueByService: revenueByService?.data || {},
    profitMargin: profitMargin?.data || {},
    accountsReceivable: accountsReceivable?.data || {},
    topCustomers: topCustomers?.data || [],
    transactionDetails: transactionDetailsData?.data || [],
  };
  
  // Handle date range change
  const handleDateRangeChange = (key, value) => {
    setDateRange(prev => ({ ...prev, [key]: value }));
  };
  
  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Handle export data
  const handleExportData = (format) => {
    // Implementation for exporting data in different formats
    console.log(`Exporting financial data in ${format} format`, { dateRange, filters });
    
    // This would typically call an API endpoint to generate and download the export
    // For example:
    // exportFinancialReport({ format, ...queryParams });
  };

  // Table columns for top customers
  const topCustomersColumns = [
    {
      accessor: 'rank',
      header: 'Rank',
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      accessor: 'customer',
      header: 'Customer',
      render: (_, item) => (
        <div>
          <div className="font-medium text-gray-900">{item.customerName}</div>
          <div className="text-sm text-gray-500">{item.customerCode}</div>
        </div>
      ),
    },
    {
      accessor: 'shipments',
      header: 'Shipments',
      render: (value) => value.toLocaleString(),
      align: 'right',
    },
    {
      accessor: 'revenue',
      header: 'Revenue',
      render: (value) => `Rp ${value.toLocaleString()}`,
      align: 'right',
    },
    {
      accessor: 'percentage',
      header: 'Percentage',
      render: (value) => `${value.toFixed(1)}%`,
      align: 'right',
    },
  ];

  // Table columns for transaction details
  const transactionDetailsColumns = [
    {
      accessor: 'reference',
      header: 'Reference',
      render: (value) => (
        <div className="font-medium text-blue-600">{value}</div>
      ),
    },
    {
      accessor: 'date',
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      accessor: 'type',
      header: 'Type',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      ),
    },
    {
      accessor: 'category',
      header: 'Category',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      ),
    },
    {
      accessor: 'customer',
      header: 'Customer',
      render: (_, transaction) => (
        transaction.customerName ? (
          <div>
            <div className="font-medium text-gray-900">{transaction.customerName}</div>
            <div className="text-sm text-gray-500">{transaction.customerCode}</div>
          </div>
        ) : '-'
      ),
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
      render: (value, transaction) => {
        const prefix = transaction.type === 'expense' ? '- ' : '';
        return `${prefix}Rp ${Math.abs(value).toLocaleString()}`;
      },
      align: 'right',
    },
  ];

  // Render date range selector
  const renderDateRangeSelector = () => {
    return (
      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-6">
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <DatePicker
            selected={dateRange.startDate}
            onChange={(date) => handleDateRangeChange('startDate', date)}
            maxDate={dateRange.endDate}
            placeholderText="Start date"
            className="w-36"
          />
          <span className="text-gray-500">to</span>
          <DatePicker
            selected={dateRange.endDate}
            onChange={(date) => handleDateRangeChange('endDate', date)}
            minDate={dateRange.startDate}
            maxDate={new Date()}
            placeholderText="End date"
            className="w-36"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
              setDateRange({ startDate: lastWeek, endDate: today });
              if (onDateRangeChange) {
                onDateRangeChange(lastWeek, today);
              }
            }}
          >
            Last 7 Days
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
              setDateRange({ startDate: lastMonth, endDate: today });
              if (onDateRangeChange) {
                onDateRangeChange(lastMonth, today);
              }
            }}
          >
            Last 30 Days
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const lastQuarter = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
              setDateRange({ startDate: lastQuarter, endDate: today });
              if (onDateRangeChange) {
                onDateRangeChange(lastQuarter, today);
              }
            }}
          >
            Last Quarter
          </Button>
        </div>
      </div>
    );
  };

  // Render filters
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="transaction-type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <select
              id="transaction-type-filter"
              value={filters.transactionType}
              onChange={(e) => handleFilterChange('transactionType', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="payment-status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              id="payment-status-filter"
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
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
            <label htmlFor="min-amount-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Min Amount (Rp)
            </label>
            <input
              id="min-amount-filter"
              type="number"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              placeholder="Minimum amount"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="max-amount-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Max Amount (Rp)
            </label>
            <input
              id="max-amount-filter"
              type="number"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              placeholder="Maximum amount"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div className="md:col-span-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                const resetFilters = {
                  transactionType: '',
                  paymentStatus: '',
                  minAmount: '',
                  maxAmount: '',
                };
                setFilters(resetFilters);
                if (onFilterChange) {
                  onFilterChange(resetFilters);
                }
              }}
              className="w-full md:w-auto"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Render revenue by period chart
  const renderRevenueByPeriodChart = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h2>
        <LineChart
          data={data.revenueByPeriod}
          height={300}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => `Rp ${value.toLocaleString()}`,
                },
              },
            },
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: (context) => `${context.dataset.label}: Rp ${context.parsed.y.toLocaleString()}`,
                },
              },
            },
          }}
        />
      </div>
    );
  };

  // Render profit margin chart
  const renderProfitMarginChart = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Profit Margin</h2>
        <LineChart
          data={data.profitMargin}
          height={300}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: (value) => `${value}%`,
                },
              },
            },
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`,
                },
              },
            },
          }}
        />
      </div>
    );
  };

  // Render revenue by service chart
  const renderRevenueByServiceChart = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue by Service Type</h2>
        <div className="h-80">
          <PieChart
            data={data.revenueByService}
            height={300}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: Rp ${context.parsed.toLocaleString()}`,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    );
  };

  // Render accounts receivable chart
  const renderAccountsReceivableChart = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Accounts Receivable Aging</h2>
        <BarChart
          data={data.accountsReceivable}
          height={300}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => `Rp ${value.toLocaleString()}`,
                },
              },
            },
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: (context) => `${context.dataset.label}: Rp ${context.parsed.y.toLocaleString()}`,
                },
              },
            },
          }}
        />
      </div>
    );
  };

  // Render top customers table
  const renderTopCustomersTable = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Top Customers by Revenue</h2>
        </div>
        <Table
          data={data.topCustomers}
          columns={topCustomersColumns}
          loading={loading}
          emptyMessage="No customer data available"
          pagination={false}
        />
      </div>
    );
  };

  // Render transaction details table
  const renderTransactionDetailsTable = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Transaction Details</h2>
          <Button
            variant="outline"
            onClick={() => handleExportData('csv')}
            className="flex items-center"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
        <Table
          data={data.transactionDetails}
          columns={transactionDetailsColumns}
          loading={loading}
          emptyMessage="No transaction data available"
          pagination={true}
          itemsPerPage={10}
        />
      </div>
    );
  };

  // Calculate financial summary
  const calculateFinancialSummary = () => {
    const transactions = data.transactionDetails || [];
    
    // Calculate total income
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate total expenses
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    // Calculate net profit
    const netProfit = totalIncome - totalExpenses;
    
    // Calculate profit margin
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    
    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
    };
  };

  // Render financial summary
  const renderFinancialSummary = () => {
    const summary = calculateFinancialSummary();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm font-medium text-gray-500">Total Income</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">
            Rp {summary.totalIncome.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm font-medium text-gray-500">Total Expenses</div>
          <div className="mt-1 text-2xl font-semibold text-red-600">
            Rp {summary.totalExpenses.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm font-medium text-gray-500">Net Profit</div>
          <div className={`mt-1 text-2xl font-semibold ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Rp {summary.netProfit.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-sm font-medium text-gray-500">Profit Margin</div>
          <div className={`mt-1 text-2xl font-semibold ${summary.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {summary.profitMargin.toFixed(1)}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Financial Report</h1>
        <p className="mt-1 text-sm text-gray-500">
          Detailed analysis of financial performance and metrics
        </p>
      </div>

      {renderDateRangeSelector()}
      
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center"
        >
          <FunnelIcon className="h-4 w-4 mr-1" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => handleExportData('csv')}
          className="flex items-center"
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
          Export Report
        </Button>
      </div>
      
      {renderFilters()}
      
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading report data...</p>
          </div>
        </div>
      ) : (
        <>
          {renderFinancialSummary()}
          {renderRevenueByPeriodChart()}
          {renderProfitMarginChart()}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {renderRevenueByServiceChart()}
            {renderAccountsReceivableChart()}
          </div>
          
          {renderTopCustomersTable()}
          {renderTransactionDetailsTable()}
        </>
      )}
    </div>
  );
};

FinancialReport.propTypes = {
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
};

export default FinancialReport;
