"use client";

/**
 * Reports Page
 * Main reports page with access to different report types
 */

import { useState } from 'react';
import { dynamicImport } from '../../utils/dynamicImport';

// Dynamically import heavy report components
const ShipmentReport = dynamicImport(() => import('../../components/pages/Reports/ShipmentReport'));
const FinancialReport = dynamicImport(() => import('../../components/pages/Reports/FinancialReport'));
const PerformanceReport = dynamicImport(() => import('../../components/pages/Reports/PerformanceReport'));

/**
 * Reports Page Component
 * @returns {JSX.Element} Reports page
 */
export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('shipment');

  const renderReport = () => {
    switch (activeReport) {
      case 'shipment':
        return <ShipmentReport />;
      case 'financial':
        return <FinancialReport />;
      case 'performance':
        return <PerformanceReport />;
      default:
        return <ShipmentReport />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
      <div className="mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeReport === 'shipment'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('shipment')}
          >
            Shipment Reports
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeReport === 'financial'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('financial')}
          >
            Financial Reports
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeReport === 'performance'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('performance')}
          >
            Performance Reports
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {renderReport()}
      </div>
    </div>
  );
}
