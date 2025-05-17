/**
 * Service Area Seeder
 * Seeds initial service area data for development and testing
 */

const mongoose = require('mongoose');
const { ServiceArea, ServiceAreaPricing, BranchServiceArea, ServiceAreaHistory } = require('../../domain/models');
const logger = require('../../utils/logger');

// Sample service area data with more detailed geospatial information
const serviceAreas = [
  {
    code: 'JKT-C',
    name: 'Jakarta Pusat',
    description: 'Wilayah Jakarta Pusat',
    adminCode: '3171',
    adminLevel: 'CITY',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [106.8090, -6.1754],
        [106.8370, -6.1754],
        [106.8370, -6.2054],
        [106.8090, -6.2054],
        [106.8090, -6.1754]
      ]]
    },
    center: {
      type: 'Point',
      coordinates: [106.8230, -6.1904]
    },
    areaType: 'INNER_CITY',
    status: 'ACTIVE',
    createdBy: mongoose.Types.ObjectId('000000000000000000000001')
  },
  {
    code: 'JKT-S',
    name: 'Jakarta Selatan',
    description: 'Wilayah Jakarta Selatan',
    adminCode: '3174',
    adminLevel: 'CITY',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [106.7800, -6.2200],
        [106.8600, -6.2200],
        [106.8600, -6.3000],
        [106.7800, -6.3000],
        [106.7800, -6.2200]
      ]]
    },
    center: {
      type: 'Point',
      coordinates: [106.8200, -6.2600]
    },
    areaType: 'INNER_CITY',
    status: 'ACTIVE',
    createdBy: mongoose.Types.ObjectId('000000000000000000000001')
  },
  {
    code: 'BDG',
    name: 'Bandung',
    description: 'Kota Bandung',
    adminCode: '3273',
    adminLevel: 'CITY',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [107.5700, -6.8800],
        [107.6500, -6.8800],
        [107.6500, -6.9500],
        [107.5700, -6.9500],
        [107.5700, -6.8800]
      ]]
    },
    center: {
      type: 'Point',
      coordinates: [107.6100, -6.9150]
    },
    areaType: 'OUT_OF_CITY',
    status: 'ACTIVE',
    createdBy: mongoose.Types.ObjectId('000000000000000000000001')
  },
  {
    code: 'SBY',
    name: 'Surabaya',
    description: 'Kota Surabaya',
    adminCode: '3578',
    adminLevel: 'CITY',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [112.6000, -7.2300],
        [112.7000, -7.2300],
        [112.7000, -7.3300],
        [112.6000, -7.3300],
        [112.6000, -7.2300]
      ]]
    },
    center: {
      type: 'Point',
      coordinates: [112.6500, -7.2800]
    },
    areaType: 'OUT_OF_CITY',
    status: 'ACTIVE',
    createdBy: mongoose.Types.ObjectId('000000000000000000000001')
  },
  {
    code: 'MLG',
    name: 'Malang',
    description: 'Kota Malang',
    adminCode: '3573',
    adminLevel: 'CITY',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [112.5800, -7.9300],
        [112.6800, -7.9300],
        [112.6800, -8.0300],
        [112.5800, -8.0300],
        [112.5800, -7.9300]
      ]]
    },
    center: {
      type: 'Point',
      coordinates: [112.6300, -7.9800]
    },
    areaType: 'REMOTE_AREA',
    status: 'ACTIVE',
    createdBy: mongoose.Types.ObjectId('000000000000000000000001')
  },
  {
    code: 'DPS',
    name: 'Denpasar',
    description: 'Kota Denpasar, Bali',
    adminCode: '5171',
    adminLevel: 'CITY',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [115.1800, -8.6500],
        [115.2800, -8.6500],
        [115.2800, -8.7500],
        [115.1800, -8.7500],
        [115.1800, -8.6500]
      ]]
    },
    center: {
      type: 'Point',
      coordinates: [115.2300, -8.7000]
    },
    areaType: 'REMOTE_AREA',
    status: 'ACTIVE',
    createdBy: mongoose.Types.ObjectId('000000000000000000000001')
  },
  {
    code: 'MDN',
    name: 'Medan',
    description: 'Kota Medan, Sumatera Utara',
    adminCode: '1271',
    adminLevel: 'CITY',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [98.6000, 3.5300],
        [98.7000, 3.5300],
        [98.7000, 3.6300],
        [98.6000, 3.6300],
        [98.6000, 3.5300]
      ]]
    },
    center: {
      type: 'Point',
      coordinates: [98.6500, 3.5800]
    },
    areaType: 'OUT_OF_CITY',
    status: 'ACTIVE',
    createdBy: mongoose.Types.ObjectId('000000000000000000000001')
  }
];

// Sample pricing data with more comprehensive options
const createPricingData = (serviceAreaId, areaType) => {
  // Base pricing adjusted by area type
  const areaMultiplier = {
    'INNER_CITY': 1.0,
    'OUT_OF_CITY': 1.5,
    'REMOTE_AREA': 2.0
  };
  
  const multiplier = areaMultiplier[areaType] || 1.0;
  
  return [
  {
    serviceArea: serviceAreaId,
    serviceType: 'REGULAR',
    basePrice: 10000,
    pricePerKm: 2000,
    pricePerKg: 1500,
    minCharge: 15000,
    maxCharge: 100000,
    insuranceFee: 0,
    packagingFee: 0,
    status: 'ACTIVE',
    createdBy: mongoose.Types.ObjectId('000000000000000000000001')
  },
  {
    serviceArea: serviceAreaId,
    serviceType: 'EXPRESS',
    basePrice: 20000,
    pricePerKm: 3000,
    pricePerKg: 2000,
    minCharge: 25000,
    maxCharge: 150000,
    insuranceFee: 5000,
    packagingFee: 0,
    status: 'ACTIVE',
    createdBy: mongoose.Types.ObjectId('000000000000000000000001')
  },
  {
    serviceArea: serviceAreaId,
    serviceType: 'SAME_DAY',
    basePrice: Math.round(30000 * multiplier),
    pricePerKm: Math.round(4000 * multiplier),
    pricePerKg: Math.round(2500 * multiplier),
    minCharge: Math.round(35000 * multiplier),
    maxCharge: Math.round(200000 * multiplier),
    insuranceFee: 10000,
    packagingFee: 5000,
    status: 'ACTIVE',
    createdBy: mongoose.Types.ObjectId('000000000000000000000001')
  },
  {
    serviceArea: serviceAreaId,
    serviceType: 'OVERNIGHT',
    basePrice: Math.round(25000 * multiplier),
    pricePerKm: Math.round(3500 * multiplier),
    pricePerKg: Math.round(2200 * multiplier),
    minCharge: Math.round(30000 * multiplier),
    maxCharge: Math.round(180000 * multiplier),
    insuranceFee: 8000,
    packagingFee: 5000,
    status: 'ACTIVE',
    createdBy: mongoose.Types.ObjectId('000000000000000000000001')
  },
  {
    serviceArea: serviceAreaId,
    serviceType: 'ECONOMY',
    basePrice: Math.round(8000 * multiplier),
    pricePerKm: Math.round(1500 * multiplier),
    pricePerKg: Math.round(1200 * multiplier),
    minCharge: Math.round(12000 * multiplier),
    maxCharge: Math.round(80000 * multiplier),
    insuranceFee: 0,
    packagingFee: 0,
    status: 'ACTIVE',
    createdBy: mongoose.Types.ObjectId('000000000000000000000001')
  }
];
};

// Sample branch assignments with more detailed configuration
const createBranchAssignments = (serviceAreaId, branchIds, areaType) => {
  // Different assignment configurations based on area type
  const assignmentConfigs = {
    'INNER_CITY': {
      capacityPercentage: 100,
      isExclusive: false,
      maxDailyCapacity: 500
    },
    'OUT_OF_CITY': {
      capacityPercentage: 80,
      isExclusive: false,
      maxDailyCapacity: 300
    },
    'REMOTE_AREA': {
      capacityPercentage: 50,
      isExclusive: true,
      maxDailyCapacity: 100
    }
  };
  
  const config = assignmentConfigs[areaType] || assignmentConfigs['INNER_CITY'];
  
  return branchIds.map((branchId, index) => ({
    serviceArea: serviceAreaId,
    branch: branchId,
    priorityLevel: index + 1,
    capacityPercentage: config.capacityPercentage,
    isExclusive: config.isExclusive && index === 0, // Only first branch is exclusive for remote areas
    maxDailyCapacity: config.maxDailyCapacity,
    status: 'ACTIVE',
    notes: `Assigned to branch ${branchId} with ${config.capacityPercentage}% capacity allocation`,
    assignedBy: mongoose.Types.ObjectId('000000000000000000000001'),
    assignedAt: new Date()
  }));
};

// Sample service area history entries
const createServiceAreaHistory = (serviceAreaId, action = 'CREATE') => {
  return {
    serviceArea: serviceAreaId,
    changeType: action,
    changedBy: mongoose.Types.ObjectId('000000000000000000000001'),
    changeDetails: `Service area ${action.toLowerCase()}d by system`,
    previousState: action === 'CREATE' ? null : { status: 'DRAFT' },
    newState: { status: 'ACTIVE' },
    timestamp: new Date()
  };
};

/**
 * Seed service areas
 */
const seedServiceAreas = async () => {
  try {
    // Check if service areas already exist
    const count = await ServiceArea.countDocuments();
    if (count > 0) {
      logger.info('Service areas already seeded, skipping...');
      return;
    }

    // Create service areas
    const createdServiceAreas = await ServiceArea.insertMany(serviceAreas);
    logger.info(`Created ${createdServiceAreas.length} service areas`);

    // Create pricing for each service area based on area type
    let pricingCount = 0;
    for (const serviceArea of createdServiceAreas) {
      const pricingData = createPricingData(serviceArea._id, serviceArea.areaType);
      await ServiceAreaPricing.insertMany(pricingData);
      pricingCount += pricingData.length;
    }
    logger.info(`Created ${pricingCount} pricing configurations`);

    // Get branches for assignments
    const Branch = mongoose.model('Branch');
    const branches = await Branch.find({ status: 'ACTIVE' }).limit(5);
    
    if (branches.length > 0) {
      // Create branch assignments
      let assignmentCount = 0;
      for (const serviceArea of createdServiceAreas) {
        // Assign branches based on area type
        let branchesToAssign = [];
        if (serviceArea.areaType === 'INNER_CITY') {
          // Assign all branches to inner city areas
          branchesToAssign = branches.map(b => b._id);
        } else if (serviceArea.areaType === 'OUT_OF_CITY') {
          // Assign first three branches to out of city areas
          branchesToAssign = branches.slice(0, 3).map(b => b._id);
        } else {
          // Assign only first two branches to remote areas
          branchesToAssign = branches.slice(0, 2).map(b => b._id);
        }
        
        const assignments = createBranchAssignments(serviceArea._id, branchesToAssign, serviceArea.areaType);
        await BranchServiceArea.insertMany(assignments);
        assignmentCount += assignments.length;
        
        // Create history entry for each service area
        const historyEntry = createServiceAreaHistory(serviceArea._id, 'CREATE');
        await ServiceAreaHistory.create(historyEntry);
      }
      logger.info(`Created ${assignmentCount} branch service area assignments`);
      logger.info(`Created ${createdServiceAreas.length} service area history entries`);
    } else {
      logger.warn('No branches found for service area assignments');
    }
    
    // Create sample geospatial data for testing
    logger.info('Creating sample geospatial test points...');
    
    // Create test points within service areas for geospatial testing
    const testPoints = [];
    for (const serviceArea of createdServiceAreas) {
      // Create a test point near the center of each service area
      const center = serviceArea.center.coordinates;
      
      // Create a small offset for testing (within the service area)
      const testPoint = {
        serviceArea: serviceArea._id,
        name: `Test Point for ${serviceArea.name}`,
        description: `Geospatial test point within ${serviceArea.name}`,
        location: {
          type: 'Point',
          coordinates: [
            center[0] + (Math.random() * 0.01 - 0.005), // Small random offset
            center[1] + (Math.random() * 0.01 - 0.005)  // Small random offset
          ]
        },
        type: 'TEST_POINT',
        createdBy: mongoose.Types.ObjectId('000000000000000000000001'),
        createdAt: new Date()
      };
      
      testPoints.push(testPoint);
    }
    
    // Store test points in the database if we have a collection for them
    try {
      if (mongoose.connection.collections['geospatialpoints']) {
        const GeospatialPoint = mongoose.model('GeospatialPoint');
        await GeospatialPoint.insertMany(testPoints);
        logger.info(`Created ${testPoints.length} geospatial test points`);
      } else {
        logger.info('Geospatial test points prepared but not stored (collection not available)');
      }
    } catch (error) {
      logger.warn('Could not save geospatial test points:', error.message);
    }

    logger.info('Service area seeding completed successfully');
  } catch (error) {
    logger.error('Error seeding service areas:', error);
    throw error;
  }
};

module.exports = seedServiceAreas;
