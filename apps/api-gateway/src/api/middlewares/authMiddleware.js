/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user information to the request
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      code: 'UNAUTHORIZED',
      message: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'Invalid or expired token'
      });
    }
    
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateJWT
};
