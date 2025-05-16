/**
 * Validation Package
 * Shared validation schemas for all services and applications
 */

// This is a placeholder file for the validation package
// In a real implementation, this would use Joi or Zod for validation

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Validator interface
 */
export interface Validator<T> {
  validate(data: unknown): ValidationResult;
  isValid(data: unknown): boolean;
}

/**
 * Base validator class
 */
export abstract class BaseValidator<T> implements Validator<T> {
  /**
   * Validate data against schema
   * @param data Data to validate
   * @returns Validation result
   */
  abstract validate(data: unknown): ValidationResult;

  /**
   * Check if data is valid
   * @param data Data to validate
   * @returns True if valid, false otherwise
   */
  isValid(data: unknown): boolean {
    return this.validate(data).valid;
  }
}

/**
 * User validation schema
 */
export class UserValidator extends BaseValidator<any> {
  validate(data: unknown): ValidationResult {
    // This is a simple implementation for demonstration
    // In a real implementation, this would use Joi or Zod
    
    if (typeof data !== 'object' || data === null) {
      return { valid: false, errors: ['Data must be an object'] };
    }
    
    const user = data as Record<string, unknown>;
    const errors: string[] = [];
    
    if (typeof user.username !== 'string' || user.username.length < 3) {
      errors.push('Username must be a string with at least 3 characters');
    }
    
    if (typeof user.email !== 'string' || !user.email.includes('@')) {
      errors.push('Email must be a valid email address');
    }
    
    if (typeof user.password !== 'string' || user.password.length < 8) {
      errors.push('Password must be a string with at least 8 characters');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}

/**
 * Create a user validator
 * @returns A new user validator
 */
export const createUserValidator = (): UserValidator => {
  return new UserValidator();
};

export default {
  createUserValidator,
};
