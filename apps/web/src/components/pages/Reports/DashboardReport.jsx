"use client";

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { ArrowUpIcon, ArrowDownIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { LineChart, BarChart, PieChart, DoughnutChart } from '../../organisms/Chart';
import DatePicker from '../../molecules/DatePicker';
import Button from '../../atoms/Button';
import { 
  useGetFinancialSummaryQuery,
  useGetRevenueByPeriodQuery,
  useGetTopCustomersByRevenueQuery 
} from '../../../store/api/financeApi';
import { 
  useGetShipmentStatsQuery,
  useGetShipmentTrendsQuery 
} from '../../../store/api/shipmentApi';

/**
 * DashboardReport Component
 * A dashboard showing key performance indicators and analytics
 * Integrated with Redux store and RTK Query
 */
const DashboardReport = ({
  className = '',
}) => {
  const dispatch = useDispatch();
  
  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });
  
  // Query parameters for API calls
  const queryParams = {
    startDate: dateRange.startDate.toISOString(),
    endDate: dateRange.endDate.toISOString()
  };
  
  // RTK Query hooks
  const { data: financialSummary, isLoading: isLoadingFinancialSummary } = useGetFinancialSummaryQuery(queryParams);
  const { data: revenueByPeriod, isLoading: isLoadingRevenue } = useGetRevenueByPeriodQuery(queryParams);
  const { data: topCustomers, isLoading: isLoadingTopCustomers } = useGetTopCustomersByRevenueQuery(queryParams);
  const { data: shipmentStats, isLoading: isLoadingShipmentStats } = useGetShipmentStatsQuery(queryParams);
  const { data: shipmentTrends, isLoading: isLoadingShipmentTrends } = useGetShipmentTrendsQuery(queryParams);
  
  // Combined loading state
  const loading = isLoadingFinancialSummary || isLoadingRevenue || isLoadingTopCustomers || 
                isLoadingShipmentStats || isLoadingShipmentTrends;
  
  // Combine data from different queries
  const data = {
    kpis: {
      totalRevenue: financialSummary?.totalRevenue || 0,
      totalShipments: shipmentStats?.totalShipments || 0,
      activeShipments: shipmentStats?.activeShipments || 0,
      deliveredShipments: shipmentStats?.deliveredShipments || 0,
      revenueChange: financialSummary?.revenueChange || 0,
      shipmentChange: shipmentStats?.shipmentChange || 0,
    },
    shipmentTrends: shipmentTrends?.data || {},
    revenueData: revenueByPeriod?.data || {},
    shipmentsByStatus: shipmentStats?.byStatus || {},
    shipmentsByService: shipmentStats?.byService || {},
    topCustomers: topCustomers?.data || []
  };
  
  // Handle date range change
  const handleDateRangeChange = (key, value) => {
    setDateRange(prev => ({ ...prev, [key]: value }));
  };

  // Format percentage change
  const formatPercentageChange = (value) => {
    const isPositive = value >= 0;
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <ArrowUpIcon className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 mr-1" />
        )}
        {Math.abs(value).toFixed(1)}%
      </div>
    );
  };

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

  // Render KPI cards
  const renderKpiCards = () => {
    const { totalShipments, totalRevenue, averageDeliveryTime, onTimeDeliveryRate } = data.kpis;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">Total Shipments</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">{totalShipments?.value.toLocaleString() || 0}</div>
            </div>
            {totalShipments?.percentageChange !== undefined && (
              <div className="text-sm">
                {formatPercentageChange(totalShipments.percentageChange)}
                <div className="text-gray-500 text-xs">vs previous period</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">Total Revenue</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                Rp {totalRevenue?.value.toLocaleString() || 0}
              </div>
            </div>
            {totalRevenue?.percentageChange !== undefined && (
              <div className="text-sm">
                {formatPercentageChange(totalRevenue.percentageChange)}
                <div className="text-gray-500 text-xs">vs previous period</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">Avg. Delivery Time</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                {averageDeliveryTime?.value.toFixed(1) || 0} days
              </div>
            </div>
            {averageDeliveryTime?.percentageChange !== undefined && (
              <div className="text-sm">
                {formatPercentageChange(-averageDeliveryTime.percentageChange)} {/* Negative because lower is better */}
                <div className="text-gray-500 text-xs">vs previous period</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">On-Time Delivery</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">
                {onTimeDeliveryRate?.value.toFixed(1) || 0}%
              </div>
            </div>
            {onTimeDeliveryRate?.percentageChange !== undefined && (
              <div className="text-sm">
                {formatPercentageChange(onTimeDeliveryRate.percentageChange)}
                <div className="text-gray-500 text-xs">vs previous period</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render shipment trends chart
  const renderShipmentTrendsChart = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Shipment Trends</h2>
        <LineChart
          data={data.shipmentTrends}
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

  // Render revenue chart
  const renderRevenueChart = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Analysis</h2>
        <BarChart
          data={data.revenueData}
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

  // Render shipment distribution charts
  const renderShipmentDistributionCharts = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Shipments by Status</h2>
          <div className="h-64">
            <DoughnutChart
              data={data.shipmentsByStatus}
              height={250}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Shipments by Service Type</h2>
          <div className="h-64">
            <PieChart
              data={data.shipmentsByService}
              height={250}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Key performance indicators and business analytics
        </p>
      </div>

      {renderDateRangeSelector()}
      
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <>
          {renderKpiCards()}
          {renderShipmentTrendsChart()}
          {renderRevenueChart()}
          {renderShipmentDistributionCharts()}
        </>
      )}
    </div>
  );
};

DashboardReport.propTypes = {
  /**
   * Additional class names
   */
  className: PropTypes.string,
};

export default DashboardReport;
