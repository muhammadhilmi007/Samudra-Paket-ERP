'use client';

/**
 * Client-side Providers wrapper component
 * Wraps all client-side providers in a single component for use in server components
 */

import React from 'react';
import ReduxProvider from '../../providers/ReduxProvider';

/**
 * Client Providers component
 * Combines all client-side providers in the correct order
 */
export default function Providers({ children }) {
  return (
    <ReduxProvider>
      {children}
    </ReduxProvider>
  );
}
