/**
 * Swagger Configuration
 * Configures Swagger documentation for the API
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Import Swagger documentation
require('./branchSwagger');
require('./employeeSwagger');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Samudra Paket ERP - Core Service API',
    version: '1.0.0',
    description: 'API documentation for the Core Service of Samudra Paket ERP',
    contact: {
      name: 'Samudra Paket ERP Team',
      email: 'dev@samudrapp.com'
    },
    license: {
      name: 'Proprietary',
      url: 'https://samudrapp.com'
    }
  },
  servers: [
    {
      url: '/api',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Branches',
      description: 'Branch management endpoints'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

// Swagger options
const swaggerOptions = {
  swaggerDefinition,
  apis: [
    path.resolve(__dirname, '../routes/*.js'),
    path.resolve(__dirname, './*.js')
  ]
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Setup Swagger middleware
const setupSwagger = (app) => {
  // Serve Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Samudra Paket ERP - Core Service API Documentation'
  }));
  
  // Serve Swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('Swagger documentation available at /api-docs');
};

module.exports = setupSwagger;
