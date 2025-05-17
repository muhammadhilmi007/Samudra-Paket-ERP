/**
 * Test runner script for the Core Service
 * This script provides a convenient way to run tests with different configurations
 */

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let testType = 'all'; // Default to running all tests
let testPath = '';
let watch = false;
let coverage = false;

// Process arguments
args.forEach(arg => {
  if (arg === '--unit' || arg === '-u') {
    testType = 'unit';
  } else if (arg === '--integration' || arg === '-i') {
    testType = 'integration';
  } else if (arg === '--watch' || arg === '-w') {
    watch = true;
  } else if (arg === '--coverage' || arg === '-c') {
    coverage = true;
  } else if (!arg.startsWith('-')) {
    // Assume it's a specific test path
    testPath = arg;
  }
});

// Build the Jest command
let jestCommand = 'jest';
const jestArgs = [];

// Add test type filter
if (testType === 'unit') {
  jestArgs.push('--testPathPattern=tests/unit');
} else if (testType === 'integration') {
  jestArgs.push('--testPathPattern=tests/integration');
}

// Add specific test path if provided
if (testPath) {
  jestArgs.push(testPath);
}

// Add watch mode if requested
if (watch) {
  jestArgs.push('--watch');
}

// Add coverage if requested
if (coverage) {
  jestArgs.push('--coverage');
}

// Print the command being run
console.log(`Running: ${jestCommand} ${jestArgs.join(' ')}`);

// Run the tests
const testProcess = spawn('npx', [jestCommand, ...jestArgs], {
  stdio: 'inherit',
  shell: true
});

testProcess.on('close', code => {
  process.exit(code);
});
