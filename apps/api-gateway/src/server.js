/**
 * API Gateway Server
 * Entry point for the API Gateway service
 */

const express = require('express');
const compression = require('compression');
const dotenv = require('dotenv');

// Import middleware modules
const {
  authenticateJWT,
  cacheMiddleware,
  createCircuitBreakerProxy,
  notFoundHandler,
  errorHandler,
  logger,
  requestTracingMiddleware,
  requestLoggingMiddleware,
  errorLoggingMiddleware,
  validateRequest,
  securityHeadersMiddleware,
  rateLimitMiddleware,
  corsMiddleware
} = require('./api/middlewares');

// Import configuration modules
const {
  configureSwagger,
  configureMonitoring,
  configureMetricsEndpoint
} = require('./config');

// Import routes
const { configureRoutes } = require('./api/routes');
const healthRoutes = require('./api/routes/healthRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Set port
const PORT = process.env.PORT || 3003;

// Request tracing middleware
app.use(requestTracingMiddleware);

// Logging middleware
app.use(requestLoggingMiddleware);

// Configure monitoring
const { metricsMiddleware } = configureMonitoring();
app.use(metricsMiddleware);

// Apply security middleware
app.use(securityHeadersMiddleware); // Security headers
app.use(corsMiddleware); // CORS configuration
app.use(rateLimitMiddleware); // Rate limiting

// Apply common middleware
app.use(compression()); // Compression
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Configure Swagger API documentation
configureSwagger(app, PORT);

// Configure metrics endpoint
configureMetricsEndpoint(app);

// Health check routes
app.use('/health', healthRoutes);

// Configure API routes
configureRoutes(app);

// 404 handler
app.use(notFoundHandler);

// Error logging middleware
app.use(errorLoggingMiddleware);

// Standardized error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});

module.exports = app;
