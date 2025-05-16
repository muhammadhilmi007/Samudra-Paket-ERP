/**
 * Utils Package
 * Shared utility functions for all services and applications
 */

// This is a placeholder file for the utils package
// In a real implementation, this would export utility functions

/**
 * Formats a date according to the specified format
 * @param date The date to format
 * @param format The format to use
 * @returns The formatted date string
 */
export const formatDate = (date: Date, format: string = 'yyyy-MM-dd'): string => {
  // Implementation would use date-fns in a real application
  return date.toISOString().split('T')[0];
};

/**
 * Generates a unique ID
 * @returns A unique ID string
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export default {
  formatDate,
  generateId,
};
