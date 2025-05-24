"use client";

/**
 * OfflineIndicator Component
 * Displays the current online/offline status and pending sync operations
 */

import React, { useState, useEffect } from 'react';
import { WifiIcon, CloudArrowUpIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

const OfflineIndicator = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const { isOnline, isSyncing, pendingOperations, syncPendingOperations } = useNetworkStatus({ enableSync: true });
  
  // Show indicator when offline or when there are pending operations or syncing
  useEffect(() => {
    setIsVisible(!isOnline || pendingOperations > 0 || isSyncing);
    
    // Reset sync success when status changes
    if (!isOnline || pendingOperations > 0 || isSyncing) {
      setSyncSuccess(false);
    }
  }, [isOnline, pendingOperations, isSyncing]);
  
  // Hide indicator after 5 seconds if online and no pending operations and not syncing
  useEffect(() => {
    let timer;
    if (isOnline && pendingOperations === 0 && !isSyncing && isVisible && syncSuccess) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [isOnline, pendingOperations, isSyncing, isVisible, syncSuccess]);
  
  // Handle sync operation
  const handleSync = async () => {
    try {
      await syncPendingOperations();
      setSyncSuccess(true);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncSuccess(false);
    }
  };
  
  // Don't render anything if not visible
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs">
        <div className="flex items-center space-x-3">
          {!isOnline ? (
            <div className="flex-shrink-0 bg-red-100 dark:bg-red-900 rounded-full p-2">
              <WifiIcon className="h-5 w-5 text-red-600 dark:text-red-300" />
            </div>
          ) : isSyncing ? (
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-full p-2">
              <ArrowPathIcon className="h-5 w-5 text-blue-600 dark:text-blue-300 animate-spin" />
            </div>
          ) : pendingOperations > 0 ? (
            <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900 rounded-full p-2">
              <CloudArrowUpIcon className="h-5 w-5 text-amber-600 dark:text-amber-300" />
            </div>
          ) : (
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-full p-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {!isOnline ? (
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                <span className="font-medium">You're offline</span>
              </p>
            ) : isSyncing ? (
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                <span className="font-medium">Syncing changes...</span>
              </p>
            ) : pendingOperations > 0 ? (
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                <span className="font-medium">{pendingOperations} pending {pendingOperations === 1 ? 'change' : 'changes'}</span>
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                <span className="font-medium">All changes synced</span>
              </p>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {!isOnline
                ? "Changes will sync when you're back online"
                : isSyncing
                ? "Synchronizing with server..."
                : pendingOperations > 0
                ? "Waiting to sync changes"
                : "Your data is up to date"}
            </p>
          </div>
          
          {isOnline && pendingOperations > 0 && !isSyncing && (
            <button
              onClick={handleSync}
              className="ml-2 inline-flex items-center justify-center p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 focus:outline-none"
              aria-label="Sync now"
            >
              <CloudArrowUpIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
