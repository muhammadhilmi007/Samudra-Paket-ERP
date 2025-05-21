/**
 * Theme Switcher Component
 * Allows users to switch between light, dark, and system themes
 */

'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../store/index';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Sun, Moon, Monitor } from 'lucide-react';
import { THEMES } from '../../utils/themeUtils';

/**
 * Theme Switcher component
 * Displays a dropdown menu for theme selection
 */
const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  // Get the current theme directly from the UI slice state
  const currentTheme = useSelector(state => state.ui.theme) || 'light'; // Default to 'light' if not set
  const { t } = useTranslation();

  // Available themes
  const themes = [
    { value: THEMES.LIGHT, label: t('theme.light'), icon: Sun },
    { value: THEMES.DARK, label: t('theme.dark'), icon: Moon },
    { value: THEMES.SYSTEM, label: t('theme.system'), icon: Monitor },
  ];

  // Handle theme change
  const handleThemeChange = (themeValue) => {
    if (currentTheme !== themeValue) {
      dispatch(uiActions.setTheme(themeValue));
    }
  };

  // Get current theme icon
  const getCurrentThemeIcon = () => {
    switch (currentTheme) {
      case THEMES.DARK:
        return <Moon className="h-4 w-4" />;
      case THEMES.SYSTEM:
        return <Monitor className="h-4 w-4" />;
      case THEMES.LIGHT:
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9">
          {getCurrentThemeIcon()}
          <span className="sr-only">{t('theme.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => {
          const Icon = theme.icon;
          return (
            <DropdownMenuItem
              key={theme.value}
              onClick={() => handleThemeChange(theme.value)}
              className={`flex items-center gap-2 ${
                currentTheme === theme.value ? 'bg-primary/10 font-medium' : ''
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{theme.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
