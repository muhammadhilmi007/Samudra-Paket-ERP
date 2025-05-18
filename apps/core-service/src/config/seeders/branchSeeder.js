/**
 * Branch Seeder
 * Seeds initial branch data
 */

const { Branch } = require('../../domain/models');
const { logger } = require('../../utils');
const mongoose = require('mongoose');

/**
 * Seed branches
 * @param {string} userId - User ID for tracking who created the seed data
 */
const seedBranches = async (userId) => {
  try {
    logger.info('Starting branch seeder...');
    
    // Check if branches already exist
    const branchCount = await Branch.countDocuments();
    if (branchCount > 0) {
      logger.info(`Skipping branch seeder, ${branchCount} branches already exist`);
      return;
    }
    
    // Create sample branches
    const branches = [
      // Head Office
      {
        name: 'Head Office',
        code: 'HO',
        type: 'HEAD_OFFICE',
        level: 0,
        path: 'HO',
        address: {
          street: 'Jl. Gatot Subroto No. 123',
          city: 'Jakarta',
          district: 'Jakarta Selatan',
          province: 'DKI Jakarta',
          postalCode: '12930',
          country: 'Indonesia'
        },
        contactInfo: {
          phone: '021-5551234',
          email: 'info@samudrapaket.id',
          website: 'www.samudrapaket.id'
        },
        operationalHours: [
          { day: 'MONDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'TUESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'WEDNESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'THURSDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'FRIDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'SATURDAY', isOpen: true, openTime: '09:00', closeTime: '15:00' },
          { day: 'SUNDAY', isOpen: false, openTime: '00:00', closeTime: '00:00' }
        ],
        status: 'ACTIVE',
        facilities: ['PARKING', 'WAREHOUSE', 'CUSTOMER_SERVICE', 'SORTING_CENTER'],
        createdBy: mongoose.Types.ObjectId(userId)
      },
      
      // Jakarta Regional Office
      {
        name: 'Jakarta Regional Office',
        code: 'JKT',
        type: 'REGIONAL',
        level: 1,
        path: 'HO/JKT',
        parent: null, // Will be set after creation
        address: {
          street: 'Jl. Sudirman No. 45',
          city: 'Jakarta',
          district: 'Jakarta Pusat',
          province: 'DKI Jakarta',
          postalCode: '10220',
          country: 'Indonesia'
        },
        contactInfo: {
          phone: '021-5552345',
          email: 'jakarta@samudrapaket.id'
        },
        operationalHours: [
          { day: 'MONDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'TUESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'WEDNESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'THURSDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'FRIDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'SATURDAY', isOpen: true, openTime: '09:00', closeTime: '15:00' },
          { day: 'SUNDAY', isOpen: false, openTime: '00:00', closeTime: '00:00' }
        ],
        status: 'ACTIVE',
        facilities: ['PARKING', 'WAREHOUSE', 'CUSTOMER_SERVICE'],
        createdBy: mongoose.Types.ObjectId(userId)
      },
      
      // Bandung Branch
      {
        name: 'Bandung Branch',
        code: 'BDG',
        type: 'BRANCH',
        level: 2,
        path: 'HO/JKT/BDG',
        parent: null, // Will be set after creation
        address: {
          street: 'Jl. Asia Afrika No. 67',
          city: 'Bandung',
          district: 'Bandung Wetan',
          province: 'Jawa Barat',
          postalCode: '40112',
          country: 'Indonesia'
        },
        contactInfo: {
          phone: '022-4231234',
          email: 'bandung@samudrapaket.id'
        },
        operationalHours: [
          { day: 'MONDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'TUESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'WEDNESDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'THURSDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'FRIDAY', isOpen: true, openTime: '08:00', closeTime: '17:00' },
          { day: 'SATURDAY', isOpen: true, openTime: '09:00', closeTime: '14:00' },
          { day: 'SUNDAY', isOpen: false, openTime: '00:00', closeTime: '00:00' }
        ],
        status: 'ACTIVE',
        facilities: ['PARKING', 'WAREHOUSE', 'CUSTOMER_SERVICE'],
        createdBy: mongoose.Types.ObjectId(userId)
      }
    ];
    
    // Save branches
    const savedBranches = [];
    for (const branch of branches) {
      const newBranch = new Branch(branch);
      const savedBranch = await newBranch.save();
      savedBranches.push(savedBranch);
    }
    
    // Update parent references
    const headOffice = savedBranches.find(b => b.code === 'HO');
    const jakartaRegional = savedBranches.find(b => b.code === 'JKT');
    
    // Set Jakarta Regional parent to Head Office
    jakartaRegional.parent = headOffice._id;
    await jakartaRegional.save();
    
    // Set Bandung Branch parent to Jakarta Regional
    const bandungBranch = savedBranches.find(b => b.code === 'BDG');
    bandungBranch.parent = jakartaRegional._id;
    await bandungBranch.save();
    
    logger.info(`Successfully seeded ${savedBranches.length} branches`);
  } catch (error) {
    logger.error('Error seeding branches:', error);
    throw error;
  }
};

module.exports = {
  seedBranches
};
