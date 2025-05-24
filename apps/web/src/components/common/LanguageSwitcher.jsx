/**
 * Language Switcher Component
 * Allows users to switch between available languages
 */

'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../store/index';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../atoms/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../molecules/Dropdown';
import { Globe } from 'lucide-react';

/**
 * Language Switcher component
 * Displays a dropdown menu for language selection
 */
const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  // Get the current language directly from the UI slice state
  const currentLanguage = useSelector(state => state.ui.language) || 'id'; // Default to 'id' if not set
  const { t, changeLanguage } = useTranslation();

  // Available languages
  const languages = [
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    if (currentLanguage !== languageCode) {
      changeLanguage(languageCode);
      dispatch(uiActions.setLanguage(languageCode));
    }
  };

  // Get current language display
  const getCurrentLanguageDisplay = () => {
    const language = languages.find((lang) => lang.code === currentLanguage);
    return language ? `${language.flag} ${language.name}` : 'Language';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0 md:h-9 md:w-auto md:px-3">
          <Globe className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline-flex">{getCurrentLanguageDisplay()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-2 ${
              currentLanguage === language.code ? 'bg-primary/10 font-medium' : ''
            }`}
          >
            <span className="text-base">{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
