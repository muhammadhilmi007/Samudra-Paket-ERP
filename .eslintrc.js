/**
 * Minimal ESLint configuration for Samudra Paket ERP
 */

module.exports = {
  root: true,
  // Disable extends to avoid dependency issues during build
  extends: [],
  // Basic rules that don't require external dependencies
  rules: {
    // Allow console statements during development
    'no-console': 'off',
    'no-debugger': 'off'
  },
  // Environment configuration
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // Parser options
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
};
