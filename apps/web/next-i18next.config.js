/**
 * Next.js i18n Configuration
 * Configuration for internationalization with next-i18next
 */

module.exports = {
  i18n: {
    // List of locales supported by the application
    locales: ['id', 'en'],
    // Default locale
    defaultLocale: 'id',
    // Locale detection strategies
    localeDetection: true,
  },
  // Namespaces configuration
  ns: ['common', 'auth', 'dashboard', 'shipment', 'customer', 'finance', 'settings'],
  // Default namespace
  defaultNS: 'common',
  // Load only languages on client side
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
  // Detect user language
  detection: {
    // Order of detection methods
    order: ['cookie', 'localStorage', 'navigator', 'path', 'subdomain'],
    // Cookie name for storing the language preference
    lookupCookie: 'NEXT_LOCALE',
    // Cookie options
    cookieOptions: { path: '/', sameSite: 'strict' },
    // Cache user language detection
    caches: ['cookie', 'localStorage'],
  },
  // React configuration
  react: {
    useSuspense: false,
  },
};
