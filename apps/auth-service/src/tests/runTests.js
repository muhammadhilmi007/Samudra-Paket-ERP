/**
 * Test Runner Script
 * Runs all tests for the Auth Service
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define test directories
const testDirs = [
  'models',
  'repositories',
  'services',
  'controllers',
  'middlewares',
  'integration'
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m'
  }
};

// Function to count test files in a directory
function countTestFiles(dir) {
  const testDir = path.join(__dirname, dir);
  if (!fs.existsSync(testDir)) return 0;
  
  return fs.readdirSync(testDir)
    .filter(file => file.endsWith('.test.js'))
    .length;
}

// Function to run tests for a specific directory
function runTestsForDirectory(dir) {
  const testDir = path.join(__dirname, dir);
  if (!fs.existsSync(testDir)) {
    console.log(`${colors.fg.yellow}No tests found in ${dir} directory${colors.reset}`);
    return { success: true, testCount: 0 };
  }
  
  const testFiles = fs.readdirSync(testDir)
    .filter(file => file.endsWith('.test.js'));
  
  if (testFiles.length === 0) {
    console.log(`${colors.fg.yellow}No test files found in ${dir} directory${colors.reset}`);
    return { success: true, testCount: 0 };
  }
  
  console.log(`\n${colors.bright}${colors.fg.cyan}Running tests for ${dir}...${colors.reset}`);
  console.log(`${colors.dim}Found ${testFiles.length} test files${colors.reset}`);
  
  try {
    // Run Jest for the specific directory
    execSync(`npx jest ${dir} --colors`, { stdio: 'inherit' });
    console.log(`${colors.fg.green}✓ All tests in ${dir} passed${colors.reset}`);
    return { success: true, testCount: testFiles.length };
  } catch (error) {
    console.log(`${colors.fg.red}✗ Tests in ${dir} failed${colors.reset}`);
    return { success: false, testCount: testFiles.length };
  }
}

// Main function to run all tests
async function runAllTests() {
  console.log(`\n${colors.bright}${colors.fg.magenta}===== Auth Service Test Runner =====${colors.reset}`);
  
  // Count total test files
  const totalTestFiles = testDirs.reduce((total, dir) => total + countTestFiles(dir), 0);
  console.log(`${colors.bright}Total test files: ${totalTestFiles}${colors.reset}\n`);
  
  // Run tests for each directory
  const results = [];
  for (const dir of testDirs) {
    results.push({
      directory: dir,
      ...runTestsForDirectory(dir)
    });
  }
  
  // Print summary
  console.log(`\n${colors.bright}${colors.fg.magenta}===== Test Summary =====${colors.reset}`);
  const successfulTests = results.filter(r => r.success).reduce((total, r) => total + r.testCount, 0);
  const failedTests = results.filter(r => !r.success).reduce((total, r) => total + r.testCount, 0);
  
  console.log(`${colors.bright}Total test files: ${totalTestFiles}${colors.reset}`);
  console.log(`${colors.fg.green}Successful: ${successfulTests}${colors.reset}`);
  console.log(`${colors.fg.red}Failed: ${failedTests}${colors.reset}`);
  
  // Exit with appropriate code
  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Run the tests
runAllTests().catch(error => {
  console.error(`${colors.fg.red}Error running tests: ${error.message}${colors.reset}`);
  process.exit(1);
});
