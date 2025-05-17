/**
 * Configuration Index
 * Exports all configuration modules
 */

const { configureSwagger } = require('./swagger');
const { configureMonitoring, configureMetricsEndpoint } = require('./monitoring');

// Service configuration
const config = {
  server: {
    port: process.env.PORT || 4000,
    env: process.env.NODE_ENV || 'development',
  },
  services: {
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      timeout: 5000
    },
    core: {
      url: process.env.CORE_SERVICE_URL || 'http://localhost:3002',
      timeout: 5000
    },
    operations: {
      url: process.env.OPERATIONS_SERVICE_URL || 'http://localhost:3003',
      timeout: 5000
    },
    finance: {
      url: process.env.FINANCE_SERVICE_URL || 'http://localhost:3004',
      timeout: 5000
    },
    notification: {
      url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
      timeout: 5000
    },
    reporting: {
      url: process.env.REPORTING_SERVICE_URL || 'http://localhost:3006',
      timeout: 5000
    }
  }
};

module.exports = {
  ...config,
  configureSwagger,
  configureMonitoring,
  configureMetricsEndpoint
};
