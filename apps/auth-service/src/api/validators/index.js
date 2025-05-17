/**
 * Validators Index
 * Exports all validators
 */

const authValidation = require('./authValidators');
const roleValidation = require('./roleValidation');
const permissionValidation = require('./permissionValidation');
const userRoleValidation = require('./userRoleValidation');

module.exports = {
  authValidation,
  roleValidation,
  permissionValidation,
  userRoleValidation
};
