"use client";

/**
 * ThemeToggle Component
 * Toggle switch for changing between light and dark themes
 */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { setTheme, selectTheme } from '../../store/slices/uiSlice';
import { THEMES } from '../../utils/themeUtils';
import Button from '../atoms/Button';
import Tooltip from '../atoms/Tooltip';

const ThemeToggle = ({ className = '' }) => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);

  const handleThemeChange = (theme) => {
    dispatch(setTheme(theme));
  };

  return (
    <div className={`flex items-center rounded-lg border border-gray-200 dark:border-gray-700 p-1 ${className}`}>
      <Tooltip content="Light Mode">
        <Button
          variant="ghost"
          size="sm"
          className={`p-2 ${currentTheme === THEMES.LIGHT ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : ''}`}
          onClick={() => handleThemeChange(THEMES.LIGHT)}
          aria-label="Light Mode"
        >
          <SunIcon className="h-5 w-5" />
        </Button>
      </Tooltip>
      
      <Tooltip content="Dark Mode">
        <Button
          variant="ghost"
          size="sm"
          className={`p-2 ${currentTheme === THEMES.DARK ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : ''}`}
          onClick={() => handleThemeChange(THEMES.DARK)}
          aria-label="Dark Mode"
        >
          <MoonIcon className="h-5 w-5" />
        </Button>
      </Tooltip>
      
      <Tooltip content="System Preference">
        <Button
          variant="ghost"
          size="sm"
          className={`p-2 ${currentTheme === THEMES.SYSTEM ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : ''}`}
          onClick={() => handleThemeChange(THEMES.SYSTEM)}
          aria-label="System Preference"
        >
          <ComputerDesktopIcon className="h-5 w-5" />
        </Button>
      </Tooltip>
    </div>
  );
};

export default ThemeToggle;
