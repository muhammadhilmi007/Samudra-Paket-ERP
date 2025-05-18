/**
 * Run Employee Integration Tests
 * Script to run the employee integration tests
 */

require('dotenv').config();
const { execSync } = require('child_process');
const { logger } = require('../utils');

/**
 * Run the integration tests
 */
const runIntegrationTests = () => {
  try {
    logger.info('Starting employee integration tests...');
    
    // Run the integration tests using Jest
    execSync('npx jest --config=jest.config.js src/tests/integration/employee-integration.test.js', { 
      stdio: 'inherit' 
    });
    
    logger.info('Employee integration tests completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Integration tests failed');
    process.exit(1);
  }
};

// Run the integration tests
runIntegrationTests();
