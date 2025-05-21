/**
 * LanguageSwitcher Component Stories
 * Documentation and examples for the LanguageSwitcher component
 */

import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LanguageSwitcher from './LanguageSwitcher';
import settingsReducer from '../../store/slices/settingsSlice';

// Create a mock store for the component
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      settings: settingsReducer,
    },
    preloadedState: {
      settings: {
        language: 'id',
        ...initialState,
      },
    },
  });
};

// Define the story metadata
export default {
  title: 'Common/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A language switcher component that allows users to change the application language.',
      },
    },
  },
  // Add a decorator to wrap the component with Redux Provider
  decorators: [
    (Story) => {
      const store = createMockStore();
      return (
        <Provider store={store}>
          <div className="p-4 flex items-center justify-center">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
  // Define the component tags for filtering in the Storybook sidebar
  tags: ['autodocs', 'common', 'language'],
};

// Default story
export const Default = {
  args: {},
};

// Indonesian language selected
export const IndonesianSelected = {
  args: {},
  decorators: [
    (Story) => {
      const store = createMockStore({ language: 'id' });
      return (
        <Provider store={store}>
          <div className="p-4 flex items-center justify-center">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

// English language selected
export const EnglishSelected = {
  args: {},
  decorators: [
    (Story) => {
      const store = createMockStore({ language: 'en' });
      return (
        <Provider store={store}>
          <div className="p-4 flex items-center justify-center">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

// Mobile view
export const MobileView = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
