/**
 * Seeders Index
 * Export all seeders for easy importing
 */

const { seedServiceAreas } = require('./serviceAreaSeeder');
const { seedBranches } = require('./branchSeeder');
const { seedDivisionsAndPositions } = require('./divisionAndPositionSeeder');
const { seedEmployees } = require('./employeeSeeder');

/**
 * Run all seeders
 * @param {string} userId - The ID of the user creating the seed data
 */
const runAllSeeders = async (userId) => {
  try {
    // Seed service areas
    await seedServiceAreas(userId);
    
    // Seed branches
    await seedBranches(userId);
    
    // Seed divisions and positions
    await seedDivisionsAndPositions(userId);
    
    // Seed employees
    await seedEmployees(userId);
    
    console.log('All seeders completed successfully');
  } catch (error) {
    console.error('Error running seeders:', error);
    throw error;
  }
};

module.exports = {
  seedServiceAreas,
  seedBranches,
  seedDivisionsAndPositions,
  seedEmployees,
  runAllSeeders
};
