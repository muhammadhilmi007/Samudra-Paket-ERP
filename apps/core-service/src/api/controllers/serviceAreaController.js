/**
 * Service Area Controller
 * Handles HTTP requests for service area management
 */

const serviceAreaUseCases = require('../../application/use-cases/serviceArea');
const { logger } = require('../../utils');

/**
 * Create a new service area
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createServiceArea = async (req, res) => {
  try {
    const serviceAreaData = req.body;
    const userId = req.user.id;
    
    const serviceArea = await serviceAreaUseCases.createServiceArea(serviceAreaData, userId);
    
    return res.status(201).json({
      success: true,
      message: 'Service area created successfully',
      data: serviceArea
    });
  } catch (error) {
    logger.error(`Error in createServiceArea controller: ${error.message}`, { error });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to create service area',
      error: error.message
    });
  }
};

/**
 * Get a service area by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getServiceArea = async (req, res) => {
  try {
    const { id } = req.params;
    
    const serviceArea = await serviceAreaUseCases.getServiceArea(id);
    
    return res.status(200).json({
      success: true,
      data: serviceArea
    });
  } catch (error) {
    logger.error(`Error in getServiceArea controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to get service area',
      error: error.message
    });
  }
};

/**
 * List service areas with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const listServiceAreas = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, areaType, adminLevel } = req.query;
    
    // Build filter object from query parameters
    const filter = {};
    if (search) filter.search = search;
    if (status) filter.status = status;
    if (areaType) filter.areaType = areaType;
    if (adminLevel) filter.adminLevel = adminLevel;
    
    // Parse sort parameter
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(':');
      sort = { [field]: order === 'desc' ? -1 : 1 };
    }
    
    const result = await serviceAreaUseCases.listServiceAreas(
      filter,
      parseInt(page, 10),
      parseInt(limit, 10),
      sort
    );
    
    return res.status(200).json({
      success: true,
      data: result.serviceAreas,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in listServiceAreas controller: ${error.message}`, { error });
    
    return res.status(500).json({
      success: false,
      message: 'Failed to list service areas',
      error: error.message
    });
  }
};

/**
 * Update a service area
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateServiceArea = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;
    const reason = req.body.reason || '';
    
    // Remove reason from updateData if it exists
    if (updateData.reason) {
      delete updateData.reason;
    }
    
    const serviceArea = await serviceAreaUseCases.updateServiceArea(id, updateData, userId, reason);
    
    return res.status(200).json({
      success: true,
      message: 'Service area updated successfully',
      data: serviceArea
    });
  } catch (error) {
    logger.error(`Error in updateServiceArea controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update service area',
      error: error.message
    });
  }
};

/**
 * Delete a service area
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteServiceArea = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const reason = req.query.reason || '';
    const force = req.query.force === 'true';
    
    await serviceAreaUseCases.deleteServiceArea(id, userId, reason, force);
    
    return res.status(200).json({
      success: true,
      message: 'Service area deleted successfully'
    });
  } catch (error) {
    logger.error(`Error in deleteServiceArea controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to delete service area',
      error: error.message
    });
  }
};

/**
 * Get service area history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getServiceAreaHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const history = await serviceAreaUseCases.getServiceAreaHistory(id);
    
    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    logger.error(`Error in getServiceAreaHistory controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to get service area history',
      error: error.message
    });
  }
};

/**
 * Assign service area to branch
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const assignServiceAreaToBranch = async (req, res) => {
  try {
    const { serviceAreaId, branchId, priorityLevel, notes } = req.body;
    const userId = req.user.id;
    
    const assignment = await serviceAreaUseCases.assignServiceAreaToBranch(
      branchId,
      serviceAreaId,
      priorityLevel,
      notes,
      userId
    );
    
    return res.status(201).json({
      success: true,
      message: 'Service area assigned to branch successfully',
      data: assignment
    });
  } catch (error) {
    logger.error(`Error in assignServiceAreaToBranch controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to assign service area to branch',
      error: error.message
    });
  }
};

/**
 * Get service area assignment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getServiceAreaAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const assignment = await serviceAreaUseCases.getServiceAreaAssignment(id);
    
    return res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    logger.error(`Error in getServiceAreaAssignment controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to get service area assignment',
      error: error.message
    });
  }
};

/**
 * List service areas by branch
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const listServiceAreasByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    
    // Build filter object from query parameters
    const filter = {};
    if (status) filter.status = status;
    
    const result = await serviceAreaUseCases.listServiceAreasByBranch(
      branchId,
      filter,
      parseInt(page, 10),
      parseInt(limit, 10)
    );
    
    return res.status(200).json({
      success: true,
      data: result.assignments,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in listServiceAreasByBranch controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to list service areas by branch',
      error: error.message
    });
  }
};

/**
 * List branches by service area
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const listBranchesByServiceArea = async (req, res) => {
  try {
    const { serviceAreaId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    
    // Build filter object from query parameters
    const filter = {};
    if (status) filter.status = status;
    
    const result = await serviceAreaUseCases.listBranchesByServiceArea(
      serviceAreaId,
      filter,
      parseInt(page, 10),
      parseInt(limit, 10)
    );
    
    return res.status(200).json({
      success: true,
      data: result.assignments,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in listBranchesByServiceArea controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to list branches by service area',
      error: error.message
    });
  }
};

/**
 * Update service area assignment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateServiceAreaAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;
    
    const assignment = await serviceAreaUseCases.updateServiceAreaAssignment(id, updateData, userId);
    
    return res.status(200).json({
      success: true,
      message: 'Service area assignment updated successfully',
      data: assignment
    });
  } catch (error) {
    logger.error(`Error in updateServiceAreaAssignment controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update service area assignment',
      error: error.message
    });
  }
};

/**
 * Remove service area assignment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeServiceAreaAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const reason = req.query.reason || '';
    
    await serviceAreaUseCases.removeServiceAreaAssignment(id, userId, reason);
    
    return res.status(200).json({
      success: true,
      message: 'Service area assignment removed successfully'
    });
  } catch (error) {
    logger.error(`Error in removeServiceAreaAssignment controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to remove service area assignment',
      error: error.message
    });
  }
};

/**
 * Create service area pricing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createServiceAreaPricing = async (req, res) => {
  try {
    const pricingData = req.body;
    const userId = req.user.id;
    
    const pricing = await serviceAreaUseCases.createServiceAreaPricing(pricingData, userId);
    
    return res.status(201).json({
      success: true,
      message: 'Service area pricing created successfully',
      data: pricing
    });
  } catch (error) {
    logger.error(`Error in createServiceAreaPricing controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to create service area pricing',
      error: error.message
    });
  }
};

/**
 * Get service area pricing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getServiceAreaPricing = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pricing = await serviceAreaUseCases.getServiceAreaPricing(id);
    
    return res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    logger.error(`Error in getServiceAreaPricing controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to get service area pricing',
      error: error.message
    });
  }
};

/**
 * List service area pricings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const listServiceAreaPricings = async (req, res) => {
  try {
    const { serviceAreaId } = req.params;
    const { page = 1, limit = 10, serviceType, status } = req.query;
    
    // Build filter object from query parameters
    const filter = {};
    if (serviceType) filter.serviceType = serviceType;
    if (status) filter.status = status;
    
    const result = await serviceAreaUseCases.listServiceAreaPricings(
      serviceAreaId,
      filter,
      parseInt(page, 10),
      parseInt(limit, 10)
    );
    
    return res.status(200).json({
      success: true,
      data: result.pricingConfigurations,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error(`Error in listServiceAreaPricings controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to list service area pricings',
      error: error.message
    });
  }
};

/**
 * Update service area pricing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateServiceAreaPricing = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;
    
    const pricing = await serviceAreaUseCases.updateServiceAreaPricing(id, updateData, userId);
    
    return res.status(200).json({
      success: true,
      message: 'Service area pricing updated successfully',
      data: pricing
    });
  } catch (error) {
    logger.error(`Error in updateServiceAreaPricing controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update service area pricing',
      error: error.message
    });
  }
};

/**
 * Delete service area pricing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteServiceAreaPricing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const reason = req.query.reason || '';
    
    await serviceAreaUseCases.deleteServiceAreaPricing(id, userId, reason);
    
    return res.status(200).json({
      success: true,
      message: 'Service area pricing deleted successfully'
    });
  } catch (error) {
    logger.error(`Error in deleteServiceAreaPricing controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to delete service area pricing',
      error: error.message
    });
  }
};

/**
 * Calculate shipping price
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const calculateShippingPrice = async (req, res) => {
  try {
    const { serviceAreaId, serviceType, distance, weight } = req.body;
    
    const result = await serviceAreaUseCases.calculateShippingPrice(
      serviceAreaId,
      serviceType,
      parseFloat(distance),
      parseFloat(weight)
    );
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error in calculateShippingPrice controller: ${error.message}`, { error });
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate shipping price',
      error: error.message
    });
  }
};

/**
 * Find service areas by location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const findServiceAreasByLocation = async (req, res) => {
  try {
    const { longitude, latitude, searchType = 'contains', maxDistance } = req.body;
    
    // Create location object
    const location = {
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };
    
    // Parse max distance if provided
    let parsedMaxDistance = undefined;
    if (maxDistance) {
      parsedMaxDistance = parseFloat(maxDistance);
    }
    
    // Parse polygon if provided
    let polygon = undefined;
    if (req.body.polygon) {
      polygon = req.body.polygon;
    }
    
    const serviceAreas = await serviceAreaUseCases.findServiceAreasByLocation(
      location,
      searchType,
      parsedMaxDistance,
      polygon
    );
    
    return res.status(200).json({
      success: true,
      data: serviceAreas
    });
  } catch (error) {
    logger.error(`Error in findServiceAreasByLocation controller: ${error.message}`, { error });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to find service areas by location',
      error: error.message
    });
  }
};

/**
 * Find branches serving location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const findBranchesServingLocation = async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    
    // Create location object
    const location = {
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };
    
    const branches = await serviceAreaUseCases.findBranchesServingLocation(location);
    
    return res.status(200).json({
      success: true,
      data: branches
    });
  } catch (error) {
    logger.error(`Error in findBranchesServingLocation controller: ${error.message}`, { error });
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to find branches serving location',
      error: error.message
    });
  }
};

module.exports = {
  createServiceArea,
  getServiceArea,
  listServiceAreas,
  updateServiceArea,
  deleteServiceArea,
  getServiceAreaHistory,
  assignServiceAreaToBranch,
  getServiceAreaAssignment,
  listServiceAreasByBranch,
  listBranchesByServiceArea,
  updateServiceAreaAssignment,
  removeServiceAreaAssignment,
  createServiceAreaPricing,
  getServiceAreaPricing,
  listServiceAreaPricings,
  updateServiceAreaPricing,
  deleteServiceAreaPricing,
  calculateShippingPrice,
  findServiceAreasByLocation,
  findBranchesServingLocation
};
