"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BaseValidator: () => BaseValidator,
  UserValidator: () => UserValidator,
  createUserValidator: () => createUserValidator,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var BaseValidator = class {
  /**
   * Check if data is valid
   * @param data Data to validate
   * @returns True if valid, false otherwise
   */
  isValid(data) {
    return this.validate(data).valid;
  }
};
var UserValidator = class extends BaseValidator {
  validate(data) {
    if (typeof data !== "object" || data === null) {
      return { valid: false, errors: ["Data must be an object"] };
    }
    const user = data;
    const errors = [];
    if (typeof user.username !== "string" || user.username.length < 3) {
      errors.push("Username must be a string with at least 3 characters");
    }
    if (typeof user.email !== "string" || !user.email.includes("@")) {
      errors.push("Email must be a valid email address");
    }
    if (typeof user.password !== "string" || user.password.length < 8) {
      errors.push("Password must be a string with at least 8 characters");
    }
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : void 0
    };
  }
};
var createUserValidator = () => {
  return new UserValidator();
};
var src_default = {
  createUserValidator
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseValidator,
  UserValidator,
  createUserValidator
});
