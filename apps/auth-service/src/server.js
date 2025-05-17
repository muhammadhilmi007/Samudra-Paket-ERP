/**
 * Auth Service
 * Entry point for the Authentication Service
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Import Swagger configuration
const { configureSwagger } = require('./config/swagger');

// Import middlewares
const { 
  requestTracing, 
  apiRateLimiter, 
  notFoundHandler, 
  errorHandler 
} = require('./api/middlewares');

// Import database connections
const { connectToMongoDB } = require('./infrastructure/database/connection');
const { connectToRedis } = require('./infrastructure/database/redis');

// Import routes
const setupRoutes = require('./api/routes');

// Load environment variables
dotenv.config();
const config = require('./config');

// Create Express app
const app = express();
const PORT = process.env.PORT || config.server.port;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined')); // HTTP request logging
app.use(requestTracing); // Request tracing
app.use(apiRateLimiter); // API rate limiting

// Configure Swagger documentation
configureSwagger(app, PORT);

// Setup API routes
setupRoutes(app);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    status: 'ok',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    redis: global.redisClient ? 'connected' : 'disconnected'
  });
});

// Not found handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

// Connect to databases and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Connect to Redis
    await connectToRedis();
    
    // Run database seeders if in development mode
    if (process.env.NODE_ENV === 'development') {
      const { runSeeders } = require('./infrastructure/database/seeders');
      await runSeeders();
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Auth Service running on port ${PORT}`);
      console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
