"use client";

/**
 * BranchPerformanceTab Component
 * Displays performance metrics and analytics for a branch
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';

// Mock data for performance metrics
const generateMockData = (branchId) => {
  // Generate consistent mock data based on branchId
  const seed = branchId.charCodeAt(0) + branchId.charCodeAt(branchId.length - 1);
  
  const getRandomValue = (min, max) => {
    return Math.floor((seed % 100) / 100 * (max - min) + min);
  };
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Generate last 6 months
  const last6Months = Array(6).fill().map((_, i) => {
    const monthIndex = (currentMonth - 5 + i + 12) % 12;
    return months[monthIndex];
  });
  
  // Generate shipment data
  const shipmentData = last6Months.map((month, i) => ({
    month,
    inbound: getRandomValue(800, 1200) + (i * 50),
    outbound: getRandomValue(700, 1100) + (i * 60),
  }));
  
  // Generate delivery performance data
  const deliveryData = last6Months.map((month) => ({
    month,
    onTime: getRandomValue(85, 98),
    delayed: getRandomValue(2, 15),
  }));
  
  // Generate revenue data
  const revenueData = last6Months.map((month, i) => ({
    month,
    amount: getRandomValue(50000000, 80000000) + (i * 1000000),
  }));
  
  // Generate key metrics
  const keyMetrics = {
    totalShipments: getRandomValue(5000, 8000),
    deliverySuccessRate: getRandomValue(92, 99),
    averageDeliveryTime: getRandomValue(18, 36),
    customerSatisfaction: getRandomValue(80, 95),
    operationalEfficiency: getRandomValue(75, 95),
    employeePerformance: getRandomValue(80, 95),
  };
  
  return {
    shipmentData,
    deliveryData,
    revenueData,
    keyMetrics,
  };
};

const BranchPerformanceTab = ({ branchId }) => {
  const [timeRange, setTimeRange] = useState('6months');
  const performanceData = generateMockData(branchId);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${value}%`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h2" className="text-xl font-semibold">
          Performance Dashboard
        </Typography>
        
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          
          <Button variant="outline" size="sm">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white overflow-hidden">
          <div className="p-4">
            <Typography variant="body2" className="text-gray-500 uppercase tracking-wider text-xs font-semibold">
              Total Shipments
            </Typography>
            <div className="mt-1 flex items-baseline">
              <Typography variant="h3" className="text-2xl font-semibold text-gray-900">
                {performanceData.keyMetrics.totalShipments.toLocaleString()}
              </Typography>
              <Typography variant="body2" className="ml-2 text-sm text-green-600">
                +4.75%
              </Typography>
            </div>
          </div>
          <div className="w-full bg-gradient-to-r from-blue-500 to-primary-500 h-1"></div>
        </Card>
        
        <Card className="bg-white overflow-hidden">
          <div className="p-4">
            <Typography variant="body2" className="text-gray-500 uppercase tracking-wider text-xs font-semibold">
              Delivery Success Rate
            </Typography>
            <div className="mt-1 flex items-baseline">
              <Typography variant="h3" className="text-2xl font-semibold text-gray-900">
                {formatPercentage(performanceData.keyMetrics.deliverySuccessRate)}
              </Typography>
              <Typography variant="body2" className="ml-2 text-sm text-green-600">
                +1.2%
              </Typography>
            </div>
          </div>
          <div className="w-full bg-gradient-to-r from-green-500 to-green-400 h-1"></div>
        </Card>
        
        <Card className="bg-white overflow-hidden">
          <div className="p-4">
            <Typography variant="body2" className="text-gray-500 uppercase tracking-wider text-xs font-semibold">
              Average Delivery Time
            </Typography>
            <div className="mt-1 flex items-baseline">
              <Typography variant="h3" className="text-2xl font-semibold text-gray-900">
                {performanceData.keyMetrics.averageDeliveryTime} hours
              </Typography>
              <Typography variant="body2" className="ml-2 text-sm text-green-600">
                -2.5%
              </Typography>
            </div>
          </div>
          <div className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 h-1"></div>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipment Volume Chart */}
        <Card>
          <div className="p-4 border-b border-gray-200">
            <Typography variant="h3" className="text-lg font-medium">
              Shipment Volume
            </Typography>
          </div>
          <div className="p-4">
            <div className="h-64 flex items-end space-x-2">
              {performanceData.shipmentData.map((data) => (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center space-y-1">
                    <div 
                      className="w-full bg-primary-500 rounded-t"
                      style={{ height: `${(data.inbound / 1500) * 100}%` }}
                    ></div>
                    <div 
                      className="w-full bg-secondary-500 rounded-t"
                      style={{ height: `${(data.outbound / 1500) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs font-medium text-gray-500">{data.month}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-500 rounded-sm mr-2"></div>
                <span className="text-sm text-gray-600">Inbound</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-secondary-500 rounded-sm mr-2"></div>
                <span className="text-sm text-gray-600">Outbound</span>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Delivery Performance Chart */}
        <Card>
          <div className="p-4 border-b border-gray-200">
            <Typography variant="h3" className="text-lg font-medium">
              Delivery Performance
            </Typography>
          </div>
          <div className="p-4">
            <div className="h-64 flex items-end space-x-2">
              {performanceData.deliveryData.map((data) => (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center space-y-1">
                    <div 
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${data.onTime}%` }}
                    ></div>
                    <div 
                      className="w-full bg-red-500 rounded-t"
                      style={{ height: `${data.delayed}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs font-medium text-gray-500">{data.month}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>
                <span className="text-sm text-gray-600">On Time</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-sm mr-2"></div>
                <span className="text-sm text-gray-600">Delayed</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Revenue Chart */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <Typography variant="h3" className="text-lg font-medium">
            Revenue Trend
          </Typography>
        </div>
        <div className="p-4">
          <div className="h-64 flex items-end space-x-2">
            {performanceData.revenueData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-primary-500 to-blue-400 rounded-t"
                  style={{ height: `${(data.amount / 100000000) * 100}%` }}
                ></div>
                <div className="mt-2 text-xs font-medium text-gray-500">{data.month}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Typography variant="body2" className="text-center text-gray-500">
              Total Revenue: {formatCurrency(performanceData.revenueData.reduce((sum, data) => sum + data.amount, 0))}
            </Typography>
          </div>
        </div>
      </Card>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white overflow-hidden">
          <div className="p-4">
            <Typography variant="body2" className="text-gray-500 uppercase tracking-wider text-xs font-semibold">
              Customer Satisfaction
            </Typography>
            <div className="mt-1 flex items-baseline">
              <Typography variant="h3" className="text-2xl font-semibold text-gray-900">
                {formatPercentage(performanceData.keyMetrics.customerSatisfaction)}
              </Typography>
              <Typography variant="body2" className="ml-2 text-sm text-green-600">
                +2.3%
              </Typography>
            </div>
          </div>
          <div className="w-full bg-gradient-to-r from-blue-500 to-primary-500 h-1"></div>
        </Card>
        
        <Card className="bg-white overflow-hidden">
          <div className="p-4">
            <Typography variant="body2" className="text-gray-500 uppercase tracking-wider text-xs font-semibold">
              Operational Efficiency
            </Typography>
            <div className="mt-1 flex items-baseline">
              <Typography variant="h3" className="text-2xl font-semibold text-gray-900">
                {formatPercentage(performanceData.keyMetrics.operationalEfficiency)}
              </Typography>
              <Typography variant="body2" className="ml-2 text-sm text-green-600">
                +3.5%
              </Typography>
            </div>
          </div>
          <div className="w-full bg-gradient-to-r from-green-500 to-green-400 h-1"></div>
        </Card>
        
        <Card className="bg-white overflow-hidden">
          <div className="p-4">
            <Typography variant="body2" className="text-gray-500 uppercase tracking-wider text-xs font-semibold">
              Employee Performance
            </Typography>
            <div className="mt-1 flex items-baseline">
              <Typography variant="h3" className="text-2xl font-semibold text-gray-900">
                {formatPercentage(performanceData.keyMetrics.employeePerformance)}
              </Typography>
              <Typography variant="body2" className="ml-2 text-sm text-green-600">
                +1.8%
              </Typography>
            </div>
          </div>
          <div className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 h-1"></div>
        </Card>
      </div>
    </div>
  );
};

BranchPerformanceTab.propTypes = {
  branchId: PropTypes.string.isRequired,
};

export default BranchPerformanceTab;
