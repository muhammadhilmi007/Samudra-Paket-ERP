/**
 * Employee Use Cases
 * Business logic for employee management
 */

const employeeRepository = require('../../infrastructure/repositories/employeeRepository');
const employeeHistoryRepository = require('../../infrastructure/repositories/employeeHistoryRepository');
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
    // Check if employee ID already exists
    try {
      const existingEmployee = await employeeRepository.getEmployeeByEmployeeId(employeeData.employeeId);
      if (existingEmployee) {
        throw new ApplicationError('Employee ID already exists', 400);
      }
    } catch (error) {
      // If error is 'Employee not found', it's good - we want to create a new one
      if (error.message !== 'Employee not found') {
        throw error;
      }
    }
    
    // Create employee
    const employee = await employeeRepository.createEmployee(employeeData, user);
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: employee._id,
      changeType: 'CREATE',
      description: `Employee ${employee.employeeId} (${employee.fullName}) created`,
      newValue: employee,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return employee;
  } catch (error) {
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
  try {
    return await employeeRepository.getEmployees(filters, pagination, sort);
  } catch (error) {
    throw error;
  }
};

/**
 * Get employee by ID
 * @param {string} id - Employee ID
 * @param {boolean} populate - Whether to populate references
 * @returns {Promise<Object>} Employee
 */
const getEmployeeById = async (id, populate = false) => {
  try {
    return await employeeRepository.getEmployeeById(id, populate);
  } catch (error) {
    throw error;
  }
};

/**
 * Get employee by employee ID
 * @param {string} employeeId - Employee ID
 * @param {boolean} populate - Whether to populate references
 * @returns {Promise<Object>} Employee
 */
const getEmployeeByEmployeeId = async (employeeId, populate = false) => {
  try {
    return await employeeRepository.getEmployeeByEmployeeId(employeeId, populate);
  } catch (error) {
    throw error;
  }
};

/**
 * Get employee by user ID
 * @param {string} userId - User ID
 * @param {boolean} populate - Whether to populate references
 * @returns {Promise<Object>} Employee
 */
const getEmployeeByUserId = async (userId, populate = false) => {
  try {
    return await employeeRepository.getEmployeeByUserId(userId, populate);
  } catch (error) {
    throw error;
  }
};

/**
 * Update employee
 * @param {string} id - Employee ID
 * @param {Object} updateData - Update data
 * @param {Object} user - User updating the employee
 * @returns {Promise<Object>} Updated employee
 */
const updateEmployee = async (id, updateData, user) => {
  try {
    // Get employee before update for history tracking
    const originalEmployee = await employeeRepository.getEmployeeById(id);
    
    // Update employee
    const updatedEmployee = await employeeRepository.updateEmployee(id, updateData, user);
    
    // Determine changed fields
    const changedFields = [];
    Object.keys(updateData).forEach(key => {
      if (JSON.stringify(originalEmployee[key]) !== JSON.stringify(updatedEmployee[key])) {
        changedFields.push(key);
      }
    });
    
    // Record history if fields changed
    if (changedFields.length > 0) {
      await employeeHistoryRepository.createEmployeeHistory({
        employeeId: updatedEmployee._id,
        changeType: 'UPDATE',
        changedFields,
        previousValue: originalEmployee,
        newValue: updatedEmployee,
        description: `Employee ${updatedEmployee.employeeId} (${updatedEmployee.fullName}) updated. Changed fields: ${changedFields.join(', ')}`,
        changedBy: user._id,
        timestamp: new Date()
      });
    }
    
    return updatedEmployee;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete employee
 * @param {string} id - Employee ID
 * @param {Object} user - User deleting the employee
 * @returns {Promise<Object>} Deleted employee
 */
const deleteEmployee = async (id, user) => {
  try {
    // Get employee before deletion for history tracking
    const employee = await employeeRepository.getEmployeeById(id);
    
    // Delete employee
    const deletedEmployee = await employeeRepository.deleteEmployee(id);
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: deletedEmployee._id,
      changeType: 'DELETE',
      previousValue: employee,
      description: `Employee ${deletedEmployee.employeeId} (${deletedEmployee.fullName}) deleted`,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return deletedEmployee;
  } catch (error) {
    throw error;
  }
};

/**
 * Add employee document
 * @param {string} employeeId - Employee ID
 * @param {Object} documentData - Document data
 * @param {Object} user - User adding the document
 * @returns {Promise<Object>} Updated employee
 */
const addEmployeeDocument = async (employeeId, documentData, user) => {
  try {
    // Add document
    const updatedEmployee = await employeeRepository.addEmployeeDocument(employeeId, documentData, user);
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: updatedEmployee._id,
      changeType: 'DOCUMENT_ADDED',
      newValue: documentData,
      description: `Document ${documentData.type} added to employee ${updatedEmployee.employeeId} (${updatedEmployee.fullName})`,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return updatedEmployee;
  } catch (error) {
    throw error;
  }
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
  try {
    // Get employee before update for history tracking
    const originalEmployee = await employeeRepository.getEmployeeById(employeeId);
    const originalDocument = originalEmployee.documents.find(doc => doc._id.toString() === documentId);
    
    if (!originalDocument) {
      throw new ApplicationError('Document not found', 404);
    }
    
    // Update document
    const updatedEmployee = await employeeRepository.updateEmployeeDocument(employeeId, documentId, updateData, user);
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: updatedEmployee._id,
      changeType: 'DOCUMENT_UPDATED',
      previousValue: originalDocument,
      newValue: updatedEmployee.documents.find(doc => doc._id.toString() === documentId),
      description: `Document ${originalDocument.type} updated for employee ${updatedEmployee.employeeId} (${updatedEmployee.fullName})`,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return updatedEmployee;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify employee document
 * @param {string} employeeId - Employee ID
 * @param {string} documentId - Document ID
 * @param {Object} verificationData - Verification data
 * @param {Object} user - User verifying the document
 * @returns {Promise<Object>} Updated employee
 */
const verifyEmployeeDocument = async (employeeId, documentId, verificationData, user) => {
  try {
    // Get employee before update for history tracking
    const originalEmployee = await employeeRepository.getEmployeeById(employeeId);
    const originalDocument = originalEmployee.documents.find(doc => doc._id.toString() === documentId);
    
    if (!originalDocument) {
      throw new ApplicationError('Document not found', 404);
    }
    
    // Update document verification status
    const updateData = {
      verificationStatus: verificationData.status,
      verifiedBy: user._id,
      verifiedAt: new Date(),
      notes: verificationData.notes
    };
    
    // Update document
    const updatedEmployee = await employeeRepository.updateEmployeeDocument(employeeId, documentId, updateData, user);
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: updatedEmployee._id,
      changeType: 'DOCUMENT_VERIFIED',
      previousValue: originalDocument,
      newValue: updatedEmployee.documents.find(doc => doc._id.toString() === documentId),
      description: `Document ${originalDocument.type} verification status updated to ${verificationData.status} for employee ${updatedEmployee.employeeId} (${updatedEmployee.fullName})`,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return updatedEmployee;
  } catch (error) {
    throw error;
  }
};

/**
 * Add employee assignment
 * @param {string} employeeId - Employee ID
 * @param {Object} assignmentData - Assignment data
 * @param {Object} user - User adding the assignment
 * @returns {Promise<Object>} Updated employee
 */
const addEmployeeAssignment = async (employeeId, assignmentData, user) => {
  try {
    // Get employee before update for history tracking
    const originalEmployee = await employeeRepository.getEmployeeById(employeeId);
    
    // Add assignment
    const updatedEmployee = await employeeRepository.addEmployeeAssignment(employeeId, assignmentData, user);
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: updatedEmployee._id,
      changeType: 'ASSIGNMENT_CHANGE',
      previousValue: {
        currentBranch: originalEmployee.currentBranch,
        currentDivision: originalEmployee.currentDivision,
        currentPosition: originalEmployee.currentPosition
      },
      newValue: {
        currentBranch: updatedEmployee.currentBranch,
        currentDivision: updatedEmployee.currentDivision,
        currentPosition: updatedEmployee.currentPosition
      },
      description: `Employee ${updatedEmployee.employeeId} (${updatedEmployee.fullName}) assigned to new position`,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return updatedEmployee;
  } catch (error) {
    throw error;
  }
};

/**
 * Update employee status
 * @param {string} employeeId - Employee ID
 * @param {Object} statusData - Status data
 * @param {Object} user - User updating the status
 * @returns {Promise<Object>} Updated employee
 */
const updateEmployeeStatus = async (employeeId, statusData, user) => {
  try {
    // Get employee before update for history tracking
    const originalEmployee = await employeeRepository.getEmployeeById(employeeId);
    
    // Update status
    const updatedEmployee = await employeeRepository.updateEmployeeStatus(employeeId, statusData, user);
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: updatedEmployee._id,
      changeType: 'STATUS_CHANGE',
      previousValue: { currentStatus: originalEmployee.currentStatus },
      newValue: { currentStatus: updatedEmployee.currentStatus },
      description: `Employee ${updatedEmployee.employeeId} (${updatedEmployee.fullName}) status changed from ${originalEmployee.currentStatus} to ${updatedEmployee.currentStatus}`,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return updatedEmployee;
  } catch (error) {
    throw error;
  }
};

/**
 * Link employee to user account
 * @param {string} employeeId - Employee ID
 * @param {string} userId - User ID
 * @param {Object} user - User performing the linking
 * @returns {Promise<Object>} Updated employee
 */
const linkEmployeeToUser = async (employeeId, userId, user) => {
  try {
    // Get employee before update for history tracking
    const originalEmployee = await employeeRepository.getEmployeeById(employeeId);
    
    // Link to user account
    const updatedEmployee = await employeeRepository.linkEmployeeToUser(employeeId, userId, user);
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: updatedEmployee._id,
      changeType: 'USER_ACCOUNT_LINKED',
      previousValue: { userId: originalEmployee.userId },
      newValue: { userId: updatedEmployee.userId },
      description: `Employee ${updatedEmployee.employeeId} (${updatedEmployee.fullName}) linked to user account`,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return updatedEmployee;
  } catch (error) {
    throw error;
  }
};

/**
 * Add employee skill
 * @param {string} employeeId - Employee ID
 * @param {Object} skillData - Skill data
 * @param {Object} user - User adding the skill
 * @returns {Promise<Object>} Updated employee
 */
const addEmployeeSkill = async (employeeId, skillData, user) => {
  try {
    // Get employee
    const employee = await employeeRepository.getEmployeeById(employeeId);
    
    // Add skill
    employee.skills.push(skillData);
    employee.updatedBy = user._id;
    employee.updatedAt = new Date();
    
    await employee.save();
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: employee._id,
      changeType: 'SKILL_ADDED',
      newValue: skillData,
      description: `Skill ${skillData.name} added to employee ${employee.employeeId} (${employee.fullName})`,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return employee;
  } catch (error) {
    throw error;
  }
};

/**
 * Add employee training
 * @param {string} employeeId - Employee ID
 * @param {Object} trainingData - Training data
 * @param {Object} user - User adding the training
 * @returns {Promise<Object>} Updated employee
 */
const addEmployeeTraining = async (employeeId, trainingData, user) => {
  try {
    // Get employee
    const employee = await employeeRepository.getEmployeeById(employeeId);
    
    // Add training
    employee.trainings.push(trainingData);
    employee.updatedBy = user._id;
    employee.updatedAt = new Date();
    
    await employee.save();
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: employee._id,
      changeType: 'TRAINING_ADDED',
      newValue: trainingData,
      description: `Training ${trainingData.name} added to employee ${employee.employeeId} (${employee.fullName})`,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return employee;
  } catch (error) {
    throw error;
  }
};

/**
 * Add employee performance evaluation
 * @param {string} employeeId - Employee ID
 * @param {Object} evaluationData - Evaluation data
 * @param {Object} user - User adding the evaluation
 * @returns {Promise<Object>} Updated employee
 */
const addEmployeePerformanceEvaluation = async (employeeId, evaluationData, user) => {
  try {
    // Get employee
    const employee = await employeeRepository.getEmployeeById(employeeId);
    
    // Add performance evaluation
    employee.performanceEvaluations.push(evaluationData);
    employee.updatedBy = user._id;
    employee.updatedAt = new Date();
    
    await employee.save();
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: employee._id,
      changeType: 'PERFORMANCE_EVALUATION',
      newValue: evaluationData,
      description: `Performance evaluation added to employee ${employee.employeeId} (${employee.fullName})`,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return employee;
  } catch (error) {
    throw error;
  }
};

/**
 * Add employee career development plan
 * @param {string} employeeId - Employee ID
 * @param {Object} planData - Career development plan data
 * @param {Object} user - User adding the plan
 * @returns {Promise<Object>} Updated employee
 */
const addEmployeeCareerDevelopment = async (employeeId, planData, user) => {
  try {
    // Get employee
    const employee = await employeeRepository.getEmployeeById(employeeId);
    
    // Add career development plan
    employee.careerDevelopment.push(planData);
    employee.updatedBy = user._id;
    employee.updatedAt = new Date();
    
    await employee.save();
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: employee._id,
      changeType: 'CAREER_DEVELOPMENT_UPDATE',
      newValue: planData,
      description: `Career development plan added to employee ${employee.employeeId} (${employee.fullName})`,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return employee;
  } catch (error) {
    throw error;
  }
};

/**
 * Add employee contract
 * @param {string} employeeId - Employee ID
 * @param {Object} contractData - Contract data
 * @param {Object} user - User adding the contract
 * @returns {Promise<Object>} Updated employee
 */
const addEmployeeContract = async (employeeId, contractData, user) => {
  try {
    // Get employee
    const employee = await employeeRepository.getEmployeeById(employeeId);
    
    // Add contract
    employee.contracts.push(contractData);
    employee.updatedBy = user._id;
    employee.updatedAt = new Date();
    
    await employee.save();
    
    // Record history
    await employeeHistoryRepository.createEmployeeHistory({
      employeeId: employee._id,
      changeType: 'CONTRACT_ADDED',
      newValue: contractData,
      description: `Contract ${contractData.number} added to employee ${employee.employeeId} (${employee.fullName})`,
      changedBy: user._id,
      timestamp: new Date()
    });
    
    return employee;
  } catch (error) {
    throw error;
  }
};

/**
 * Get employee history
 * @param {string} employeeId - Employee ID
 * @param {Object} filters - Filter criteria
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} Paginated employee history
 */
const getEmployeeHistory = async (employeeId, filters = {}, pagination = {}) => {
  try {
    return await employeeHistoryRepository.getEmployeeHistory(employeeId, filters, pagination);
  } catch (error) {
    throw error;
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
