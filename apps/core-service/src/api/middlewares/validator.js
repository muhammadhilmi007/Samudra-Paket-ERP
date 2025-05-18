/**
 * Request Validator Middleware
 * Validates request data against defined schemas
 */

const { logger } = require('../../utils');

/**
 * Validate request data against a schema
 * @param {Object} schema - The validation schema
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request parameters if schema has params
      if (schema.params) {
        const { error, value } = schema.params.validate(req.params);
        if (error) {
          logger.warn(`Validation error in params: ${error.message}`);
          return res.status(400).json({
            success: false,
            message: 'Invalid request parameters',
            errors: error.details.map(detail => ({
              field: detail.context.key,
              message: detail.message
            }))
          });
        }
        req.params = value;
      }

      // Validate request query if schema has query
      if (schema.query) {
        const { error, value } = schema.query.validate(req.query);
        if (error) {
          logger.warn(`Validation error in query: ${error.message}`);
          return res.status(400).json({
            success: false,
            message: 'Invalid query parameters',
            errors: error.details.map(detail => ({
              field: detail.context.key,
              message: detail.message
            }))
          });
        }
        req.query = value;
      }

      // Validate request body if schema has body
      if (schema.body) {
        const { error, value } = schema.body.validate(req.body, { abortEarly: false });
        if (error) {
          logger.warn(`Validation error in body: ${error.message}`);
          return res.status(400).json({
            success: false,
            message: 'Invalid request data',
            errors: error.details.map(detail => ({
              field: detail.context.key || detail.path.join('.'),
              message: detail.message
            }))
          });
        }
        req.body = value;
      }

      next();
    } catch (error) {
      logger.error('Error in validation middleware:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during validation',
        error: error.message
      });
    }
  };
};

module.exports = {
  validateRequest
};
