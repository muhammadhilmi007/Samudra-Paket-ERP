/**
 * Configuration Index
 * Exports all configuration modules
 */

const { configureSwagger } = require('./swagger');
const { configureMonitoring, configureMetricsEndpoint } = require('./monitoring');

module.exports = {
  configureSwagger,
  configureMonitoring,
  configureMetricsEndpoint
};
