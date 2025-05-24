import http from 'k6/http';
import { sleep, check } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';

// Custom metrics
const errorRate = new Rate('error_rate');
const authLatency = new Trend('auth_latency');
const employeeLatency = new Trend('employee_latency');
const branchLatency = new Trend('branch_latency');
const shipmentLatency = new Trend('shipment_latency');

// Load test data
const users = new SharedArray('users', function() {
  return JSON.parse(open('./data/users.json'));
});

// Test configuration
export const options = {
  scenarios: {
    // Common API endpoints under moderate load
    common_apis: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
    // Authentication endpoints under high load
    auth_load: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '20s', target: 50 },
        { duration: '1m', target: 50 },
        { duration: '20s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
    // Spike test for critical endpoints
    spike_test: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 200,
      stages: [
        { duration: '10s', target: 1 },
        { duration: '1m', target: 100 },
        { duration: '10s', target: 1 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    'http_req_duration{name:login}': ['p(95)<300'], // 95% of login requests should be below 300ms
    'http_req_duration{name:get_employees}': ['p(95)<400'],
    'http_req_duration{name:get_branches}': ['p(95)<400'],
    'http_req_duration{name:get_shipments}': ['p(95)<400'],
    error_rate: ['rate<0.1'], // Error rate should be less than 10%
  },
};

// Setup function - runs once at the beginning of the test
export function setup() {
  console.log('Setting up performance test');
  
  // Verify API is accessible
  const res = http.get('http://localhost:3000/api/health');
  check(res, {
    'API is up': (r) => r.status === 200,
  });
  
  return { baseUrl: 'http://localhost:3000/api' };
}

// Main test function
export default function(data) {
  const baseUrl = data.baseUrl;
  const user = users[Math.floor(Math.random() * users.length)];
  
  // Test authentication endpoint
  {
    const startTime = new Date();
    const loginRes = http.post(`${baseUrl}/auth/login`, JSON.stringify({
      email: user.email,
      password: user.password,
    }), {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'login' },
    });
    
    authLatency.add(new Date() - startTime);
    
    const success = check(loginRes, {
      'Login successful': (r) => r.status === 200,
      'Has access token': (r) => r.json('accessToken') !== undefined,
    });
    
    errorRate.add(!success);
    
    if (!success) {
      console.log(`Login failed for user ${user.email}: ${loginRes.status} ${loginRes.body}`);
      sleep(1);
      return;
    }
    
    const accessToken = loginRes.json('accessToken');
    const authHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    
    // Test employee endpoints
    {
      const startTime = new Date();
      const employeesRes = http.get(`${baseUrl}/employees`, {
        headers: authHeaders,
        tags: { name: 'get_employees' },
      });
      
      employeeLatency.add(new Date() - startTime);
      
      check(employeesRes, {
        'Get employees successful': (r) => r.status === 200,
        'Employees data is array': (r) => Array.isArray(r.json()),
      });
      
      // Test single employee endpoint if employees exist
      if (employeesRes.status === 200 && Array.isArray(employeesRes.json()) && employeesRes.json().length > 0) {
        const employee = employeesRes.json()[0];
        
        const employeeRes = http.get(`${baseUrl}/employees/${employee.id}`, {
          headers: authHeaders,
          tags: { name: 'get_employee_by_id' },
        });
        
        check(employeeRes, {
          'Get employee by ID successful': (r) => r.status === 200,
          'Employee data is valid': (r) => r.json('id') === employee.id,
        });
      }
    }
    
    // Test branch endpoints
    {
      const startTime = new Date();
      const branchesRes = http.get(`${baseUrl}/branches`, {
        headers: authHeaders,
        tags: { name: 'get_branches' },
      });
      
      branchLatency.add(new Date() - startTime);
      
      check(branchesRes, {
        'Get branches successful': (r) => r.status === 200,
        'Branches data is array': (r) => Array.isArray(r.json()),
      });
    }
    
    // Test shipment endpoints
    {
      const startTime = new Date();
      const shipmentsRes = http.get(`${baseUrl}/shipments`, {
        headers: authHeaders,
        tags: { name: 'get_shipments' },
      });
      
      shipmentLatency.add(new Date() - startTime);
      
      check(shipmentsRes, {
        'Get shipments successful': (r) => r.status === 200,
        'Shipments data is array': (r) => Array.isArray(r.json()),
      });
    }
  }
  
  sleep(1);
}

// Teardown function - runs once at the end of the test
export function teardown(data) {
  console.log('Performance test completed');
}
