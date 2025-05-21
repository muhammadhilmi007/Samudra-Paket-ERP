"use client";

/**
 * LanguageToggle Component
 * Toggle for switching between supported languages
 */

import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { setLanguage, selectLanguage } from '../../store/slices/uiSlice';
import { LANGUAGES, getLanguageName, getLanguageFlag, storeLanguage } from '../../utils/languageUtils';
import Button from '../atoms/Button';
import Tooltip from '../atoms/Tooltip';
import { createNotificationHandler } from '../../utils/notificationUtils';

const LanguageToggle = ({ className = '' }) => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectLanguage);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifications = createNotificationHandler(dispatch);

  const handleLanguageChange = (language) => {
    if (language === currentLanguage) {
      setIsOpen(false);
      return;
    }

    dispatch(setLanguage(language));
    storeLanguage(language);
    setIsOpen(false);
    
    notifications.success(`Language changed to ${getLanguageName(language)}`);
    
    // Reload the page to apply language change
    // In a real implementation, this would be handled by a proper i18n library
    // without requiring a page reload
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

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
      <Tooltip content="Change Language">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 flex items-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Change Language"
        >
          <GlobeAltIcon className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">{getLanguageFlag(currentLanguage)}</span>
        </Button>
      </Tooltip>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {Object.values(LANGUAGES).map((language) => (
              <button
                key={language}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  language === currentLanguage
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                role="menuitem"
                onClick={() => handleLanguageChange(language)}
              >
                <span className="mr-2">{getLanguageFlag(language)}</span>
                {getLanguageName(language)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
