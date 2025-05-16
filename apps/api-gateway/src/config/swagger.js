/**
 * Swagger Configuration
 * Configures Swagger/OpenAPI documentation
 */

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Configure Swagger/OpenAPI documentation
 * @param {Object} app - Express application instance
 * @param {number} port - Server port
 */
const configureSwagger = (app, port) => {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Samudra Paket ERP API',
        version: '1.0.0',
        description: 'API documentation for Samudra Paket ERP',
        contact: {
          name: 'PT. Sarana Mudah Raya',
          url: 'https://samudrapaket.com',
          email: 'info@samudrapaket.com'
        }
      },
      servers: [
        {
          url: `http://localhost:${port}`,
          description: 'Development server'
        },
        {
          url: process.env.API_URL || 'https://api.samudrapaket.com',
          description: 'Production server'
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
    },
    apis: ['./src/**/*.js']
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Samudra Paket ERP API Documentation'
  }));
};

module.exports = {
  configureSwagger
};
