/**
 * Internationalization Testing
 * Tests multiple language support across the application
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../providers/I18nProvider';

// Import components that use translations
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import LoginPage from '../../components/pages/LoginPage';
import DashboardPage from '../../components/pages/DashboardPage';
import ShipmentFormPage from '../../components/pages/ShipmentFormPage';

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    auth: (state = { user: { role: 'admin' } }, action) => state,
    notifications: (state = { notifications: [] }, action) => state,
  },
});

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    pathname: '/',
  }),
}));

describe('Internationalization Tests', () => {
  beforeEach(() => {
    // Reset language to default (Indonesian)
    i18n.changeLanguage('id');
  });

  it('should render LanguageSwitcher with correct options', () => {
    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <LanguageSwitcher />
        </I18nextProvider>
      </Provider>
    );

    // Check language options
    expect(screen.getByText('Bahasa Indonesia')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('should switch language from Indonesian to English', async () => {
    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <LanguageSwitcher />
          <LoginPage />
        </I18nextProvider>
      </Provider>
    );

    // Check initial language (Indonesian)
    expect(screen.getByText('Masuk')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Kata Sandi')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument();

    // Switch to English
    fireEvent.click(screen.getByText('English'));

    // Check language changed to English
    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });
  });

  it('should switch language from English to Indonesian', async () => {
    // Start with English
    i18n.changeLanguage('en');

    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <LanguageSwitcher />
          <LoginPage />
        </I18nextProvider>
      </Provider>
    );

    // Check initial language (English)
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();

    // Switch to Indonesian
    fireEvent.click(screen.getByText('Bahasa Indonesia'));

    // Check language changed to Indonesian
    await waitFor(() => {
      expect(screen.getByText('Masuk')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Kata Sandi')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument();
    });
  });

  it('should persist language preference across page navigation', async () => {
    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value;
        }),
        clear: jest.fn(() => {
          store = {};
        }),
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <LanguageSwitcher />
          <LoginPage />
        </I18nextProvider>
      </Provider>
    );

    // Switch to English
    fireEvent.click(screen.getByText('English'));

    // Verify localStorage was updated
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('i18nextLng', 'en');
    });

    // Unmount and remount component to simulate page navigation
    const { unmount } = render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <LanguageSwitcher />
          <LoginPage />
        </I18nextProvider>
      </Provider>
    );
    unmount();

    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <LanguageSwitcher />
          <LoginPage />
        </I18nextProvider>
      </Provider>
    );

    // Language should still be English
    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });
  });

  it('should format dates according to locale', async () => {
    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <DashboardPage />
        </I18nextProvider>
      </Provider>
    );

    // Check date format in Indonesian
    const indonesianDateFormat = screen.getByTestId('current-date');
    expect(indonesianDateFormat.textContent).toMatch(/\d{1,2} [A-Za-z]+ \d{4}/); // e.g., "22 Mei 2025"

    // Switch to English
    i18n.changeLanguage('en');

    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <DashboardPage />
        </I18nextProvider>
      </Provider>
    );

    // Check date format in English
    const englishDateFormat = screen.getByTestId('current-date');
    expect(englishDateFormat.textContent).toMatch(/[A-Za-z]+ \d{1,2}, \d{4}/); // e.g., "May 22, 2025"
  });

  it('should format numbers and currency according to locale', async () => {
    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <ShipmentFormPage />
        </I18nextProvider>
      </Provider>
    );

    // Enter weight and check price calculation in Indonesian
    const weightInput = screen.getByLabelText('Berat (kg)');
    fireEvent.change(weightInput, { target: { value: '2.5' } });

    // Price should be formatted as Indonesian currency
    const priceDisplay = screen.getByTestId('calculated-price');
    expect(priceDisplay.textContent).toMatch(/Rp\s*\d{1,3}(.\d{3})*,\d{2}/); // e.g., "Rp 25.000,00"

    // Switch to English
    i18n.changeLanguage('en');

    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <ShipmentFormPage />
        </I18nextProvider>
      </Provider>
    );

    // Enter weight and check price calculation in English
    const weightInputEn = screen.getByLabelText('Weight (kg)');
    fireEvent.change(weightInputEn, { target: { value: '2.5' } });

    // Price should be formatted as English currency
    const priceDisplayEn = screen.getByTestId('calculated-price');
    expect(priceDisplayEn.textContent).toMatch(/IDR\s*\d{1,3}(,\d{3})*\.\d{2}/); // e.g., "IDR 25,000.00"
  });

  it('should handle pluralization correctly in different languages', async () => {
    // Mock shipment data with multiple items
    const shipmentData = {
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ]
    };

    // Set up a component that uses pluralization
    const PluralizedComponent = () => {
      const { t } = useTranslation();
      return (
        <div>
          <span data-testid="item-count">
            {t('shipment.itemCount', { count: shipmentData.items.length })}
          </span>
        </div>
      );
    };

    // Render with Indonesian locale
    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <PluralizedComponent />
        </I18nextProvider>
      </Provider>
    );

    // Check pluralization in Indonesian
    const indonesianText = screen.getByTestId('item-count');
    expect(indonesianText.textContent).toBe('3 barang');

    // Switch to English
    i18n.changeLanguage('en');

    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <PluralizedComponent />
        </I18nextProvider>
      </Provider>
    );

    // Check pluralization in English
    const englishText = screen.getByTestId('item-count');
    expect(englishText.textContent).toBe('3 items');
  });

  it('should handle right-to-left languages correctly', async () => {
    // Add Arabic as a test language
    i18n.addResourceBundle('ar', 'translation', {
      login: 'تسجيل الدخول',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      language: 'اللغة',
    });

    // Set language to Arabic
    i18n.changeLanguage('ar');

    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <LoginPage />
        </I18nextProvider>
      </Provider>
    );

    // Check RTL direction
    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toHaveAttribute('dir', 'rtl');

    // Check Arabic translations
    expect(screen.getByText('تسجيل الدخول')).toBeInTheDocument();
    expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
    expect(screen.getByLabelText('كلمة المرور')).toBeInTheDocument();
  });

  it('should handle missing translations gracefully', async () => {
    // Create a custom language with incomplete translations
    i18n.addResourceBundle('custom', 'translation', {
      login: 'Custom Login',
      // Missing other translations
    });

    // Set language to custom
    i18n.changeLanguage('custom');

    render(
      <Provider store={mockStore}>
        <I18nextProvider i18n={i18n}>
          <LoginPage />
        </I18nextProvider>
      </Provider>
    );

    // Check that the available translation is used
    expect(screen.getByText('Custom Login')).toBeInTheDocument();

    // Check that missing translations fall back to key names or default language
    // This depends on your i18n configuration, but there should be some text displayed
    const emailField = screen.getByLabelText(/email/i);
    expect(emailField).toBeInTheDocument();
  });
});
