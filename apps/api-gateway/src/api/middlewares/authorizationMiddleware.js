/**
 * Authorization Middleware
 * Middleware for role-based access control
 */

/**
 * Check if user has required role
 * @param {Array|String} requiredRoles - Required role(s) for access
 * @returns {Function} Middleware function
 */
const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    // If no roles are required, allow access
    if (!requiredRoles || (Array.isArray(requiredRoles) && requiredRoles.length === 0)) {
      return next();
    }
    
    // Get user from request (set by authenticateJWT middleware)
    const user = req.user;
    
    // If no user or no role, deny access
    if (!user || !user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Insufficient permissions'
      });
    }
    
    // Convert single role to array for consistent handling
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // Check if user has any of the required roles
    // Special case: ADMIN role has access to everything
    if (user.role === 'ADMIN' || roles.includes(user.role)) {
      return next();
    }
    
    // Deny access if user doesn't have required role
    return res.status(403).json({
      success: false,
      message: 'Access denied: Insufficient permissions'
    });
  };
};

module.exports = {
  checkRole
};
