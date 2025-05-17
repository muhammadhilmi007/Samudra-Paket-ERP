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
        },
        schemas: {
          User: {
            type: 'object',
            properties: {
              _id: {
                type: 'string',
                example: '60d21b4667d0d8992e610c85'
              },
              email: {
                type: 'string',
                format: 'email',
                example: 'john.doe@example.com'
              },
              firstName: {
                type: 'string',
                example: 'John'
              },
              lastName: {
                type: 'string',
                example: 'Doe'
              },
              role: {
                type: 'string',
                enum: ['user', 'courier', 'driver', 'warehouse', 'manager', 'admin'],
                example: 'user'
              },
              isVerified: {
                type: 'boolean',
                example: true
              },
              phoneNumber: {
                type: 'string',
                example: '+6281234567890'
              },
              address: {
                type: 'object',
                properties: {
                  street: {
                    type: 'string',
                    example: '123 Main St'
                  },
                  city: {
                    type: 'string',
                    example: 'Jakarta'
                  },
                  state: {
                    type: 'string',
                    example: 'DKI Jakarta'
                  },
                  postalCode: {
                    type: 'string',
                    example: '12345'
                  },
                  country: {
                    type: 'string',
                    example: 'Indonesia'
                  }
                }
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2023-05-17T08:30:00Z'
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2023-05-17T08:30:00Z'
              }
            }
          },
          Session: {
            type: 'object',
            properties: {
              _id: {
                type: 'string',
                example: '60d21b4667d0d8992e610c85'
              },
              userId: {
                type: 'string',
                example: '60d21b4667d0d8992e610c85'
              },
              refreshToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
              },
              userAgent: {
                type: 'string',
                example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              },
              ipAddress: {
                type: 'string',
                example: '192.168.1.1'
              },
              expiresAt: {
                type: 'string',
                format: 'date-time',
                example: '2023-06-17T08:30:00Z'
              }
            }
          },
          Error: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'error'
              },
              code: {
                type: 'string',
                example: 'VALIDATION_ERROR'
              },
              message: {
                type: 'string',
                example: 'Validation error'
              },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: {
                      type: 'string',
                      example: 'email'
                    },
                    message: {
                      type: 'string',
                      example: 'Email is required'
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          UnauthorizedError: {
            description: 'Authentication information is missing or invalid',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'error'
                    },
                    code: {
                      type: 'string',
                      example: 'UNAUTHORIZED'
                    },
                    message: {
                      type: 'string',
                      example: 'Unauthorized access'
                    }
                  }
                }
              }
            }
          },
          ValidationError: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          },
          NotFoundError: {
            description: 'Resource not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'error'
                    },
                    code: {
                      type: 'string',
                      example: 'NOT_FOUND'
                    },
                    message: {
                      type: 'string',
                      example: 'Resource not found'
                    }
                  }
                }
              }
            }
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
