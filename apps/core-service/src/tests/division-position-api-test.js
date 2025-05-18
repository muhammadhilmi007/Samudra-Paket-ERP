/**
 * Division & Position Management API Test
 * Tests the Division & Position Management API endpoints
 */

require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const { logger } = require('../utils');

// API base URL
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// Test user ID for creating resources
const TEST_USER_ID = '000000000000000000000001';

// Test data
const testDivision = {
  name: 'Test Division',
  code: 'TEST-DIV',
  description: 'Test division for API testing',
  status: 'ACTIVE'
};

const testPosition = {
  name: 'Test Position',
  code: 'TEST-POS',
  description: 'Test position for API testing',
  responsibilities: ['Test responsibility 1', 'Test responsibility 2'],
  status: 'ACTIVE'
};

// Store created resources for cleanup
let createdDivisionId = null;
let createdPositionId = null;

// Mock JWT token for authentication
// In a real scenario, this would be obtained through authentication
const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYxNjE2MTYxNn0.mock-token-for-testing';

// Axios instance with authentication header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${mockJwtToken}`
  }
});

/**
 * Run the tests
 */
const runTests = async () => {
  try {
    logger.info('Starting Division & Position Management API tests...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to MongoDB');
    
    // Test Division API
    await testDivisionAPI();
    
    // Test Position API
    await testPositionAPI();
    
    // Test Organizational Change API
    await testOrganizationalChangeAPI();
    
    // Clean up
    await cleanup();
    
    logger.info('All tests completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Test failed:', error);
    process.exit(1);
  }
};

/**
 * Test Division API
 */
const testDivisionAPI = async () => {
  try {
    logger.info('Testing Division API...');
    
    // Create division
    logger.info('Testing division creation...');
    const createResponse = await api.post('/divisions', testDivision);
    
    if (createResponse.status !== 201 || !createResponse.data.success) {
      throw new Error(`Failed to create division: ${JSON.stringify(createResponse.data)}`);
    }
    
    createdDivisionId = createResponse.data.data._id;
    logger.info(`Division created with ID: ${createdDivisionId}`);
    
    // Get division by ID
    logger.info('Testing get division by ID...');
    const getResponse = await api.get(`/divisions/${createdDivisionId}`);
    
    if (getResponse.status !== 200 || !getResponse.data.success) {
      throw new Error(`Failed to get division: ${JSON.stringify(getResponse.data)}`);
    }
    
    // Update division
    logger.info('Testing division update...');
    const updateResponse = await api.put(`/divisions/${createdDivisionId}`, {
      name: 'Updated Test Division',
      description: 'Updated description'
    });
    
    if (updateResponse.status !== 200 || !updateResponse.data.success) {
      throw new Error(`Failed to update division: ${JSON.stringify(updateResponse.data)}`);
    }
    
    // List divisions
    logger.info('Testing list divisions...');
    const listResponse = await api.get('/divisions');
    
    if (listResponse.status !== 200 || !listResponse.data.success) {
      throw new Error(`Failed to list divisions: ${JSON.stringify(listResponse.data)}`);
    }
    
    // Change division status
    logger.info('Testing change division status...');
    const statusResponse = await api.patch(`/divisions/${createdDivisionId}/status`, {
      status: 'INACTIVE'
    });
    
    if (statusResponse.status !== 200 || !statusResponse.data.success) {
      throw new Error(`Failed to change division status: ${JSON.stringify(statusResponse.data)}`);
    }
    
    // Update division budget
    logger.info('Testing update division budget...');
    const budgetResponse = await api.patch(`/divisions/${createdDivisionId}/budget`, {
      annual: 1000000,
      spent: 0,
      remaining: 1000000,
      fiscalYear: new Date().getFullYear()
    });
    
    if (budgetResponse.status !== 200 || !budgetResponse.data.success) {
      throw new Error(`Failed to update division budget: ${JSON.stringify(budgetResponse.data)}`);
    }
    
    logger.info('Division API tests completed successfully');
  } catch (error) {
    logger.error('Division API test failed:', error);
    throw error;
  }
};

/**
 * Test Position API
 */
const testPositionAPI = async () => {
  try {
    logger.info('Testing Position API...');
    
    // Create position
    logger.info('Testing position creation...');
    const createResponse = await api.post('/positions', {
      ...testPosition,
      division: createdDivisionId
    });
    
    if (createResponse.status !== 201 || !createResponse.data.success) {
      throw new Error(`Failed to create position: ${JSON.stringify(createResponse.data)}`);
    }
    
    createdPositionId = createResponse.data.data._id;
    logger.info(`Position created with ID: ${createdPositionId}`);
    
    // Get position by ID
    logger.info('Testing get position by ID...');
    const getResponse = await api.get(`/positions/${createdPositionId}`);
    
    if (getResponse.status !== 200 || !getResponse.data.success) {
      throw new Error(`Failed to get position: ${JSON.stringify(getResponse.data)}`);
    }
    
    // Update position
    logger.info('Testing position update...');
    const updateResponse = await api.put(`/positions/${createdPositionId}`, {
      name: 'Updated Test Position',
      description: 'Updated description'
    });
    
    if (updateResponse.status !== 200 || !updateResponse.data.success) {
      throw new Error(`Failed to update position: ${JSON.stringify(updateResponse.data)}`);
    }
    
    // List positions
    logger.info('Testing list positions...');
    const listResponse = await api.get('/positions');
    
    if (listResponse.status !== 200 || !listResponse.data.success) {
      throw new Error(`Failed to list positions: ${JSON.stringify(listResponse.data)}`);
    }
    
    // Get positions by division
    logger.info('Testing get positions by division...');
    const divisionPositionsResponse = await api.get(`/positions/division/${createdDivisionId}`);
    
    if (divisionPositionsResponse.status !== 200 || !divisionPositionsResponse.data.success) {
      throw new Error(`Failed to get positions by division: ${JSON.stringify(divisionPositionsResponse.data)}`);
    }
    
    // Change position status
    logger.info('Testing change position status...');
    const statusResponse = await api.patch(`/positions/${createdPositionId}/status`, {
      status: 'INACTIVE'
    });
    
    if (statusResponse.status !== 200 || !statusResponse.data.success) {
      throw new Error(`Failed to change position status: ${JSON.stringify(statusResponse.data)}`);
    }
    
    // Update position requirements
    logger.info('Testing update position requirements...');
    const requirementsResponse = await api.patch(`/positions/${createdPositionId}/requirements`, {
      education: [{
        degree: 'BACHELOR',
        field: 'Computer Science',
        isRequired: true
      }],
      experience: [{
        years: 3,
        description: 'Software development',
        isRequired: true
      }]
    });
    
    if (requirementsResponse.status !== 200 || !requirementsResponse.data.success) {
      throw new Error(`Failed to update position requirements: ${JSON.stringify(requirementsResponse.data)}`);
    }
    
    // Update position compensation
    logger.info('Testing update position compensation...');
    const compensationResponse = await api.patch(`/positions/${createdPositionId}/compensation`, {
      salaryGrade: 'T3',
      salaryRange: {
        min: 10000000,
        max: 15000000,
        currency: 'IDR'
      }
    });
    
    if (compensationResponse.status !== 200 || !compensationResponse.data.success) {
      throw new Error(`Failed to update position compensation: ${JSON.stringify(compensationResponse.data)}`);
    }
    
    // Update position responsibilities
    logger.info('Testing update position responsibilities...');
    const responsibilitiesResponse = await api.patch(`/positions/${createdPositionId}/responsibilities`, [
      'Updated responsibility 1',
      'Updated responsibility 2',
      'New responsibility 3'
    ]);
    
    if (responsibilitiesResponse.status !== 200 || !responsibilitiesResponse.data.success) {
      throw new Error(`Failed to update position responsibilities: ${JSON.stringify(responsibilitiesResponse.data)}`);
    }
    
    logger.info('Position API tests completed successfully');
  } catch (error) {
    logger.error('Position API test failed:', error);
    throw error;
  }
};

/**
 * Test Organizational Change API
 */
const testOrganizationalChangeAPI = async () => {
  try {
    logger.info('Testing Organizational Change API...');
    
    // Get changes for division
    logger.info('Testing get changes for division...');
    const divisionChangesResponse = await api.get(`/organizational-changes/entity/DIVISION/${createdDivisionId}`);
    
    if (divisionChangesResponse.status !== 200 || !divisionChangesResponse.data.success) {
      throw new Error(`Failed to get changes for division: ${JSON.stringify(divisionChangesResponse.data)}`);
    }
    
    // Get changes for position
    logger.info('Testing get changes for position...');
    const positionChangesResponse = await api.get(`/organizational-changes/entity/POSITION/${createdPositionId}`);
    
    if (positionChangesResponse.status !== 200 || !positionChangesResponse.data.success) {
      throw new Error(`Failed to get changes for position: ${JSON.stringify(positionChangesResponse.data)}`);
    }
    
    // Get changes by type
    logger.info('Testing get changes by type...');
    const typeChangesResponse = await api.get('/organizational-changes/type/UPDATE');
    
    if (typeChangesResponse.status !== 200 || !typeChangesResponse.data.success) {
      throw new Error(`Failed to get changes by type: ${JSON.stringify(typeChangesResponse.data)}`);
    }
    
    // Get recent changes
    logger.info('Testing get recent changes...');
    const recentChangesResponse = await api.get('/organizational-changes/recent');
    
    if (recentChangesResponse.status !== 200 || !recentChangesResponse.data.success) {
      throw new Error(`Failed to get recent changes: ${JSON.stringify(recentChangesResponse.data)}`);
    }
    
    logger.info('Organizational Change API tests completed successfully');
  } catch (error) {
    logger.error('Organizational Change API test failed:', error);
    throw error;
  }
};

/**
 * Clean up created resources
 */
const cleanup = async () => {
  try {
    logger.info('Cleaning up created resources...');
    
    // Delete position
    if (createdPositionId) {
      logger.info(`Deleting position with ID: ${createdPositionId}`);
      await api.delete(`/positions/${createdPositionId}`);
    }
    
    // Delete division
    if (createdDivisionId) {
      logger.info(`Deleting division with ID: ${createdDivisionId}`);
      await api.delete(`/divisions/${createdDivisionId}`);
    }
    
    logger.info('Cleanup completed successfully');
  } catch (error) {
    logger.error('Cleanup failed:', error);
    // Don't throw error here to allow the test to complete
  }
};

// Run the tests
runTests();
