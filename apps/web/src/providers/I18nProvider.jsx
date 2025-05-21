/**
 * I18n Provider Component
 * Provides internationalization capabilities to the application
 */

'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

// Import configuration
import i18nextConfig from '../../next-i18next.config';

/**
 * Initialize i18next with client-side resources
 */
const initI18next = async () => {
  // Initialize i18next
  await i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      ...i18nextConfig,
      lng: localStorage.getItem('NEXT_LOCALE') || 'id',
      fallbackLng: 'id',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'cookie', 'navigator'],
        caches: ['localStorage', 'cookie'],
      },
    });

  // Load resources dynamically
  const loadResources = async (locale, namespace) => {
    try {
      const resource = await import(`../../public/locales/${locale}/${namespace}.json`);
      i18next.addResourceBundle(locale, namespace, resource.default || resource);
    } catch (error) {
      console.error(`Failed to load ${locale}/${namespace} translations:`, error);
    }
  };

  // Load all namespaces for all locales
  const locales = ['id', 'en'];
  const namespaces = ['common', 'auth'];
  // const namespaces = ['common', 'auth', 'dashboard', 'shipment', 'customer', 'finance', 'settings'];

  for (const locale of locales) {
    for (const namespace of namespaces) {
      try {
        await loadResources(locale, namespace);
      } catch (error) {
        console.error(`Failed to load ${locale}/${namespace} translations:`, error);
      }
    }
  }

  return i18next;
};

/**
 * I18n Provider component that wraps the application with i18next
 * This enables all components to access translation functions
 */
const I18nProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useSelector((state) => state.settings) || { language: 'id' };

  // Initialize i18next
  const [i18n, setI18n] = React.useState(null);

  useEffect(() => {
    const init = async () => {
      const i18nInstance = await initI18next();
      setI18n(i18nInstance);
    };

    init();
  }, []);

  // Update language when it changes in Redux store
  useEffect(() => {
    if (i18n && language) {
      i18n.changeLanguage(language);
      localStorage.setItem('NEXT_LOCALE', language);
      document.documentElement.lang = language;
    }
  }, [i18n, language]);

  // Show loading state until i18n is initialized
  if (!i18n) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading translations...</p>
        </div>
      </div>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;
