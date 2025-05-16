/**
 * Health Check Routes
 * Implements health check endpoints for monitoring
 */

const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: API Gateway health check
 *     description: Returns the health status of the API Gateway
 *     responses:
 *       200:
 *         description: API Gateway is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 service:
 *                   type: string
 *                   example: api-gateway
 *                 uptime:
 *                   type: number
 *                   example: 3600
 *                 timestamp:
 *                   type: string
 *                   example: 2023-05-01T12:00:00Z
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'api-gateway',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /health/services:
 *   get:
 *     summary: Services health check
 *     description: Returns the health status of all microservices
 *     responses:
 *       200:
 *         description: Health status of all services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 services:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: auth-service
 *                       status:
 *                         type: string
 *                         example: ok
 *                       statusCode:
 *                         type: number
 *                         example: 200
 *                 timestamp:
 *                   type: string
 *                   example: 2023-05-01T12:00:00Z
 */
router.get('/services', async (req, res) => {
  const services = [
    { name: 'auth-service', url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001' },
    { name: 'core-service', url: process.env.CORE_SERVICE_URL || 'http://localhost:3002' },
    { name: 'operations-service', url: process.env.OPERATIONS_SERVICE_URL || 'http://localhost:3003' },
    { name: 'finance-service', url: process.env.FINANCE_SERVICE_URL || 'http://localhost:3004' },
    { name: 'notification-service', url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005' },
    { name: 'reporting-service', url: process.env.REPORTING_SERVICE_URL || 'http://localhost:3006' }
  ];
  
  const serviceStatuses = await Promise.all(services.map(async (service) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${service.url}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      return {
        name: service.name,
        status: response.ok ? 'ok' : 'error',
        statusCode: response.status
      };
    } catch (error) {
      return {
        name: service.name,
        status: 'error',
        error: error.name === 'AbortError' ? 'timeout' : error.message
      };
    }
  }));
  
  res.status(200).json({
    status: 'ok',
    services: serviceStatuses,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
