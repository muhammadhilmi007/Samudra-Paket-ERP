/**
 * Database Index
 * Exports database connection modules
 */

const mongoConnection = require('./connection');
const redisClient = require('./redis');

module.exports = {
  mongoConnection,
  redisClient
};
