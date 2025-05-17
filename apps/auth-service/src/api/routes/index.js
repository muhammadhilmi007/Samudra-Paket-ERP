/**
 * Routes Index
 * Exports all route modules
 */

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const sessionRoutes = require('./sessionRoutes');
const securityLogRoutes = require('./securityLogRoutes');
const roleRoutes = require('./roleRoutes');
const permissionRoutes = require('./permissionRoutes');
const userRoleRoutes = require('./userRoleRoutes');

module.exports = (app) => {
  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/sessions', sessionRoutes);
  app.use('/api/security-logs', securityLogRoutes);
  app.use('/api/roles', roleRoutes);
  app.use('/api/permissions', permissionRoutes);
  app.use('/api/user-roles', userRoleRoutes);
  
  // API Documentation route
  app.get('/api-docs', (req, res) => {
    res.redirect('/api-docs/index.html');
  });
  
  return app;
};
