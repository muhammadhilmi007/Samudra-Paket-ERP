/**
 * Repositories Index
 * Exports all repositories
 */

const userRepository = require('./userRepository');
const sessionRepository = require('./sessionRepository');
const securityLogRepository = require('./securityLogRepository');

module.exports = {
  userRepository,
  sessionRepository,
  securityLogRepository
};
