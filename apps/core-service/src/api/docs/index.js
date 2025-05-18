/**
 * API Documentation Configuration
 * Swagger configuration for Core Service API
 */

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import Swagger documentation files
require('./attendance-swagger');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Samudra Paket ERP - Core Service API',
      version: '1.0.0',
      description: 'Core Service API Documentation for Samudra Paket ERP',
      contact: {
        name: 'PT. Sarana Mudah Raya',
        email: 'support@saranamudahraya.com'
      },
      license: {
        name: 'Proprietary',
        url: 'https://saranamudahraya.com'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'Core Service API'
      }
    ]
  },
  // Path to API docs with JSDoc annotations
  apis: [
    'src/api/routes/*.js',
    'src/api/docs/*.js'
  ]
};

// Initialize swagger
const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Swagger setup function
const setupSwagger = (app) => {
  // Swagger UI endpoint
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Swagger JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Swagger documentation is available at /api-docs');
};

module.exports = {
  setupSwagger
};
