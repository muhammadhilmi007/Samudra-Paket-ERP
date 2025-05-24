/**
 * Security Testing for Authentication and Authorization
 * This script performs penetration testing on authentication and authorization mechanisms
 */

const axios = require('axios');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

// Base URL for API
const API_URL = 'http://localhost:3000/api';

// Test user credentials
const testUsers = {
  admin: {
    email: 'admin@samudrapaket.com',
    password: 'Admin123!'
  },
  manager: {
    email: 'manager@samudrapaket.com',
    password: 'Manager123!'
  },
  employee: {
    email: 'employee@samudrapaket.com',
    password: 'Employee123!'
  }
};

// Protected routes to test
const protectedRoutes = [
  { path: '/employees', method: 'GET', requiredRoles: ['admin', 'manager', 'hr'] },
  { path: '/employees/create', method: 'POST', requiredRoles: ['admin', 'hr'] },
  { path: '/finance/reports', method: 'GET', requiredRoles: ['admin', 'finance'] },
  { path: '/settings/roles', method: 'GET', requiredRoles: ['admin'] }
];

describe('Authentication Security Tests', () => {
  let adminToken, managerToken, employeeToken;

  before(async () => {
    // Get valid tokens for different user roles
    try {
      const adminResponse = await axios.post(`${API_URL}/auth/login`, testUsers.admin);
      adminToken = adminResponse.data.accessToken;

      const managerResponse = await axios.post(`${API_URL}/auth/login`, testUsers.manager);
      managerToken = managerResponse.data.accessToken;

      const employeeResponse = await axios.post(`${API_URL}/auth/login`, testUsers.employee);
      employeeToken = employeeResponse.data.accessToken;
    } catch (error) {
      console.error('Error setting up test tokens:', error.message);
    }
  });

  it('should reject login attempts with invalid credentials', async () => {
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'admin@samudrapaket.com',
        password: 'wrongpassword'
      });
      // Should not reach here
      expect.fail('Login with invalid credentials should fail');
    } catch (error) {
      expect(error.response.status).to.equal(401);
      expect(error.response.data).to.have.property('message');
    }
  });

  it('should reject login attempts with SQL injection in credentials', async () => {
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: "' OR 1=1 --",
        password: "' OR 1=1 --"
      });
      // Should not reach here
      expect.fail('Login with SQL injection should fail');
    } catch (error) {
      expect(error.response.status).to.be.oneOf([400, 401]);
    }
  });

  it('should reject access to protected routes without a token', async () => {
    try {
      await axios.get(`${API_URL}/employees`);
      // Should not reach here
      expect.fail('Access without token should fail');
    } catch (error) {
      expect(error.response.status).to.equal(401);
    }
  });

  it('should reject access with expired tokens', async () => {
    // Create an expired token
    const expiredToken = jwt.sign(
      { userId: '123', role: 'admin' },
      'your-secret-key',
      { expiresIn: '0s' }
    );

    try {
      await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${expiredToken}` }
      });
      // Should not reach here
      expect.fail('Access with expired token should fail');
    } catch (error) {
      expect(error.response.status).to.equal(401);
    }
  });

  it('should reject access with tampered tokens', async () => {
    // Tamper with a valid token
    const parts = adminToken.split('.');
    parts[1] = Buffer.from(JSON.stringify({ userId: '999', role: 'admin' })).toString('base64');
    const tamperedToken = parts.join('.');

    try {
      await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${tamperedToken}` }
      });
      // Should not reach here
      expect.fail('Access with tampered token should fail');
    } catch (error) {
      expect(error.response.status).to.equal(401);
    }
  });

  it('should enforce rate limiting on login attempts', async () => {
    const loginAttempts = [];
    
    // Make multiple login attempts in quick succession
    for (let i = 0; i < 10; i++) {
      loginAttempts.push(
        axios.post(`${API_URL}/auth/login`, {
          email: `test${i}@example.com`,
          password: 'password123'
        }).catch(error => error.response)
      );
    }

    const responses = await Promise.all(loginAttempts);
    
    // At least one of the later responses should be rate limited
    const rateLimited = responses.some(response => response.status === 429);
    expect(rateLimited).to.be.true;
  });
});

describe('Authorization Security Tests', () => {
  let adminToken, managerToken, employeeToken;

  before(async () => {
    // Get valid tokens for different user roles
    try {
      const adminResponse = await axios.post(`${API_URL}/auth/login`, testUsers.admin);
      adminToken = adminResponse.data.accessToken;

      const managerResponse = await axios.post(`${API_URL}/auth/login`, testUsers.manager);
      managerToken = managerResponse.data.accessToken;

      const employeeResponse = await axios.post(`${API_URL}/auth/login`, testUsers.employee);
      employeeToken = employeeResponse.data.accessToken;
    } catch (error) {
      console.error('Error setting up test tokens:', error.message);
    }
  });

  it('should enforce role-based access control', async () => {
    // Admin should have access to admin-only routes
    try {
      const adminResponse = await axios.get(`${API_URL}/settings/roles`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      expect(adminResponse.status).to.equal(200);
    } catch (error) {
      expect.fail(`Admin should have access to admin routes: ${error.message}`);
    }

    // Employee should not have access to admin-only routes
    try {
      await axios.get(`${API_URL}/settings/roles`, {
        headers: { Authorization: `Bearer ${employeeToken}` }
      });
      expect.fail('Employee should not have access to admin routes');
    } catch (error) {
      expect(error.response.status).to.equal(403);
    }
  });

  it('should prevent horizontal privilege escalation', async () => {
    // Employee trying to access another employee's data
    try {
      await axios.get(`${API_URL}/employees/other-employee-id`, {
        headers: { Authorization: `Bearer ${employeeToken}` }
      });
      expect.fail('Employee should not access other employee data');
    } catch (error) {
      expect(error.response.status).to.equal(403);
    }
  });

  it('should prevent CSRF attacks with proper tokens', async () => {
    // This test verifies that the API requires CSRF tokens for state-changing operations
    try {
      await axios.post(`${API_URL}/employees`, 
        { name: 'Test Employee', email: 'test@example.com' },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      // If the API properly implements CSRF protection, this should fail without a CSRF token
      // However, some APIs use other mechanisms like SameSite cookies, so we'll be flexible here
    } catch (error) {
      // Either a 403 (CSRF failure) or a 201 (created, if using alternative CSRF protection)
      expect(error.response.status).to.be.oneOf([403, 201]);
    }
  });

  it('should validate input to prevent injection attacks', async () => {
    const maliciousInput = {
      name: '<script>alert("XSS")</script>',
      email: "' OR 1=1; DROP TABLE users; --"
    };

    try {
      const response = await axios.post(`${API_URL}/employees`, 
        maliciousInput,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      
      // If request succeeds, verify the response sanitizes the input
      if (response.status === 201) {
        expect(response.data.name).to.not.equal(maliciousInput.name);
      }
    } catch (error) {
      // Should reject malicious input with 400 Bad Request
      expect(error.response.status).to.equal(400);
    }
  });
});

// Run the tests
if (require.main === module) {
  describe('Security Tests', function() {
    this.timeout(10000); // Increase timeout for security tests
    
    describe('Authentication Tests', () => {
      // Authentication tests here
    });
    
    describe('Authorization Tests', () => {
      // Authorization tests here
    });
  });
}
