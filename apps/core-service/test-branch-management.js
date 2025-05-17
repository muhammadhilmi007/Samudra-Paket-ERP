/**
 * Branch Management Service Test Runner
 * 
 * This script runs all tests for the Branch Management Service
 * It provides a convenient way to run specific test suites or all tests
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Parse command line arguments
const args = process.argv.slice(2);
let testType = 'all'; // Default to running all tests
let specificTest = '';
let watch = false;
let coverage = false;
let verbose = false;

// Process arguments
args.forEach(arg => {
  if (arg === '--unit' || arg === '-u') {
    testType = 'unit';
  } else if (arg === '--integration' || arg === '-i') {
    testType = 'integration';
  } else if (arg === '--branch-model' || arg === '-bm') {
    specificTest = 'branch';
  } else if (arg === '--repository' || arg === '-r') {
    specificTest = 'repository';
  } else if (arg === '--use-cases' || arg === '-uc') {
    specificTest = 'use-cases';
  } else if (arg === '--watch' || arg === '-w') {
    watch = true;
  } else if (arg === '--coverage' || arg === '-c') {
    coverage = true;
  } else if (arg === '--verbose' || arg === '-v') {
    verbose = true;
  } else if (arg === '--help' || arg === '-h') {
    showHelp();
    process.exit(0);
  }
});

// Show help information
function showHelp() {
  console.log(`${colors.bright}${colors.cyan}Branch Management Service Test Runner${colors.reset}`);
  console.log('\nUsage: node test-branch-management.js [options]');
  console.log('\nOptions:');
  console.log('  --unit, -u             Run only unit tests');
  console.log('  --integration, -i      Run only integration tests');
  console.log('  --branch-model, -bm    Run only branch model tests');
  console.log('  --repository, -r       Run only repository tests');
  console.log('  --use-cases, -uc       Run only use case tests');
  console.log('  --watch, -w            Run tests in watch mode');
  console.log('  --coverage, -c         Generate code coverage report');
  console.log('  --verbose, -v          Show verbose output');
  console.log('  --help, -h             Show this help information');
  console.log('\nExamples:');
  console.log('  node test-branch-management.js                  Run all tests');
  console.log('  node test-branch-management.js -u -c            Run unit tests with coverage');
  console.log('  node test-branch-management.js -i -v            Run integration tests with verbose output');
  console.log('  node test-branch-management.js -uc -w           Run use case tests in watch mode');
}

// Build the Jest command
const jestArgs = [];

// Add test type filter
if (testType === 'unit') {
  jestArgs.push('--testPathPattern=tests/unit');
} else if (testType === 'integration') {
  jestArgs.push('--testPathPattern=tests/integration');
}

// Add specific test filter
if (specificTest === 'branch') {
  jestArgs.push('--testPathPattern=domain/models/Branch');
} else if (specificTest === 'repository') {
  jestArgs.push('--testPathPattern=infrastructure/repositories/branchRepository');
} else if (specificTest === 'use-cases') {
  jestArgs.push('--testPathPattern=application/use-cases/branch');
}

// Add watch mode if requested
if (watch) {
  jestArgs.push('--watch');
}

// Add coverage if requested
if (coverage) {
  jestArgs.push('--coverage');
}

// Add verbose output if requested
if (verbose) {
  jestArgs.push('--verbose');
}

// Print a header
console.log(`${colors.bright}${colors.cyan}Running Branch Management Service Tests${colors.reset}`);
console.log(`${colors.dim}Test Type: ${testType}${colors.reset}`);
if (specificTest) {
  console.log(`${colors.dim}Specific Tests: ${specificTest}${colors.reset}`);
}
console.log(`${colors.dim}Watch Mode: ${watch ? 'Yes' : 'No'}${colors.reset}`);
console.log(`${colors.dim}Coverage: ${coverage ? 'Yes' : 'No'}${colors.reset}`);
console.log(`${colors.dim}Verbose: ${verbose ? 'Yes' : 'No'}${colors.reset}`);
console.log('\n');

// Print the command being run
console.log(`${colors.yellow}Running: npx jest ${jestArgs.join(' ')}${colors.reset}`);
console.log('\n');

// Run the tests
const testProcess = spawn('npx', ['jest', ...jestArgs], {
  stdio: 'inherit',
  shell: true
});

testProcess.on('close', code => {
  if (code === 0) {
    console.log(`\n${colors.green}${colors.bright}All tests passed successfully!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}${colors.bright}Tests failed with exit code ${code}${colors.reset}`);
  }
  process.exit(code);
});
