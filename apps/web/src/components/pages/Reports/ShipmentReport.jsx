"use client";

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CalendarIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { LineChart, BarChart } from '../../organisms/Chart';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../ui/table';
import { DatePicker } from '../../molecules/DatePicker/index';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';
import { 
  useGetShipmentVolumeQuery,
  useGetDeliveryPerformanceQuery,
  useGetShipmentsByRegionQuery,
  useGetTopRoutesQuery,
  useGetShipmentDetailsQuery
} from '../../../store/api/shipmentApi';

/**
 * ShipmentReport Component
 * A detailed report of shipment performance and analytics
 * Integrated with Redux store and RTK Query
 */
const ShipmentReport = ({
  className = '',
}) => {
  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });
  
  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    service: '',
    origin: '',
    destination: '',
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
  const { data: shipmentVolume, isLoading: isLoadingVolume } = useGetShipmentVolumeQuery(queryParams);
  const { data: deliveryPerformance, isLoading: isLoadingPerformance } = useGetDeliveryPerformanceQuery(queryParams);
  const { data: shipmentsByRegion, isLoading: isLoadingRegions } = useGetShipmentsByRegionQuery(queryParams);
  const { data: topRoutes, isLoading: isLoadingRoutes } = useGetTopRoutesQuery(queryParams);
  const { data: shipmentDetailsData, isLoading: isLoadingDetails } = useGetShipmentDetailsQuery(queryParams);
  
  // Combined loading state
  const loading = isLoadingVolume || isLoadingPerformance || isLoadingRegions || 
                isLoadingRoutes || isLoadingDetails;
  
  // Combine data from different queries
  const data = {
    shipmentVolume: shipmentVolume?.data || {},
    deliveryPerformance: deliveryPerformance?.data || {},
    shipmentsByRegion: shipmentsByRegion?.data || {},
    topRoutes: topRoutes?.data || [],
    shipmentDetails: shipmentDetailsData?.data || [],
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
    console.log(`Exporting data in ${format} format`, { dateRange, filters });
    
    // This would typically call an API endpoint to generate and download the export
    // For example:
    // exportShipmentReport({ format, ...queryParams });
  };

  // Table columns for top routes
  const topRoutesColumns = [
    {
      accessor: 'rank',
      header: 'Rank',
      render: (value) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      accessor: 'route',
      header: 'Route',
      render: (_, item) => (
        <div>
          <div className="font-medium text-gray-900">{item.origin}</div>
          <div className="text-sm text-gray-500">→ {item.destination}</div>
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
      accessor: 'avgDeliveryTime',
      header: 'Avg. Delivery Time',
      render: (value) => `${value.toFixed(1)} days`,
      align: 'right',
    },
  ];

  // Table columns for shipment details
  const shipmentDetailsColumns = [
    {
      accessor: 'trackingNumber',
      header: 'Tracking Number',
      render: (value) => (
        <div className="font-medium text-blue-600">{value}</div>
      ),
    },
    {
      accessor: 'customerName',
      header: 'Customer',
    },
    {
      accessor: 'origin',
      header: 'Origin',
    },
    {
      accessor: 'destination',
      header: 'Destination',
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
      header: 'Created Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      accessor: 'deliveredAt',
      header: 'Delivered Date',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      accessor: 'deliveryTime',
      header: 'Delivery Time',
      render: (value) => value ? `${value.toFixed(1)} days` : '-',
      align: 'right',
    },
    {
      accessor: 'amount',
      header: 'Amount',
      render: (value) => `Rp ${value.toLocaleString()}`,
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
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
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
              onChange={(e) => handleFilterChange('service', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Services</option>
              <option value="regular">Regular</option>
              <option value="express">Express</option>
              <option value="same_day">Same Day</option>
              <option value="economy">Economy</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="origin-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Origin
            </label>
            <Input
              id="origin-filter"
              type="text"
              value={filters.origin}
              onChange={(e) => handleFilterChange('origin', e.target.value)}
              placeholder="Filter by origin"
            />
          </div>
          
          <div>
            <label htmlFor="destination-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <Input
              id="destination-filter"
              type="text"
              value={filters.destination}
              onChange={(e) => handleFilterChange('destination', e.target.value)}
              placeholder="Filter by destination"
            />
          </div>
          
          <div className="md:col-span-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                const resetFilters = {
                  status: '',
                  service: '',
                  origin: '',
                  destination: '',
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

  // Render shipment volume chart
  const renderShipmentVolumeChart = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Shipment Volume</h2>
        <LineChart
          data={data.shipmentVolume}
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
              },
            },
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                mode: 'index',
                intersect: false,
              },
            },
          }}
        />
      </div>
    );
  };

  // Render delivery performance chart
  const renderDeliveryPerformanceChart = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Performance</h2>
        <LineChart
          data={data.deliveryPerformance}
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
                  label: (context) => `${context.dataset.label}: ${context.parsed.y}%`,
                },
              },
            },
          }}
        />
      </div>
    );
  };

  // Render shipments by region chart
  const renderShipmentsByRegionChart = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Shipments by Region</h2>
        <BarChart
          data={data.shipmentsByRegion}
          height={300}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
              x: {
                beginAtZero: true,
              },
              y: {
                grid: {
                  display: false,
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
              },
            },
          }}
        />
      </div>
    );
  };

  // Render top routes table
  const renderTopRoutesTable = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Top Routes</h2>
        </div>
        <Table
          data={data.topRoutes}
          columns={topRoutesColumns}
          loading={loading}
          emptyMessage="No route data available"
          pagination={false}
        />
      </div>
    );
  };

  // Render shipment details table
  const renderShipmentDetailsTable = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Shipment Details</h2>
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
          data={data.shipmentDetails}
          columns={shipmentDetailsColumns}
          loading={loading}
          emptyMessage="No shipment data available"
          pagination={true}
          itemsPerPage={10}
        />
      </div>
    );
  };

  return (
    <div className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shipment Report</h1>
        <p className="mt-1 text-sm text-gray-500">
          Detailed analysis of shipment performance and metrics
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
          onClick={() => handleExportData('pdf')}
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
          {renderShipmentVolumeChart()}
          {renderDeliveryPerformanceChart()}
          {renderShipmentsByRegionChart()}
          {renderTopRoutesTable()}
          {renderShipmentDetailsTable()}
        </>
      )}
    </div>
  );
};

ShipmentReport.propTypes = {
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
};

export default ShipmentReport;
