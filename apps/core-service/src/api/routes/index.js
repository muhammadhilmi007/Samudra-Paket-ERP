/**
 * Routes Index
 * Registers all API routes
 */

const express = require('express');
const router = express.Router();
const branchRoutes = require('./branchRoutes');

// Register routes
router.use('/branches', branchRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Core service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
