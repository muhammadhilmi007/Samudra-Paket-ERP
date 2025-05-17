/**
 * Service Area Tests
 * Basic unit tests for service area models
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { ServiceArea } = require('../domain/models');

// Mock MongoDB connection
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/samudra-test';
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Clean up after tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Clear data before each test
beforeEach(async () => {
  await ServiceArea.deleteMany({});
});

describe('Service Area Model', () => {
  test('should create a new service area', async () => {
    const serviceAreaData = {
      code: 'TEST-01',
      name: 'Test Area',
      description: 'Test service area',
      adminCode: '1234',
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
      createdBy: mongoose.Types.ObjectId()
    };

    const serviceArea = new ServiceArea(serviceAreaData);
    const savedServiceArea = await serviceArea.save();

    expect(savedServiceArea._id).toBeDefined();
    expect(savedServiceArea.code).toBe(serviceAreaData.code);
    expect(savedServiceArea.name).toBe(serviceAreaData.name);
    expect(savedServiceArea.geometry.type).toBe('Polygon');
    expect(savedServiceArea.status).toBe('ACTIVE');
  });

  test('should validate required fields', async () => {
    const invalidServiceArea = new ServiceArea({
      name: 'Invalid Area',
      // Missing required fields
    });

    await expect(invalidServiceArea.save()).rejects.toThrow();
  });
  
  test('should validate unique code', async () => {
    // Create first service area
    const serviceAreaData1 = {
      code: 'UNIQUE-TEST',
      name: 'First Area',
      description: 'First test area',
      adminCode: '1234',
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
      createdBy: mongoose.Types.ObjectId()
    };
    
    await new ServiceArea(serviceAreaData1).save();
    
    // Try to create second service area with same code
    const serviceAreaData2 = {
      ...serviceAreaData1,
      name: 'Second Area',
      description: 'Second test area'
    };
    
    const duplicateServiceArea = new ServiceArea(serviceAreaData2);
    await expect(duplicateServiceArea.save()).rejects.toThrow();
  });
});






