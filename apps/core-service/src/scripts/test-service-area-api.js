/**
 * Service Area API Test Script
 * 
 * This script tests the Service Area Management API endpoints
 * Run with: node src/scripts/test-service-area-api.js
 */

require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const { logger } = require('../utils');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const MONGODB_URI = process.env.MONGODB_URI;

// Test data
const testServiceArea = {
  code: 'TEST-API',
  name: 'API Test Area',
  description: 'Service area for API testing',
  adminCode: '9999',
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
  status: 'ACTIVE'
};

// Test JWT token (for development only)
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDEiLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
  }
});

// Test functions
async function testCreateServiceArea() {
  try {
    logger.info('Testing create service area endpoint...');
    const response = await api.post('/service-areas', testServiceArea);
    
    if (response.status === 201 && response.data.success) {
      logger.info('✅ Create service area test passed');
      return response.data.data;
    } else {
      logger.error('❌ Create service area test failed', response.data);
      return null;
    }
  } catch (error) {
    logger.error('❌ Create service area test failed', error.response?.data || error.message);
    return null;
  }
}

async function testGetServiceAreas() {
  try {
    logger.info('Testing get service areas endpoint...');
    const response = await api.get('/service-areas');
    
    if (response.status === 200 && response.data.success) {
      logger.info(`✅ Get service areas test passed - Found ${response.data.data.length} areas`);
      return response.data.data;
    } else {
      logger.error('❌ Get service areas test failed', response.data);
      return [];
    }
  } catch (error) {
    logger.error('❌ Get service areas test failed', error.response?.data || error.message);
    return [];
  }
}

async function testGetServiceAreaById(id) {
  try {
    logger.info(`Testing get service area by ID endpoint for ID: ${id}...`);
    const response = await api.get(`/service-areas/${id}`);
    
    if (response.status === 200 && response.data.success) {
      logger.info('✅ Get service area by ID test passed');
      return response.data.data;
    } else {
      logger.error('❌ Get service area by ID test failed', response.data);
      return null;
    }
  } catch (error) {
    logger.error('❌ Get service area by ID test failed', error.response?.data || error.message);
    return null;
  }
}

async function testUpdateServiceArea(id) {
  try {
    const updateData = {
      name: 'Updated API Test Area',
      description: 'Updated description for API testing',
      status: 'INACTIVE'
    };
    
    logger.info(`Testing update service area endpoint for ID: ${id}...`);
    const response = await api.put(`/service-areas/${id}`, updateData);
    
    if (response.status === 200 && response.data.success) {
      logger.info('✅ Update service area test passed');
      return response.data.data;
    } else {
      logger.error('❌ Update service area test failed', response.data);
      return null;
    }
  } catch (error) {
    logger.error('❌ Update service area test failed', error.response?.data || error.message);
    return null;
  }
}

async function testFindServiceAreasByLocation() {
  try {
    const locationData = {
      latitude: -6.19,
      longitude: 106.82
    };
    
    logger.info('Testing find service areas by location endpoint...');
    const response = await api.post('/geospatial/find-service-areas', locationData);
    
    if (response.status === 200 && response.data.success) {
      logger.info(`✅ Find service areas by location test passed - Found ${response.data.data.length} areas`);
      return response.data.data;
    } else {
      logger.error('❌ Find service areas by location test failed', response.data);
      return [];
    }
  } catch (error) {
    logger.error('❌ Find service areas by location test failed', error.response?.data || error.message);
    return [];
  }
}

async function testCalculateShippingPrice(serviceAreaId) {
  try {
    const calculationData = {
      serviceAreaId,
      serviceType: 'REGULAR',
      distance: 5,
      weight: 2,
      additionalServices: []
    };
    
    logger.info(`Testing calculate shipping price endpoint for service area ID: ${serviceAreaId}...`);
    const response = await api.post('/geospatial/calculate-price', calculationData);
    
    if (response.status === 200 && response.data.success) {
      logger.info(`✅ Calculate shipping price test passed - Price: ${response.data.data.totalPrice}`);
      return response.data.data;
    } else {
      logger.error('❌ Calculate shipping price test failed', response.data);
      return null;
    }
  } catch (error) {
    logger.error('❌ Calculate shipping price test failed', error.response?.data || error.message);
    return null;
  }
}

async function testDeleteServiceArea(id) {
  try {
    logger.info(`Testing delete service area endpoint for ID: ${id}...`);
    const response = await api.delete(`/service-areas/${id}`);
    
    if (response.status === 200 && response.data.success) {
      logger.info('✅ Delete service area test passed');
      return true;
    } else {
      logger.error('❌ Delete service area test failed', response.data);
      return false;
    }
  } catch (error) {
    logger.error('❌ Delete service area test failed', error.response?.data || error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  try {
    // Connect to MongoDB to clean up test data if needed
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    logger.info('Connected to MongoDB');
    
    // Clean up any previous test data
    const ServiceArea = mongoose.model('ServiceArea');
    await ServiceArea.deleteOne({ code: testServiceArea.code });
    
    logger.info('Cleaned up previous test data');
    
    // Run tests
    logger.info('Starting API tests for Service Area Management...');
    
    // Create a service area
    const createdArea = await testCreateServiceArea();
    if (!createdArea) {
      logger.error('Cannot continue tests without a created service area');
      return;
    }
    
    // Get all service areas
    await testGetServiceAreas();
    
    // Get service area by ID
    await testGetServiceAreaById(createdArea._id);
    
    // Update service area
    const updatedArea = await testUpdateServiceArea(createdArea._id);
    
    // Find service areas by location
    await testFindServiceAreasByLocation();
    
    // Calculate shipping price
    if (updatedArea) {
      await testCalculateShippingPrice(updatedArea._id);
    }
    
    // Delete service area
    await testDeleteServiceArea(createdArea._id);
    
    logger.info('API tests completed');
    
    // Disconnect from MongoDB
    await mongoose.connection.close();
    logger.info('Disconnected from MongoDB');
    
  } catch (error) {
    logger.error('Error running tests:', error);
  }
}

// Run the tests
runTests();
