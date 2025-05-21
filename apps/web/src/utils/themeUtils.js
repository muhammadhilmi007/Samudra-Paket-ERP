/**
 * Theme Utilities
 * Functions for handling theme, colors, and UI-related functionality
 */

// Theme storage key
const THEME_KEY = 'samudra_theme';

// Available themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

/**
 * Get the stored theme preference
 * @returns {string} Theme preference (light, dark, or system)
 */
export const getStoredTheme = () => {
  if (typeof window === 'undefined') return THEMES.LIGHT;
  
  const storedTheme = localStorage.getItem(THEME_KEY);
  return storedTheme || THEMES.SYSTEM;
};

/**
 * Store theme preference
 * @param {string} theme - Theme preference (light, dark, or system)
 */
export const storeTheme = (theme) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(THEME_KEY, theme);
};

/**
 * Get the effective theme based on preference and system settings
 * @param {string} preference - Theme preference (light, dark, or system)
 * @returns {string} Effective theme (light or dark)
 */
export const getEffectiveTheme = (preference) => {
  if (preference === THEMES.SYSTEM) {
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEMES.DARK
        : THEMES.LIGHT;
    }
    return THEMES.LIGHT;
  }
  
  return preference;
};

/**
 * Apply theme to document
 * @param {string} theme - Theme to apply (light or dark)
 */
export const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;
  
  const effectiveTheme = getEffectiveTheme(theme);
  
  if (effectiveTheme === THEMES.DARK) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Get color value based on theme
 * @param {string} colorName - Color name (e.g., primary, secondary)
 * @param {string} shade - Color shade (e.g., 500, 600)
 * @param {string} theme - Current theme (light or dark)
 * @returns {string} Color value
 */
export const getThemeColor = (colorName, shade = '500', theme = THEMES.LIGHT) => {
  // Define color palette based on Tailwind CSS
  const colors = {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#2563eb', // Primary color from project requirements
      600: '#2558cc',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981', // Secondary color from project requirements
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    success: {
      500: '#22c55e', // Success color from project requirements
    },
    warning: {
      500: '#f59e0b', // Warning color from project requirements
    },
    error: {
      500: '#ef4444', // Error color from project requirements
    },
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },
  };
  
  // Return the requested color or a fallback
  return colors[colorName]?.[shade] || colors.primary[500];
};

/**
 * Get status color based on status value
 * @param {string} status - Status value
 * @returns {string} Color name for the status
 */
export const getStatusColor = (status) => {
  const statusColors = {
    // Shipment statuses
    'pending': 'warning',
    'processing': 'primary',
    'in_transit': 'primary',
    'delivered': 'success',
    'cancelled': 'error',
    'returned': 'warning',
    
    // Payment statuses
    'paid': 'success',
    'unpaid': 'warning',
    'overdue': 'error',
    'refunded': 'neutral',
    
    // General statuses
    'active': 'success',
    'inactive': 'neutral',
    'draft': 'neutral',
    'published': 'success',
    'archived': 'neutral',
  };
  
  return statusColors[status?.toLowerCase()] || 'neutral';
};

/**
 * Format a color for CSS usage
 * @param {string} colorName - Color name (e.g., primary, secondary)
 * @param {string} shade - Color shade (e.g., 500, 600)
 * @param {string} format - Output format (hex, rgb, or rgba)
 * @param {number} alpha - Alpha value for rgba format
 * @returns {string} Formatted color value
 */
export const formatColor = (colorName, shade = '500', format = 'hex', alpha = 1) => {
  const colorValue = getThemeColor(colorName, shade);
  
  if (format === 'hex' || !colorValue) {
    return colorValue;
  }
  
  // Convert hex to rgb
  const hex = colorValue.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  if (format === 'rgb') {
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  if (format === 'rgba') {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  return colorValue;
};
