"use client";

/**
 * Analytics Settings Page
 * Displays analytics dashboard and settings for the application
 */

import React from 'react';
import DashboardLayout from '../../../components/templates/DashboardLayout';
import AnalyticsDashboard from '../../../components/pages/Settings/AnalyticsDashboard';
import { useAnalytics } from '../../../hooks/useAnalytics';

const AnalyticsPage = () => {
  // Initialize analytics tracking
  useAnalytics({ componentName: 'AnalyticsPage' });

  return (
    <DashboardLayout>
      <AnalyticsDashboard />
    </DashboardLayout>
  );
};

export default AnalyticsPage;
