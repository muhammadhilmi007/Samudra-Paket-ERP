"use client";

/**
 * OfflineIndicator Component
 * Displays the current online/offline status and pending sync operations
 */

import React, { useState, useEffect } from 'react';
import { WifiIcon, CloudArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useOfflineStorage } from '../../hooks/useOfflineStorage';
import { offlineStorage } from '../../utils/offlineStorage';

const OfflineIndicator = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isOnline, pendingOperations, syncPendingOperations } = useOfflineStorage(offlineStorage.STORES.SHIPMENTS);
  
  // Show indicator when offline or when there are pending operations
  useEffect(() => {
    setIsVisible(!isOnline || pendingOperations > 0);
  }, [isOnline, pendingOperations]);
  
  // Hide indicator after 5 seconds if online and no pending operations
  useEffect(() => {
    let timer;
    if (isOnline && pendingOperations === 0 && isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOnline, pendingOperations, isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center p-3 rounded-lg shadow-lg ${
        !isOnline 
          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
          : pendingOperations > 0 
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      }`}>
        {!isOnline ? (
          <>
            <WifiIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">You're offline</span>
          </>
        ) : pendingOperations > 0 ? (
          <>
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">{pendingOperations} {pendingOperations === 1 ? 'change' : 'changes'} pending</span>
            <button 
              onClick={syncPendingOperations}
              className="ml-2 text-xs bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded"
            >
              Sync Now
            </button>
          </>
        ) : (
          <>
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">All changes synced</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;
