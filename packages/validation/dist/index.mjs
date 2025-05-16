// src/index.ts
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
export {
  BaseValidator,
  UserValidator,
  createUserValidator,
  src_default as default
};
