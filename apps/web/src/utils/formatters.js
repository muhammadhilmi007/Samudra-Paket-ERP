/**
 * Formatters Utility
 * Functions for formatting data consistently across the application
 */

/**
 * Format a date to a localized string
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @param {string} locale - Locale to use (defaults to 'id-ID' for Indonesian)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}, locale = 'id-ID') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

/**
 * Format a date to a short format (DD/MM/YYYY)
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale to use
 * @returns {string} Formatted date string
 */
export const formatShortDate = (date, locale = 'id-ID') => {
  return formatDate(date, { year: 'numeric', month: '2-digit', day: '2-digit' }, locale);
};

/**
 * Format a date and time
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale to use
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date, locale = 'id-ID') => {
  return formatDate(
    date,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
    locale
  );
};

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (defaults to 'IDR' for Indonesian Rupiah)
 * @param {string} locale - Locale to use
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'IDR', locale = 'id-ID') => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number with thousand separators
 * @param {number} number - Number to format
 * @param {string} locale - Locale to use
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, locale = 'id-ID') => {
  if (number === null || number === undefined) return '';
  
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * Format a phone number to a standardized format
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's an Indonesian number
  if (cleaned.startsWith('62') || cleaned.startsWith('0')) {
    // Format as Indonesian number
    let formatted = cleaned;
    
    // If it starts with 0, replace with 62
    if (formatted.startsWith('0')) {
      formatted = '62' + formatted.substring(1);
    }
    
    // Format with spaces for readability
    if (formatted.length > 5) {
      formatted = `+${formatted.substring(0, 2)} ${formatted.substring(2, 5)} ${formatted.substring(5, 9)} ${formatted.substring(9)}`;
    } else if (formatted.length > 2) {
      formatted = `+${formatted.substring(0, 2)} ${formatted.substring(2)}`;
    } else {
      formatted = `+${formatted}`;
    }
    
    return formatted.trim();
  }
  
  // For non-Indonesian numbers, just add a plus sign
  return `+${cleaned}`;
};

/**
 * Format a file size in bytes to a human-readable string
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format a shipment tracking number with proper spacing
 * @param {string} trackingNumber - Tracking number to format
 * @returns {string} Formatted tracking number
 */
export const formatTrackingNumber = (trackingNumber) => {
  if (!trackingNumber) return '';
  
  // Format as groups of 4 characters
  const cleaned = trackingNumber.replace(/\s/g, '');
  const groups = [];
  
  for (let i = 0; i < cleaned.length; i += 4) {
    groups.push(cleaned.substring(i, i + 4));
  }
  
  return groups.join(' ');
};

/**
 * Truncate a string to a specified length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 */
export const truncateString = (str, length = 50) => {
  if (!str) return '';
  if (str.length <= length) return str;
  
  return str.substring(0, length) + '...';
};
