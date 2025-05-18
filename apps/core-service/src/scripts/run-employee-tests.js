/**
 * Run Employee Tests
 * Script to run the employee API tests
 */

require('dotenv').config();
const { logger } = require('../utils');
const employeeApiTest = require('../tests/employee-api-test');

/**
 * Run the tests
 */
const runTests = async () => {
  try {
    logger.info('Starting employee API tests...');
    
    // Run the tests
    await employeeApiTest.runTests();
    
    logger.info('Employee API tests completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Tests failed:', error);
    process.exit(1);
  }
};

// Run the tests
runTests();
