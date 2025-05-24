/**
 * API Contract Testing with Pactum
 * Ensures API contracts are maintained between services
 */

const pactum = require('pactum');
const { spec, request } = pactum;
const { expect } = require('chai');

// Base URL for API
const API_URL = 'http://localhost:3000/api';

// Setup request defaults
request.setBaseUrl(API_URL);
request.setDefaultTimeout(10000);

// Test user credentials
const testUser = {
  email: 'admin@samudrapaket.com',
  password: 'Admin123!'
};

// Define schema expectations
const authResponseSchema = {
  type: 'object',
  required: ['accessToken', 'refreshToken', 'user'],
  properties: {
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
    user: {
      type: 'object',
      required: ['id', 'email', 'role'],
      properties: {
        id: { type: 'string' },
        email: { type: 'string', format: 'email' },
        role: { type: 'string' }
      }
    }
  }
};

const employeeSchema = {
  type: 'object',
  required: ['id', 'fullName', 'employeeId', 'position', 'email'],
  properties: {
    id: { type: 'string' },
    fullName: { type: 'string' },
    employeeId: { type: 'string' },
    position: { type: 'string' },
    email: { type: 'string', format: 'email' },
    department: { type: 'string' },
    phone: { type: 'string' },
    joinDate: { type: 'string', format: 'date' },
    status: { type: 'string', enum: ['active', 'inactive', 'on_leave'] }
  }
};

const employeeListSchema = {
  type: 'object',
  required: ['data', 'pagination'],
  properties: {
    data: {
      type: 'array',
      items: employeeSchema
    },
    pagination: {
      type: 'object',
      required: ['total', 'page', 'limit', 'pages'],
      properties: {
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        pages: { type: 'number' }
      }
    }
  }
};

const branchSchema = {
  type: 'object',
  required: ['id', 'name', 'code', 'address'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    code: { type: 'string' },
    address: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string', format: 'email' },
    manager: { type: 'string' },
    status: { type: 'string', enum: ['active', 'inactive'] },
    type: { type: 'string', enum: ['headquarters', 'branch', 'warehouse'] },
    coordinates: {
      type: 'object',
      properties: {
        lat: { type: 'number' },
        lng: { type: 'number' }
      }
    }
  }
};

const branchListSchema = {
  type: 'object',
  required: ['data', 'pagination'],
  properties: {
    data: {
      type: 'array',
      items: branchSchema
    },
    pagination: {
      type: 'object',
      required: ['total', 'page', 'limit', 'pages'],
      properties: {
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        pages: { type: 'number' }
      }
    }
  }
};

const shipmentSchema = {
  type: 'object',
  required: ['id', 'trackingNumber', 'sender', 'recipient', 'status'],
  properties: {
    id: { type: 'string' },
    trackingNumber: { type: 'string' },
    sender: {
      type: 'object',
      required: ['name', 'address', 'phone'],
      properties: {
        name: { type: 'string' },
        address: { type: 'string' },
        phone: { type: 'string' }
      }
    },
    recipient: {
      type: 'object',
      required: ['name', 'address', 'phone'],
      properties: {
        name: { type: 'string' },
        address: { type: 'string' },
        phone: { type: 'string' }
      }
    },
    status: { type: 'string' },
    service: { type: 'string' },
    weight: { type: 'number' },
    dimensions: {
      type: 'object',
      properties: {
        length: { type: 'number' },
        width: { type: 'number' },
        height: { type: 'number' }
      }
    },
    price: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

const shipmentListSchema = {
  type: 'object',
  required: ['data', 'pagination'],
  properties: {
    data: {
      type: 'array',
      items: shipmentSchema
    },
    pagination: {
      type: 'object',
      required: ['total', 'page', 'limit', 'pages'],
      properties: {
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        pages: { type: 'number' }
      }
    }
  }
};

describe('API Contract Tests', () => {
  let accessToken;

  before(async () => {
    // Get access token for authenticated requests
    const response = await spec()
      .post('/auth/login')
      .withJson(testUser)
      .expectStatus(200)
      .expectJsonSchema(authResponseSchema)
      .toss();
    
    accessToken = response.body.accessToken;
  });

  describe('Authentication API Contract', () => {
    it('should validate login endpoint contract', async () => {
      await spec()
        .post('/auth/login')
        .withJson(testUser)
        .expectStatus(200)
        .expectJsonSchema(authResponseSchema)
        .toss();
    });

    it('should validate refresh token endpoint contract', async () => {
      const loginResponse = await spec()
        .post('/auth/login')
        .withJson(testUser)
        .expectStatus(200)
        .toss();
      
      const refreshToken = loginResponse.body.refreshToken;
      
      await spec()
        .post('/auth/refresh-token')
        .withJson({ refreshToken })
        .expectStatus(200)
        .expectJsonSchema({
          type: 'object',
          required: ['accessToken'],
          properties: {
            accessToken: { type: 'string' }
          }
        })
        .toss();
    });

    it('should validate logout endpoint contract', async () => {
      await spec()
        .post('/auth/logout')
        .withHeaders('Authorization', `Bearer ${accessToken}`)
        .expectStatus(200)
        .expectJson({
          success: true,
          message: 'Logged out successfully'
        })
        .toss();
    });
  });

  describe('Employee API Contract', () => {
    it('should validate get employees endpoint contract', async () => {
      await spec()
        .get('/employees')
        .withHeaders('Authorization', `Bearer ${accessToken}`)
        .expectStatus(200)
        .expectJsonSchema(employeeListSchema)
        .toss();
    });

    it('should validate get employee by ID endpoint contract', async () => {
      // First get a list of employees
      const employeesResponse = await spec()
        .get('/employees')
        .withHeaders('Authorization', `Bearer ${accessToken}`)
        .expectStatus(200)
        .toss();
      
      // If there are employees, test the get by ID endpoint
      if (employeesResponse.body.data && employeesResponse.body.data.length > 0) {
        const employeeId = employeesResponse.body.data[0].id;
        
        await spec()
          .get(`/employees/${employeeId}`)
          .withHeaders('Authorization', `Bearer ${accessToken}`)
          .expectStatus(200)
          .expectJsonSchema(employeeSchema)
          .toss();
      }
    });

    it('should validate create employee endpoint contract', async () => {
      const newEmployee = {
        fullName: 'Test Employee',
        employeeId: `EMP-${Date.now()}`,
        position: 'Software Tester',
        department: 'QA',
        email: `test.employee.${Date.now()}@example.com`,
        phone: '081234567890',
        joinDate: new Date().toISOString().split('T')[0]
      };
      
      await spec()
        .post('/employees')
        .withHeaders('Authorization', `Bearer ${accessToken}`)
        .withJson(newEmployee)
        .expectStatus(201)
        .expectJsonSchema(employeeSchema)
        .expectJsonMatch({
          fullName: newEmployee.fullName,
          employeeId: newEmployee.employeeId,
          position: newEmployee.position
        })
        .toss();
    });

    it('should validate update employee endpoint contract', async () => {
      // First get a list of employees
      const employeesResponse = await spec()
        .get('/employees')
        .withHeaders('Authorization', `Bearer ${accessToken}`)
        .expectStatus(200)
        .toss();
      
      // If there are employees, test the update endpoint
      if (employeesResponse.body.data && employeesResponse.body.data.length > 0) {
        const employee = employeesResponse.body.data[0];
        const updatedData = {
          fullName: `${employee.fullName} (Updated)`,
          position: employee.position,
          department: employee.department,
          email: employee.email
        };
        
        await spec()
          .put(`/employees/${employee.id}`)
          .withHeaders('Authorization', `Bearer ${accessToken}`)
          .withJson(updatedData)
          .expectStatus(200)
          .expectJsonSchema(employeeSchema)
          .expectJsonMatch({
            id: employee.id,
            fullName: updatedData.fullName
          })
          .toss();
      }
    });
  });

  describe('Branch API Contract', () => {
    it('should validate get branches endpoint contract', async () => {
      await spec()
        .get('/branches')
        .withHeaders('Authorization', `Bearer ${accessToken}`)
        .expectStatus(200)
        .expectJsonSchema(branchListSchema)
        .toss();
    });

    it('should validate get branch by ID endpoint contract', async () => {
      // First get a list of branches
      const branchesResponse = await spec()
        .get('/branches')
        .withHeaders('Authorization', `Bearer ${accessToken}`)
        .expectStatus(200)
        .toss();
      
      // If there are branches, test the get by ID endpoint
      if (branchesResponse.body.data && branchesResponse.body.data.length > 0) {
        const branchId = branchesResponse.body.data[0].id;
        
        await spec()
          .get(`/branches/${branchId}`)
          .withHeaders('Authorization', `Bearer ${accessToken}`)
          .expectStatus(200)
          .expectJsonSchema(branchSchema)
          .toss();
      }
    });
  });

  describe('Shipment API Contract', () => {
    it('should validate get shipments endpoint contract', async () => {
      await spec()
        .get('/shipments')
        .withHeaders('Authorization', `Bearer ${accessToken}`)
        .expectStatus(200)
        .expectJsonSchema(shipmentListSchema)
        .toss();
    });

    it('should validate get shipment by tracking number endpoint contract', async () => {
      // First get a list of shipments
      const shipmentsResponse = await spec()
        .get('/shipments')
        .withHeaders('Authorization', `Bearer ${accessToken}`)
        .expectStatus(200)
        .toss();
      
      // If there are shipments, test the get by tracking number endpoint
      if (shipmentsResponse.body.data && shipmentsResponse.body.data.length > 0) {
        const trackingNumber = shipmentsResponse.body.data[0].trackingNumber;
        
        await spec()
          .get(`/shipments/tracking/${trackingNumber}`)
          .expectStatus(200)
          .expectJsonSchema(shipmentSchema)
          .toss();
      }
    });
  });

  describe('Error Handling Contract', () => {
    it('should validate 404 error response contract', async () => {
      await spec()
        .get('/non-existent-endpoint')
        .expectStatus(404)
        .expectJsonSchema({
          type: 'object',
          required: ['statusCode', 'message'],
          properties: {
            statusCode: { type: 'number', enum: [404] },
            message: { type: 'string' }
          }
        })
        .toss();
    });

    it('should validate 401 unauthorized error response contract', async () => {
      await spec()
        .get('/employees')
        .expectStatus(401)
        .expectJsonSchema({
          type: 'object',
          required: ['statusCode', 'message'],
          properties: {
            statusCode: { type: 'number', enum: [401] },
            message: { type: 'string' }
          }
        })
        .toss();
    });

    it('should validate 400 bad request error response contract', async () => {
      await spec()
        .post('/auth/login')
        .withJson({ email: 'invalid-email', password: '' })
        .expectStatus(400)
        .expectJsonSchema({
          type: 'object',
          required: ['statusCode', 'message', 'errors'],
          properties: {
            statusCode: { type: 'number', enum: [400] },
            message: { type: 'string' },
            errors: { 
              type: 'array',
              items: {
                type: 'object',
                required: ['field', 'message'],
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        })
        .toss();
    });
  });
});
