"use client";

/**
 * Offline Page
 * Displayed when the user is offline and tries to access a page that's not cached
 */

import React from 'react';
import { WifiIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Button from '../../src/components/atoms/Button';
import Typography from '../../src/components/atoms/Typography';

const OfflinePage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <WifiIcon className="h-12 w-12 text-blue-600 dark:text-blue-300" />
          </div>
          
          <Typography variant="h1" className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            You're Offline
          </Typography>
          
          <Typography variant="body" className="text-gray-600 dark:text-gray-300 mb-6">
            It looks like you've lost your internet connection. Some features may be unavailable until you're back online.
          </Typography>
          
          <div className="space-y-4 w-full">
            <Button 
              variant="primary" 
              className="w-full flex items-center justify-center"
              onClick={handleRefresh}
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Try Again
            </Button>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
              <p>Don't worry! Any changes you make while offline will be synchronized when you're back online.</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <Typography variant="subtitle" className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            Available Offline:
          </Typography>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Dashboard (limited view)
            </li>
            <li className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Recently viewed shipments
            </li>
            <li className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Create new shipments (will sync when online)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;