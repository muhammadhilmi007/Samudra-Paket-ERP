"use client";

/**
 * Dashboard Page
 * Main dashboard page with overview of key metrics and reports
 */

import { dynamicImport } from '../../utils/dynamicImport';
import DashboardOverview from '../../components/dashboard/DashboardOverview';

// Dynamically import heavy components
const NotificationPanel = dynamicImport(() => import('../../components/organisms/NotificationPanel'));

/**
 * Dashboard Page Component
 * @returns {JSX.Element} Dashboard page
 */
export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <DashboardOverview />
        </div>
        <div>
          <NotificationPanel />
        </div>
      </div>
    </div>
  );
}
