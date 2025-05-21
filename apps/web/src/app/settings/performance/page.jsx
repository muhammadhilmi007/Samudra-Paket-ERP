"use client";

/**
 * Performance Monitoring Page
 * Displays performance metrics and insights for the application
 */

import React from 'react';
import DashboardLayout from '../../../components/templates/DashboardLayout';
import PerformanceDashboard from '../../../components/pages/Settings/PerformanceDashboard';
import { usePerformanceMonitoring } from '../../../hooks/usePerformanceMonitoring';

const PerformancePage = () => {
  // Initialize performance monitoring
  usePerformanceMonitoring('PerformancePage');

  return (
    <DashboardLayout>
      <PerformanceDashboard />
    </DashboardLayout>
  );
};

export default PerformancePage;
