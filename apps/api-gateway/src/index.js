/**
 * API Gateway Service
 * Central entry point for all client requests
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Apply middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Define routes and proxies
app.use('/api/auth', createProxyMiddleware({ 
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '',
  },
}));

app.use('/api/core', createProxyMiddleware({ 
  target: process.env.CORE_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/core': '',
  },
}));

app.use('/api/operations', createProxyMiddleware({ 
  target: process.env.OPERATIONS_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/operations': '',
  },
}));

app.use('/api/finance', createProxyMiddleware({ 
  target: process.env.FINANCE_SERVICE_URL || 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: {
    '^/api/finance': '',
  },
}));

app.use('/api/notification', createProxyMiddleware({ 
  target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
  changeOrigin: true,
  pathRewrite: {
    '^/api/notification': '',
  },
}));

app.use('/api/reporting', createProxyMiddleware({ 
  target: process.env.REPORTING_SERVICE_URL || 'http://localhost:3006',
  changeOrigin: true,
  pathRewrite: {
    '^/api/reporting': '',
  },
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});

module.exports = app;
