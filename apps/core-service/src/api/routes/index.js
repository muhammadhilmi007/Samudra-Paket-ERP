/**
 * Routes Index
 * Registers all API routes
 */

const express = require('express');
const router = express.Router();

// Import routes
const branchRoutes = require('./branchRoutes');
const serviceAreaRoutes = require('./serviceAreaRoutes');
const serviceAreaAssignmentRoutes = require('./serviceAreaAssignmentRoutes');
const serviceAreaPricingRoutes = require('./serviceAreaPricingRoutes');
const serviceAreaGeospatialRoutes = require('./serviceAreaGeospatialRoutes');

// Register routes
router.use('/branches', branchRoutes);
router.use('/service-areas', serviceAreaRoutes);
router.use('/service-area-assignments', serviceAreaAssignmentRoutes);
router.use('/service-area-pricing', serviceAreaPricingRoutes);
router.use('/service-areas/geospatial', serviceAreaGeospatialRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Core service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
