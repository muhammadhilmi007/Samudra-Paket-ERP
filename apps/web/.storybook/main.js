import { join, dirname } from "path";

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  // Storybook stories configuration
  "stories": [
    "../src/components/**/*.stories.@(js|jsx|mdx)",
    "../src/components/**/*.story.@(js|jsx|mdx)"
  ],
  
  // Storybook addons
  "addons": [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
    {
      name: '@storybook/addon-styling',
      options: {
        postCss: true,
      },
    },
  ],
  
  // Framework configuration
  "framework": {
    "name": getAbsolutePath('@storybook/nextjs'),
    "options": {
      "builder": {
        "useSWC": true,
      }
    }
  },
  
  // Static directories
  "staticDirs": [
    "../public"
  ],
  
  // Docs configuration
  "docs": {
    "autodocs": true,
    "defaultName": "Documentation"
  },
  
  // TypeScript configuration
  "typescript": {
    "reactDocgen": "react-docgen-typescript",
    "reactDocgenTypescriptOptions": {
      "compilerOptions": {
        "allowSyntheticDefaultImports": true,
        "esModuleInterop": true,
      },
      "propFilter": {
        "skipPropsWithoutDoc": false
      }
    }
  }
};
export default config;