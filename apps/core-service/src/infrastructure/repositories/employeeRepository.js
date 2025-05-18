/**
 * Employee Repository
 * Handles data access operations for the Employee model
 */

const { Employee, EmployeeHistory } = require('../../domain/models');
const { ApplicationError } = require('../../utils/errors');
const mongoose = require('mongoose');

/**
 * Create a new employee
 * @param {Object} employeeData - Employee data
 * @param {Object} user - User creating the employee
 * @returns {Promise<Object>} Created employee
 */
const createEmployee = async (employeeData, user) => {
  try {
    const employee = new Employee({
      ...employeeData,
      createdBy: user._id,
      updatedBy: user._id
    });
    
    return await employee.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new ApplicationError('Employee ID already exists', 400);
    }
    throw error;
  }
};

/**
 * Get all employees with pagination and filtering
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @param {Object} sort - Sort options
 * @returns {Promise<Object>} Paginated employees
 */
const getEmployees = async (filters = {}, pagination = {}, sort = {}) => {
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;
  
  const query = {};
  
  // Apply filters
  if (filters.employeeId) {
    query.employeeId = { $regex: new RegExp(filters.employeeId, 'i') };
  }
  
  if (filters.name) {
    query.$or = [
      { firstName: { $regex: new RegExp(filters.name, 'i') } },
      { lastName: { $regex: new RegExp(filters.name, 'i') } },
      { fullName: { $regex: new RegExp(filters.name, 'i') } }
    ];
  }
  
  if (filters.status) {
    query.currentStatus = filters.status;
  }
  
  if (filters.branch) {
    query.currentBranch = filters.branch;
  }
  
  if (filters.division) {
    query.currentDivision = filters.division;
  }
  
  if (filters.position) {
    query.currentPosition = filters.position;
  }
  
  if (filters.joinDateFrom) {
    query.joinDate = { ...query.joinDate, $gte: new Date(filters.joinDateFrom) };
  }
  
  if (filters.joinDateTo) {
    query.joinDate = { ...query.joinDate, $lte: new Date(filters.joinDateTo) };
  }
  
  // Set default sort if not provided
  const sortOptions = Object.keys(sort).length > 0 ? sort : { createdAt: -1 };
  
  // Get total count
  const total = await Employee.countDocuments(query);
  
  // Get employees
  const employees = await Employee.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .populate('currentBranch', 'name code')
    .populate('currentDivision', 'name code')
    .populate('currentPosition', 'name code');
  
  return {
    data: employees,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get employee by ID
 * @param {string} id - Employee ID
 * @param {boolean} populate - Whether to populate references
 * @returns {Promise<Object>} Employee
 */
const getEmployeeById = async (id, populate = false) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApplicationError('Invalid employee ID', 400);
  }
  
  let query = Employee.findById(id);
  
  if (populate) {
    query = query
      .populate('currentBranch', 'name code')
      .populate('currentDivision', 'name code')
      .populate('currentPosition', 'name code')
      .populate('assignmentHistory.branch', 'name code')
      .populate('assignmentHistory.division', 'name code')
      .populate('assignmentHistory.position', 'name code')
      .populate('statusHistory.changedBy', 'username')
      .populate('documents.verifiedBy', 'username')
      .populate('skills.verifiedBy', 'username')
      .populate('performanceEvaluations.evaluator', 'employeeId fullName')
      .populate('performanceEvaluations.position', 'name code')
      .populate('careerDevelopment.targetPosition', 'name code')
      .populate('careerDevelopment.mentor', 'employeeId fullName')
      .populate('careerDevelopment.progressReviews.reviewer', 'employeeId fullName')
      .populate('contracts.position', 'name code')
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username');
  }
  
  const employee = await query.exec();
  
  if (!employee) {
    throw new ApplicationError('Employee not found', 404);
  }
  
  return employee;
};

/**
 * Get employee by employee ID
 * @param {string} employeeId - Employee ID
 * @param {boolean} populate - Whether to populate references
 * @returns {Promise<Object>} Employee
 */
const getEmployeeByEmployeeId = async (employeeId, populate = false) => {
  let query = Employee.findOne({ employeeId });
  
  if (populate) {
    query = query
      .populate('currentBranch', 'name code')
      .populate('currentDivision', 'name code')
      .populate('currentPosition', 'name code');
  }
  
  const employee = await query.exec();
  
  if (!employee) {
    throw new ApplicationError('Employee not found', 404);
  }
  
  return employee;
};

/**
 * Get employee by user ID
 * @param {string} userId - User ID
 * @param {boolean} populate - Whether to populate references
 * @returns {Promise<Object>} Employee
 */
const getEmployeeByUserId = async (userId, populate = false) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApplicationError('Invalid user ID', 400);
  }
  
  let query = Employee.findOne({ userId });
  
  if (populate) {
    query = query
      .populate('currentBranch', 'name code')
      .populate('currentDivision', 'name code')
      .populate('currentPosition', 'name code');
  }
  
  const employee = await query.exec();
  
  if (!employee) {
    throw new ApplicationError('Employee not found', 404);
  }
  
  return employee;
};

/**
 * Update employee
 * @param {string} id - Employee ID
 * @param {Object} updateData - Update data
 * @param {Object} user - User updating the employee
 * @returns {Promise<Object>} Updated employee
 */
const updateEmployee = async (id, updateData, user) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApplicationError('Invalid employee ID', 400);
  }
  
  // Get employee before update for history tracking
  const employee = await Employee.findById(id);
  
  if (!employee) {
    throw new ApplicationError('Employee not found', 404);
  }
  
  // Update employee
  const updatedEmployee = await Employee.findByIdAndUpdate(
    id,
    {
      ...updateData,
      updatedBy: user._id,
      updatedAt: new Date()
    },
    { new: true, runValidators: true }
  );
  
  return updatedEmployee;
};

/**
 * Delete employee
 * @param {string} id - Employee ID
 * @returns {Promise<Object>} Deleted employee
 */
const deleteEmployee = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApplicationError('Invalid employee ID', 400);
  }
  
  const employee = await Employee.findByIdAndDelete(id);
  
  if (!employee) {
    throw new ApplicationError('Employee not found', 404);
  }
  
  return employee;
};

/**
 * Add employee document
 * @param {string} employeeId - Employee ID
 * @param {Object} documentData - Document data
 * @param {Object} user - User adding the document
 * @returns {Promise<Object>} Updated employee
 */
const addEmployeeDocument = async (employeeId, documentData, user) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new ApplicationError('Invalid employee ID', 400);
  }
  
  const employee = await Employee.findById(employeeId);
  
  if (!employee) {
    throw new ApplicationError('Employee not found', 404);
  }
  
  employee.documents.push(documentData);
  employee.updatedBy = user._id;
  employee.updatedAt = new Date();
  
  await employee.save();
  
  return employee;
};

/**
 * Update employee document
 * @param {string} employeeId - Employee ID
 * @param {string} documentId - Document ID
 * @param {Object} updateData - Update data
 * @param {Object} user - User updating the document
 * @returns {Promise<Object>} Updated employee
 */
const updateEmployeeDocument = async (employeeId, documentId, updateData, user) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId) || !mongoose.Types.ObjectId.isValid(documentId)) {
    throw new ApplicationError('Invalid ID', 400);
  }
  
  const employee = await Employee.findById(employeeId);
  
  if (!employee) {
    throw new ApplicationError('Employee not found', 404);
  }
  
  const documentIndex = employee.documents.findIndex(doc => doc._id.toString() === documentId);
  
  if (documentIndex === -1) {
    throw new ApplicationError('Document not found', 404);
  }
  
  // Save previous state for history
  const previousDocument = { ...employee.documents[documentIndex].toObject() };
  
  // Update document
  Object.keys(updateData).forEach(key => {
    employee.documents[documentIndex][key] = updateData[key];
  });
  
  employee.updatedBy = user._id;
  employee.updatedAt = new Date();
  
  await employee.save();
  
  return employee;
};

/**
 * Add employee assignment
 * @param {string} employeeId - Employee ID
 * @param {Object} assignmentData - Assignment data
 * @param {Object} user - User adding the assignment
 * @returns {Promise<Object>} Updated employee
 */
const addEmployeeAssignment = async (employeeId, assignmentData, user) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new ApplicationError('Invalid employee ID', 400);
  }
  
  const employee = await Employee.findById(employeeId);
  
  if (!employee) {
    throw new ApplicationError('Employee not found', 404);
  }
  
  // Mark current assignment as inactive if exists
  if (employee.assignmentHistory.length > 0) {
    const currentAssignmentIndex = employee.assignmentHistory.findIndex(a => a.isActive);
    
    if (currentAssignmentIndex !== -1) {
      employee.assignmentHistory[currentAssignmentIndex].isActive = false;
      employee.assignmentHistory[currentAssignmentIndex].endDate = assignmentData.startDate;
    }
  }
  
  // Add new assignment
  employee.assignmentHistory.push({
    ...assignmentData,
    isActive: true
  });
  
  // Update current assignment references
  employee.currentBranch = assignmentData.branch;
  employee.currentDivision = assignmentData.division;
  employee.currentPosition = assignmentData.position;
  
  employee.updatedBy = user._id;
  employee.updatedAt = new Date();
  
  await employee.save();
  
  return employee;
};

/**
 * Update employee status
 * @param {string} employeeId - Employee ID
 * @param {Object} statusData - Status data
 * @param {Object} user - User updating the status
 * @returns {Promise<Object>} Updated employee
 */
const updateEmployeeStatus = async (employeeId, statusData, user) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new ApplicationError('Invalid employee ID', 400);
  }
  
  const employee = await Employee.findById(employeeId);
  
  if (!employee) {
    throw new ApplicationError('Employee not found', 404);
  }
  
  // Add status history entry
  employee.statusHistory.push({
    ...statusData,
    changedBy: user._id
  });
  
  // Update current status
  employee.currentStatus = statusData.status;
  
  employee.updatedBy = user._id;
  employee.updatedAt = new Date();
  
  await employee.save();
  
  return employee;
};

/**
 * Link employee to user account
 * @param {string} employeeId - Employee ID
 * @param {string} userId - User ID
 * @param {Object} user - User performing the linking
 * @returns {Promise<Object>} Updated employee
 */
const linkEmployeeToUser = async (employeeId, userId, user) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApplicationError('Invalid ID', 400);
  }
  
  // Check if user ID is already linked to another employee
  const existingEmployee = await Employee.findOne({ userId });
  
  if (existingEmployee && existingEmployee._id.toString() !== employeeId) {
    throw new ApplicationError('User already linked to another employee', 400);
  }
  
  const employee = await Employee.findById(employeeId);
  
  if (!employee) {
    throw new ApplicationError('Employee not found', 404);
  }
  
  employee.userId = userId;
  employee.updatedBy = user._id;
  employee.updatedAt = new Date();
  
  await employee.save();
  
  return employee;
};

/**
 * Get employee history
 * @param {string} employeeId - Employee ID
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Paginated employee history
 */
const getEmployeeHistory = async (employeeId, filters = {}, pagination = {}) => {
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    throw new ApplicationError('Invalid employee ID', 400);
  }
  
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;
  
  const query = { employeeId };
  
  // Apply filters
  if (filters.changeType) {
    query.changeType = filters.changeType;
  }
  
  if (filters.startDate) {
    query.timestamp = { ...query.timestamp, $gte: new Date(filters.startDate) };
  }
  
  if (filters.endDate) {
    query.timestamp = { ...query.timestamp, $lte: new Date(filters.endDate) };
  }
  
  if (filters.changedBy) {
    query.changedBy = filters.changedBy;
  }
  
  // Get total count
  const total = await EmployeeHistory.countDocuments(query);
  
  // Get history
  const history = await EmployeeHistory.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('changedBy', 'username');
  
  return {
    data: history,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Add employee history entry
 * @param {Object} historyData - History data
 * @returns {Promise<Object>} Created history entry
 */
const addEmployeeHistory = async (historyData) => {
  const history = new EmployeeHistory(historyData);
  return await history.save();
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
  addEmployeeAssignment,
  updateEmployeeStatus,
  linkEmployeeToUser,
  getEmployeeHistory,
  addEmployeeHistory
};
