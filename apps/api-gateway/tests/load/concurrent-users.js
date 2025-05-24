/**
 * Load Testing for Concurrent User Scenarios
 * Tests system performance under various concurrent user loads
 */

import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { SharedArray } from 'k6/data';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
const successfulLogins = new Counter('successful_logins');
const failedRequests = new Rate('failed_requests');
const dashboardLoadTime = new Trend('dashboard_load_time');
const shipmentListLoadTime = new Trend('shipment_list_load_time');
const employeeListLoadTime = new Trend('employee_list_load_time');

// Load test data
const users = new SharedArray('users', function() {
  return JSON.parse(open('./data/users.json'));
});

// Test configuration for different concurrency scenarios
export const options = {
  scenarios: {
    // Low concurrency (normal usage)
    low_concurrency: {
      executor: 'constant-vus',
      vus: 10,
      duration: '1m',
      tags: { scenario: 'low_concurrency' },
    },
    
    // Medium concurrency (busy periods)
    medium_concurrency: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '30s', target: 50 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 10 },
      ],
      tags: { scenario: 'medium_concurrency' },
    },
    
    // High concurrency (peak load)
    high_concurrency: {
      executor: 'ramping-vus',
      startVUs: 50,
      stages: [
        { duration: '30s', target: 100 },
        { duration: '1m', target: 100 },
        { duration: '30s', target: 50 },
      ],
      tags: { scenario: 'high_concurrency' },
    },
    
    // Extreme concurrency (stress test)
    extreme_concurrency: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 200,
      maxVUs: 300,
      stages: [
        { duration: '30s', target: 50 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 10 },
      ],
      tags: { scenario: 'extreme_concurrency' },
    },
  },
  thresholds: {
    // Response time thresholds
    'http_req_duration': ['p(95)<1000'], // 95% of requests should be below 1s
    'http_req_duration{scenario:low_concurrency}': ['p(95)<500'], // 95% of requests in low concurrency should be below 500ms
    'http_req_duration{scenario:medium_concurrency}': ['p(95)<750'], // 95% of requests in medium concurrency should be below 750ms
    'http_req_duration{scenario:high_concurrency}': ['p(95)<1000'], // 95% of requests in high concurrency should be below 1s
    'http_req_duration{scenario:extreme_concurrency}': ['p(95)<2000'], // 95% of requests in extreme concurrency should be below 2s
    
    // Error rate thresholds
    'failed_requests': ['rate<0.1'], // Error rate should be less than 10%
    'failed_requests{scenario:low_concurrency}': ['rate<0.01'], // Error rate in low concurrency should be less than 1%
    'failed_requests{scenario:medium_concurrency}': ['rate<0.05'], // Error rate in medium concurrency should be less than 5%
    'failed_requests{scenario:high_concurrency}': ['rate<0.1'], // Error rate in high concurrency should be less than 10%
    'failed_requests{scenario:extreme_concurrency}': ['rate<0.2'], // Error rate in extreme concurrency should be less than 20%
    
    // Custom metric thresholds
    'dashboard_load_time': ['p(95)<1000'], // Dashboard should load in less than 1s for 95% of requests
    'shipment_list_load_time': ['p(95)<1500'], // Shipment list should load in less than 1.5s for 95% of requests
    'employee_list_load_time': ['p(95)<1500'], // Employee list should load in less than 1.5s for 95% of requests
  },
};

// Setup function - runs once at the beginning of the test
export function setup() {
  console.log('Setting up load test for concurrent user scenarios');
  
  // Verify API is accessible
  const res = http.get('http://localhost:3000/api/health');
  check(res, {
    'API is up': (r) => r.status === 200,
  });
  
  return { baseUrl: 'http://localhost:3000/api' };
}

// Main test function - simulates a user session
export default function(data) {
  const baseUrl = data.baseUrl;
  const user = users[Math.floor(Math.random() * users.length)];
  let accessToken;
  
  group('User Authentication', () => {
    // Login
    const loginRes = http.post(`${baseUrl}/auth/login`, JSON.stringify({
      email: user.email,
      password: user.password,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    const loginSuccess = check(loginRes, {
      'Login successful': (r) => r.status === 200,
      'Has access token': (r) => r.json('accessToken') !== undefined,
    });
    
    if (loginSuccess) {
      successfulLogins.add(1);
      accessToken = loginRes.json('accessToken');
    } else {
      failedRequests.add(1);
      console.log(`Login failed for user ${user.email}: ${loginRes.status} ${loginRes.body}`);
      return;
    }
  });
  
  // If login failed, skip the rest of the test
  if (!accessToken) {
    sleep(1);
    return;
  }
  
  const authHeaders = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  
  // Random sleep between 1-3 seconds to simulate user thinking
  sleep(Math.random() * 2 + 1);
  
  group('Dashboard Access', () => {
    const startTime = new Date();
    const dashboardRes = http.get(`${baseUrl}/dashboard`, {
      headers: authHeaders,
    });
    
    const dashboardSuccess = check(dashboardRes, {
      'Dashboard loaded successfully': (r) => r.status === 200,
      'Dashboard contains data': (r) => r.json('data') !== undefined,
    });
    
    if (!dashboardSuccess) {
      failedRequests.add(1);
    }
    
    dashboardLoadTime.add(new Date() - startTime);
  });
  
  // Random sleep between 1-3 seconds to simulate user thinking
  sleep(Math.random() * 2 + 1);
  
  // Randomly choose between accessing shipments or employees
  if (Math.random() > 0.5) {
    group('Shipment List Access', () => {
      const startTime = new Date();
      const shipmentsRes = http.get(`${baseUrl}/shipments?page=1&limit=20`, {
        headers: authHeaders,
      });
      
      const shipmentsSuccess = check(shipmentsRes, {
        'Shipment list loaded successfully': (r) => r.status === 200,
        'Shipment list contains items': (r) => Array.isArray(r.json('data')),
      });
      
      if (!shipmentsSuccess) {
        failedRequests.add(1);
      }
      
      shipmentListLoadTime.add(new Date() - startTime);
      
      // If shipments were loaded successfully, view a random shipment detail
      if (shipmentsSuccess && Array.isArray(shipmentsRes.json('data')) && shipmentsRes.json('data').length > 0) {
        const shipments = shipmentsRes.json('data');
        const randomShipment = shipments[Math.floor(Math.random() * shipments.length)];
        
        // Random sleep between 1-2 seconds
        sleep(Math.random() + 1);
        
        const shipmentDetailRes = http.get(`${baseUrl}/shipments/${randomShipment.id}`, {
          headers: authHeaders,
        });
        
        check(shipmentDetailRes, {
          'Shipment detail loaded successfully': (r) => r.status === 200,
          'Shipment detail contains correct ID': (r) => r.json('id') === randomShipment.id,
        });
      }
    });
  } else {
    group('Employee List Access', () => {
      const startTime = new Date();
      const employeesRes = http.get(`${baseUrl}/employees?page=1&limit=20`, {
        headers: authHeaders,
      });
      
      const employeesSuccess = check(employeesRes, {
        'Employee list loaded successfully': (r) => r.status === 200,
        'Employee list contains items': (r) => Array.isArray(r.json('data')),
      });
      
      if (!employeesSuccess) {
        failedRequests.add(1);
      }
      
      employeeListLoadTime.add(new Date() - startTime);
      
      // If employees were loaded successfully, view a random employee detail
      if (employeesSuccess && Array.isArray(employeesRes.json('data')) && employeesRes.json('data').length > 0) {
        const employees = employeesRes.json('data');
        const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
        
        // Random sleep between 1-2 seconds
        sleep(Math.random() + 1);
        
        const employeeDetailRes = http.get(`${baseUrl}/employees/${randomEmployee.id}`, {
          headers: authHeaders,
        });
        
        check(employeeDetailRes, {
          'Employee detail loaded successfully': (r) => r.status === 200,
          'Employee detail contains correct ID': (r) => r.json('id') === randomEmployee.id,
        });
      }
    });
  }
  
  // Random sleep between 1-3 seconds to simulate user thinking
  sleep(Math.random() * 2 + 1);
  
  // Logout
  http.post(`${baseUrl}/auth/logout`, {}, {
    headers: authHeaders,
  });
}

// Teardown function - runs once at the end of the test
export function teardown(data) {
  console.log('Load test for concurrent user scenarios completed');
}
