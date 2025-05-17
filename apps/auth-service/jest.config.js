/**
 * Jest Configuration
 * Configures Jest for testing the auth service
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test files pattern
  testMatch: ['**/tests/**/*.test.js'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**',
    '!src/server.js',
    '!src/config/**',
    '!src/infrastructure/database/seeders/**'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup files and teardown
  setupFilesAfterEnv: ['jest-extended/all'],
  
  // Test timeout
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Environment variables for tests
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  setupFilesAfterEnv: ['./src/tests/setup.js'],
  
  // Timeout configuration
  testTimeout: 30000,
  
  // Verbose output
  verbose: true
};
