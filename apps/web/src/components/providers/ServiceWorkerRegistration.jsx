"use client";

/**
 * ServiceWorkerRegistration Component
 * Registers the service worker for PWA functionality
 */

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/uiSlice';

const ServiceWorkerRegistration = () => {
  const dispatch = useDispatch();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    // Only register service worker in production and if the browser supports it
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost'
    ) {
      // Register the service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Service Worker registered successfully:', reg.scope);
          setRegistration(reg);

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is installed, but waiting to be activated
                setUpdateAvailable(true);
                
                // Notify user about the update
                dispatch(
                  addNotification({
                    id: 'sw-update',
                    type: 'info',
                    title: 'Update Available',
                    message: 'A new version of the app is available. Refresh to update.',
                    duration: 0, // Don't auto-dismiss
                    actions: [
                      {
                        label: 'Update Now',
                        onClick: () => {
                          // Skip waiting and reload the page
                          if (registration && registration.waiting) {
                            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                            window.location.reload();
                          }
                        },
                      },
                      {
                        label: 'Later',
                        onClick: () => {
                          dispatch({
                            type: 'ui/removeNotification',
                            payload: 'sw-update',
                          });
                        },
                      },
                    ],
                  })
                );
              }
            });
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Handle service worker updates
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default ServiceWorkerRegistration;
