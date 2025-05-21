/**
 * Custom hook for using translations in the application
 * Wraps react-i18next's useTranslation hook with additional functionality
 */

'use client';

import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { uiActions } from '../store/index';

/**
 * Custom hook for translations
 * @param {string} namespace - The translation namespace to use
 * @returns {Object} - Translation utilities
 */
export const useTranslation = (namespace = 'common') => {
  const { t, i18n } = useI18nTranslation(namespace);
  const dispatch = useDispatch();

  /**
   * Change the current language
   * @param {string} lang - Language code (e.g., 'id', 'en')
   */
  const changeLanguage = useCallback((lang) => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('NEXT_LOCALE', lang);
      document.documentElement.lang = lang;
      // Dispatch the language change to the UI slice
      dispatch(uiActions.setLanguage(lang));
    }
  }, [i18n, dispatch]);

  /**
   * Get the current language
   * @returns {string} - Current language code
   */
  const getCurrentLanguage = useCallback(() => {
    return i18n.language || 'id';
  }, [i18n]);

  /**
   * Check if the current language is RTL
   * @returns {boolean} - True if the current language is RTL
   */
  const isRTL = useCallback(() => {
    return i18n.dir() === 'rtl';
  }, [i18n]);

  /**
   * Get all available languages
   * @returns {Array} - Array of available language codes
   */
  const getLanguages = useCallback(() => {
    return i18n.options.supportedLngs || ['id', 'en'];
  }, [i18n]);

  /**
   * Format a date according to the current locale
   * @param {Date|string} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} - Formatted date
   */
  const formatDate = useCallback((date, options = {}) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'medium',
      ...options,
    }).format(dateObj);
  }, [i18n.language]);

  /**
   * Format a number according to the current locale
   * @param {number} number - Number to format
   * @param {Object} options - Intl.NumberFormat options
   * @returns {string} - Formatted number
   */
  const formatNumber = useCallback((number, options = {}) => {
    return new Intl.NumberFormat(i18n.language, options).format(number);
  }, [i18n.language]);

  /**
   * Format currency according to the current locale
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (default: IDR)
   * @returns {string} - Formatted currency
   */
  const formatCurrency = useCallback((amount, currency = 'IDR') => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
    }).format(amount);
  }, [i18n.language]);

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
    isRTL,
    getLanguages,
    formatDate,
    formatNumber,
    formatCurrency,
  };
};

export default useTranslation;
