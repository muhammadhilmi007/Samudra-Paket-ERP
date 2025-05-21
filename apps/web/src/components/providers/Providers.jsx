'use client';

/**
 * Client-side Providers wrapper component
 * Wraps all client-side providers in a single component for use in server components
 */

import React from 'react';
import ReduxProvider from '../../providers/ReduxProvider';
import ThemeProvider from '../../providers/ThemeProvider';
import I18nProvider from '../../providers/I18nProvider';
import PerformanceProvider from '../../providers/PerformanceProvider';
import AuthProvider from '../providers/AuthProvider';
import AnalyticsProvider from '../providers/AnalyticsProvider';
import WebSocketProvider from '../providers/WebSocketProvider';
import ServiceWorkerRegistration from '../providers/ServiceWorkerRegistration';
import NotificationCenter from '../organisms/NotificationCenter';
import OfflineIndicator from '../molecules/OfflineIndicator';

/**
 * Client Providers component
 * Combines all client-side providers in the correct order
 */
export default function Providers({ children }) {
  return (
    <ReduxProvider>
      <I18nProvider>
        <ThemeProvider>
          <PerformanceProvider>
            <AuthProvider>
              <AnalyticsProvider>
                <WebSocketProvider>
                  <ServiceWorkerRegistration />
                  <NotificationCenter />
                  <OfflineIndicator />
                  {children}
                </WebSocketProvider>
              </AnalyticsProvider>
            </AuthProvider>
          </PerformanceProvider>
        </ThemeProvider>
      </I18nProvider>
    </ReduxProvider>
  );
}
