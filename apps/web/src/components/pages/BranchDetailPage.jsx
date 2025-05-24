"use client";

/**
 * BranchDetailPage Component
 * Displays detailed information about a specific branch with tabbed interface
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import DashboardLayout from '../templates/DashboardLayout';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import Tabs from '../molecules/Tabs';
import Badge from '../atoms/Badge';
import MasterDataNavigation from '../molecules/MasterDataNavigation';
import { 
  useGetBranchByIdQuery,
  useGetDivisionsByBranchQuery
} from '../../store/api/masterDataApi';
import { createNotificationHandler } from '../../utils/notificationUtils';

// Tab components
import BranchGeneralInfo from '../organisms/branch-detail/BranchGeneralInfo';
import BranchDivisionsTab from '../organisms/branch-detail/BranchDivisionsTab';
import BranchPerformanceTab from '../organisms/branch-detail/BranchPerformanceTab';
import BranchServiceAreaTab from '../organisms/branch-detail/BranchServiceAreaTab';
import BranchDocumentsTab from '../organisms/branch-detail/BranchDocumentsTab';
import BranchPositionsTab from '../organisms/branch-detail/BranchPositionsTab';
import OrganizationalChartTab from '../organisms/branch-detail/OrganizationalChartTab';

const BranchDetailPage = ({ branchId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('general');
  
  // RTK Query hooks
  const { 
    data: branch, 
    isLoading: isLoadingBranch,
    error: branchError,
    refetch: refetchBranch
  } = useGetBranchByIdQuery(branchId, {
    skip: !branchId
  });
  
  const { 
    data: divisions, 
    isLoading: isLoadingDivisions 
  } = useGetDivisionsByBranchQuery(branchId, {
    skip: !branchId
  });
  
  // Handle error
  useEffect(() => {
    if (branchError) {
      notifications.error(branchError?.data?.message || 'Failed to load branch details');
      router.push('/master-data/branches');
    }
  }, [branchError, notifications, router]);
  
  // Define tabs
  const tabs = [
    {
      id: 'general',
      label: 'General Information',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'divisions',
      label: 'Divisions',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'positions',
      label: 'Positions',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'org-chart',
      label: 'Org Chart',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'service-area',
      label: 'Service Area',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  // Loading state
  if (isLoadingBranch) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <MasterDataNavigation />
            </div>
            <div className="lg:col-span-3">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Error state (should be handled by useEffect)
  if (!branch && !isLoadingBranch) {
    return null;
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <MasterDataNavigation />
          </div>
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <div className="flex items-center">
                  <Typography variant="h1" className="text-2xl font-bold mr-3">
                    {branch?.name}
                  </Typography>
                  <Badge
                    variant={branch?.isActive ? 'success' : 'danger'}
                    size="md"
                  >
                    {branch?.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Typography variant="body2" className="text-gray-600 mt-1">
                  Branch Code: {branch?.code} | City: {branch?.city}, {branch?.province}
                </Typography>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => refetchBranch()}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push(`/master-data/branches/edit/${branchId}`)}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Branch
                </Button>
              </div>
            </div>
            
            {/* Tabs */}
            <Card>
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={handleTabChange}
              />
              
              <div className="p-6">
                {activeTab === 'general' && (
                  <BranchGeneralInfo branch={branch} />
                )}
                
                {activeTab === 'divisions' && (
                  <BranchDivisionsTab 
                    branchId={branchId} 
                    divisions={divisions || []} 
                    isLoading={isLoadingDivisions}
                  />
                )}
                
                {activeTab === 'positions' && (
                  <BranchPositionsTab branchId={branchId} />
                )}
                
                {activeTab === 'org-chart' && (
                  <OrganizationalChartTab branchId={branchId} />
                )}
                
                {activeTab === 'performance' && (
                  <BranchPerformanceTab branchId={branchId} />
                )}
                
                {activeTab === 'service-area' && (
                  <BranchServiceAreaTab branchId={branchId} />
                )}
                
                {activeTab === 'documents' && (
                  <BranchDocumentsTab branchId={branchId} />
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BranchDetailPage;
