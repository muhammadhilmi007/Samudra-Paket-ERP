/**
 * Language Utilities
 * Functions for handling language and internationalization
 */

// Language storage key
const LANGUAGE_KEY = 'samudra_language';

// Available languages
export const LANGUAGES = {
  EN: 'en',
  ID: 'id',
};

// Default language
export const DEFAULT_LANGUAGE = LANGUAGES.ID;

/**
 * Get the stored language preference
 * @returns {string} Language code (en or id)
 */
export const getStoredLanguage = () => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const storedLanguage = localStorage.getItem(LANGUAGE_KEY);
  return storedLanguage || DEFAULT_LANGUAGE;
};

/**
 * Store language preference
 * @param {string} language - Language code (en or id)
 */
export const storeLanguage = (language) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(LANGUAGE_KEY, language);
};

/**
 * Get language name from code
 * @param {string} code - Language code (en or id)
 * @returns {string} Language name
 */
export const getLanguageName = (code) => {
  const names = {
    [LANGUAGES.EN]: 'English',
    [LANGUAGES.ID]: 'Indonesia',
  };
  
  return names[code] || names[DEFAULT_LANGUAGE];
};

/**
 * Get language flag from code
 * @param {string} code - Language code (en or id)
 * @returns {string} Flag emoji
 */
export const getLanguageFlag = (code) => {
  const flags = {
    [LANGUAGES.EN]: '🇺🇸',
    [LANGUAGES.ID]: '🇮🇩',
  };
  
  return flags[code] || flags[DEFAULT_LANGUAGE];
};
