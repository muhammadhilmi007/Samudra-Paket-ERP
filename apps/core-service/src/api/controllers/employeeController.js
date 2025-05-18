/**
 * Employee Controller
 * Handles HTTP requests for employee management
 */

const employeeUseCases = require('../../application/use-cases/employeeUseCases');
const { ApplicationError } = require('../../utils/errors');

/**
 * Create a new employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createEmployee = async (req, res, next) => {
  try {
    const employeeData = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.createEmployee(employeeData, user);
    
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all employees with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getEmployees = async (req, res, next) => {
  try {
    const { 
      page, 
      limit, 
      name, 
      employeeId, 
      status, 
      branch, 
      division, 
      position, 
      joinDateFrom, 
      joinDateTo,
      sortBy,
      sortOrder
    } = req.query;
    
    // Build filters
    const filters = {};
    if (name) filters.name = name;
    if (employeeId) filters.employeeId = employeeId;
    if (status) filters.status = status;
    if (branch) filters.branch = branch;
    if (division) filters.division = division;
    if (position) filters.position = position;
    if (joinDateFrom) filters.joinDateFrom = joinDateFrom;
    if (joinDateTo) filters.joinDateTo = joinDateTo;
    
    // Build pagination
    const pagination = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    };
    
    // Build sort
    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }
    
    const result = await employeeUseCases.getEmployees(filters, pagination, sort);
    
    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get employee by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { populate } = req.query;
    
    const employee = await employeeUseCases.getEmployeeById(id, populate === 'true');
    
    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get employee by employee ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getEmployeeByEmployeeId = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { populate } = req.query;
    
    const employee = await employeeUseCases.getEmployeeByEmployeeId(employeeId, populate === 'true');
    
    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get employee by user ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getEmployeeByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { populate } = req.query;
    
    const employee = await employeeUseCases.getEmployeeByUserId(userId, populate === 'true');
    
    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.updateEmployee(id, updateData, user);
    
    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete employee
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    const employee = await employeeUseCases.deleteEmployee(id, user);
    
    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add employee document
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const addEmployeeDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const documentData = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.addEmployeeDocument(id, documentData, user);
    
    res.status(200).json({
      success: true,
      message: 'Document added successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update employee document
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateEmployeeDocument = async (req, res, next) => {
  try {
    const { id, documentId } = req.params;
    const updateData = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.updateEmployeeDocument(id, documentId, updateData, user);
    
    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify employee document
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyEmployeeDocument = async (req, res, next) => {
  try {
    const { id, documentId } = req.params;
    const verificationData = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.verifyEmployeeDocument(id, documentId, verificationData, user);
    
    res.status(200).json({
      success: true,
      message: 'Document verified successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add employee assignment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const addEmployeeAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignmentData = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.addEmployeeAssignment(id, assignmentData, user);
    
    res.status(200).json({
      success: true,
      message: 'Assignment added successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update employee status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateEmployeeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const statusData = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.updateEmployeeStatus(id, statusData, user);
    
    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Link employee to user account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const linkEmployeeToUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.linkEmployeeToUser(id, userId, user);
    
    res.status(200).json({
      success: true,
      message: 'Employee linked to user account successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add employee skill
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const addEmployeeSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skillData = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.addEmployeeSkill(id, skillData, user);
    
    res.status(200).json({
      success: true,
      message: 'Skill added successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add employee training
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const addEmployeeTraining = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trainingData = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.addEmployeeTraining(id, trainingData, user);
    
    res.status(200).json({
      success: true,
      message: 'Training added successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add employee performance evaluation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const addEmployeePerformanceEvaluation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const evaluationData = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.addEmployeePerformanceEvaluation(id, evaluationData, user);
    
    res.status(200).json({
      success: true,
      message: 'Performance evaluation added successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add employee career development plan
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const addEmployeeCareerDevelopment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const planData = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.addEmployeeCareerDevelopment(id, planData, user);
    
    res.status(200).json({
      success: true,
      message: 'Career development plan added successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add employee contract
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const addEmployeeContract = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contractData = req.body;
    const user = req.user;
    
    const employee = await employeeUseCases.addEmployeeContract(id, contractData, user);
    
    res.status(200).json({
      success: true,
      message: 'Contract added successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get employee history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getEmployeeHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      page, 
      limit, 
      changeType, 
      startDate, 
      endDate, 
      changedBy 
    } = req.query;
    
    // Build filters
    const filters = {};
    if (changeType) filters.changeType = changeType;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (changedBy) filters.changedBy = changedBy;
    
    // Build pagination
    const pagination = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    };
    
    const result = await employeeUseCases.getEmployeeHistory(id, filters, pagination);
    
    res.status(200).json({
      success: true,
      message: 'Employee history retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeeByEmployeeId,
  getEmployeeByUserId,
  updateEmployee,
  deleteEmployee,
  addEmployeeDocument,
  updateEmployeeDocument,
  verifyEmployeeDocument,
  addEmployeeAssignment,
  updateEmployeeStatus,
  linkEmployeeToUser,
  addEmployeeSkill,
  addEmployeeTraining,
  addEmployeePerformanceEvaluation,
  addEmployeeCareerDevelopment,
  addEmployeeContract,
  getEmployeeHistory
};
