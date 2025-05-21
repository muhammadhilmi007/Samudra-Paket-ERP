"use client";

/**
 * UserSettingsMenu Component
 * Menu for user settings including theme and language preferences
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  UserIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { selectTheme, selectLanguage } from '../../store/slices/uiSlice';
import { memoWithName, stableCallback } from '../../utils/memoization';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import LogoutButton from './LogoutButton';
import Button from '../atoms/Button';
import Avatar from '../atoms/Avatar';

const UserSettingsMenu = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector(selectCurrentUser);
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="p-1 flex items-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User Settings"
      >
        <Avatar 
          src={user?.profileImage} 
          alt={user?.name || 'User'} 
          size="sm" 
          fallback={user?.name?.charAt(0) || 'U'} 
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Avatar 
                src={user?.profileImage} 
                alt={user?.name || 'User'} 
                size="md" 
                fallback={user?.name?.charAt(0) || 'U'} 
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  APPEARANCE
                </p>
                <ThemeToggle className="w-full" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  LANGUAGE
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Select your preferred language
                  </span>
                  <LanguageToggle />
                </div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/profile';
              }}
            >
              <UserIcon className="h-5 w-5 mr-2" />
              Profile
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/settings';
              }}
            >
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Settings
            </Button>
            
            <LogoutButton 
              variant="ghost" 
              size="sm" 
              className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
              showIcon={true}
              showText={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memoWithName(UserSettingsMenu, (prevProps, nextProps) => {
  // Only re-render if the className prop changes
  return prevProps.className === nextProps.className;
});
