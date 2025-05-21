'use client';

/**
 * Providers Component
 * Wraps the application with all necessary providers
 */

import React from 'react';
import ReduxProvider from './ReduxProvider';
import ThemeProvider from './ThemeProvider';

const Providers = ({ children }) => {
  return (
    <ReduxProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default Providers;
