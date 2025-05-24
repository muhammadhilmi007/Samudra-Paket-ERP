import '../src/app/globals.css';
import { withThemeByClassName } from '@storybook/addon-styling';
import { THEMES } from '../src/utils/themeUtils';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#FFFFFF' },
        { name: 'dark', value: '#1E293B' },
        { name: 'gray', value: '#F1F5F9' },
      ],
    },
    nextjs: {
      appDirectory: true,
    },
  },
  
  // Provide the available themes
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: THEMES.LIGHT,
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: THEMES.LIGHT, title: 'Light', icon: 'sun' },
          { value: THEMES.DARK, title: 'Dark', icon: 'moon' },
        ],
        showName: true,
      },
    },
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      defaultValue: 'id',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'id', title: 'Bahasa Indonesia' },
          { value: 'en', title: 'English' },
        ],
        showName: true,
      },
    },
  },
  
  // Apply Tailwind dark mode class
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      <div className="p-6 max-w-full">
        <Story />
      </div>
    ),
  ],
};

export default preview;