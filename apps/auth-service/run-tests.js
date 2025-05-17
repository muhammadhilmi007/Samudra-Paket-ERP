/**
 * Test Runner Script
 * Runs tests for the authentication service
 */

const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Run a command and return a promise
 * @param {string} command - Command to run
 * @param {Array} args - Command arguments
 * @param {Object} options - Spawn options
 * @returns {Promise} - Promise that resolves when command completes
 */
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`${colors.bright}${colors.blue}> ${command} ${args.join(' ')}${colors.reset}\n`);
    
    const cmd = spawn(command, args, {
      stdio: 'inherit',
      ...options
    });
    
    cmd.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    cmd.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Main function to run tests
 */
async function runTests() {
  try {
    console.log(`\n${colors.bright}${colors.cyan}=== Running Authentication Service Tests ===${colors.reset}\n`);
    
    // Run API tests
    console.log(`\n${colors.bright}${colors.yellow}Running API Tests...${colors.reset}\n`);
    await runCommand('npx', ['jest', 'tests/api', '--detectOpenHandles', '--forceExit']);
    
    // Run with coverage if --coverage flag is provided
    if (process.argv.includes('--coverage')) {
      console.log(`\n${colors.bright}${colors.yellow}Running Tests with Coverage...${colors.reset}\n`);
      await runCommand('npx', ['jest', '--coverage', '--detectOpenHandles', '--forceExit']);
      
      console.log(`\n${colors.bright}${colors.green}Coverage report generated in coverage/ directory${colors.reset}\n`);
    }
    
    console.log(`\n${colors.bright}${colors.green}All tests completed successfully!${colors.reset}\n`);
  } catch (error) {
    console.error(`\n${colors.bright}${colors.red}Error running tests: ${error.message}${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests();
