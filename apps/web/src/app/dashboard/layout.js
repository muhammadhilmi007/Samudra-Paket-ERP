/**
 * Dashboard Layout
 * Layout wrapper for all dashboard pages
 * Protected by authentication
 */

'use client';

import React from 'react';
import withAuth from '../../components/hoc/withAuth';
import DashboardLayout from '../../components/templates/DashboardLayout';
import ProtectedRoute from '../../components/templates/ProtectedRoute';

/**
 * Dashboard layout component that wraps all dashboard pages
 * Provides consistent layout with sidebar and header
 * Protected by authentication using both HOC and ProtectedRoute component
 */
const DashboardLayoutWrapper = ({ children }) => {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
};

// Wrap with authentication HOC for additional role-based protection
export default withAuth(DashboardLayoutWrapper);
