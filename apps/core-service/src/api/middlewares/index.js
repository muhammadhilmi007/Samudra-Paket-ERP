/**
 * Middlewares Index
 * Export all middlewares for easy importing
 */

const { authenticate, authorize } = require('./auth');
const { validateRequest } = require('./validator');
const { handleError, errorMiddleware } = require('./errorHandler');

module.exports = {
  authenticate,
  authorize,
  validateRequest,
  handleError,
  errorMiddleware
};
