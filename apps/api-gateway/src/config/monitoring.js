/**
 * Monitoring Configuration
 * Configures Prometheus metrics collection
 */

const promBundle = require('express-prom-bundle');
const client = require('prom-client');

/**
 * Configure Prometheus monitoring middleware
 * @returns {Function} Express middleware function
 */
const configureMonitoring = () => {
  // Create metrics middleware
  const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    customLabels: { project_name: 'api-gateway' },
    promClient: {
      collectDefaultMetrics: {
        timeout: 5000
      }
    }
  });

  // Add custom metrics
  const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [1, 5, 15, 50, 100, 200, 500, 1000, 2000, 5000]
  });

  const httpRequestSizeBytes = new client.Histogram({
    name: 'http_request_size_bytes',
    help: 'Size of HTTP requests in bytes',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [100, 500, 1000, 5000, 10000, 50000, 100000]
  });

  const httpResponseSizeBytes = new client.Histogram({
    name: 'http_response_size_bytes',
    help: 'Size of HTTP responses in bytes',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [100, 500, 1000, 5000, 10000, 50000, 100000]
  });

  return {
    metricsMiddleware,
    metrics: {
      httpRequestDurationMicroseconds,
      httpRequestSizeBytes,
      httpResponseSizeBytes
    }
  };
};

/**
 * Configure metrics endpoint
 * @param {Object} app - Express application instance
 */
const configureMetricsEndpoint = (app) => {
  app.get('/metrics', (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(client.register.metrics());
  });
};

module.exports = {
  configureMonitoring,
  configureMetricsEndpoint
};
