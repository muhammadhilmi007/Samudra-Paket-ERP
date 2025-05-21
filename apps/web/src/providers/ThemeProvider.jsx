/**
 * Theme Provider Component
 * Provides theme context and functionality for the application
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../store/index';
import { THEMES, getStoredTheme, storeTheme, applyTheme } from '../utils/themeUtils';

// Create theme context
const ThemeContext = createContext({
  theme: THEMES.LIGHT,
  setTheme: () => {},
  toggleTheme: () => {},
});

/**
 * Theme Provider component
 * Manages theme state and provides theme context to children
 */
export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  // Use the theme from uiSlice with system preference fallback
  const reduxTheme = useSelector(state => state.ui.theme);
  const [mounted, setMounted] = useState(false);
  
  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = getStoredTheme();
    
    if (storedTheme && storedTheme !== reduxTheme) {
      dispatch(uiActions.setTheme(storedTheme));
    }
    
    setMounted(true);
  }, [dispatch, reduxTheme]);
  
  // Apply theme when it changes
  useEffect(() => {
    if (mounted) {
      applyTheme(reduxTheme);
      storeTheme(reduxTheme);
    }
  }, [reduxTheme, mounted]);
  
  // Handle theme change
  const handleSetTheme = (newTheme) => {
    dispatch(uiActions.setTheme(newTheme));
  };
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = reduxTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    dispatch(setTheme(newTheme));
  };
  
  // Context value
  const value = {
    theme: reduxTheme,
    setTheme: handleSetTheme,
    toggleTheme,
  };
  
  // Avoid rendering with wrong theme
  if (!mounted) {
    return null;
  }
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use theme context
 * @returns {Object} Theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeProvider;
