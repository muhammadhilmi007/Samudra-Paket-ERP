/**
 * Core Service
 * Entry point for the Core Service
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { logger } = require('./utils');
const connectDB = require('./config/database');
const setupSwagger = require('./api/swagger');
const routes = require('./api/routes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: logger.stream }));

// Setup Swagger documentation
setupSwagger(app);

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Core service is running',
    timestamp: new Date().toISOString(),
    service: 'core-service'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, { error: err });
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  logger.info(`Core service running on port ${PORT}`);
});

module.exports = app;
