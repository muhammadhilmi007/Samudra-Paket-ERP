/**
 * Validation Middleware
 * Validates requests against Joi schemas
 */

/**
 * Validate request against Joi schema
 * @param {Object} schema - Joi schema
 * @param {string} property - Request property to validate (body, params, query)
 * @returns {Function} - Express middleware
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (!error) {
      return next();
    }
    
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors
    });
  };
};

module.exports = {
  validate
};
