/**
 * Common Utilities
 * General utility functions for working with data, arrays, and objects
 */

/**
 * Generate a unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
export const generateId = (prefix = '') => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}${random}`;
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Failed to deep clone object:', error);
    return { ...obj };
  }
};

/**
 * Check if an object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} Whether the object is empty
 */
export const isEmptyObject = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

/**
 * Remove empty values from an object
 * @param {Object} obj - Object to clean
 * @returns {Object} Object without empty values
 */
export const removeEmptyValues = (obj) => {
  if (!obj) return {};
  
  const result = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      result[key] = value;
    }
  });
  
  return result;
};

/**
 * Group an array of objects by a key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  if (!array || !Array.isArray(array)) return {};
  
  return array.reduce((result, item) => {
    const groupKey = item[key];
    
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Sort an array of objects by a key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export const sortBy = (array, key, direction = 'asc') => {
  if (!array || !Array.isArray(array)) return [];
  
  const sortedArray = [...array];
  
  sortedArray.sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA === valueB) return 0;
    
    if (valueA === null || valueA === undefined) return direction === 'asc' ? -1 : 1;
    if (valueB === null || valueB === undefined) return direction === 'asc' ? 1 : -1;
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    return direction === 'asc'
      ? valueA - valueB
      : valueB - valueA;
  });
  
  return sortedArray;
};

/**
 * Filter an array of objects by a search term
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} keys - Keys to search in
 * @returns {Array} Filtered array
 */
export const filterBySearchTerm = (array, searchTerm, keys) => {
  if (!array || !Array.isArray(array) || !searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  
  return array.filter((item) => {
    return keys.some((key) => {
      const value = item[key];
      
      if (value === null || value === undefined) return false;
      
      return String(value).toLowerCase().includes(term);
    });
  });
};

/**
 * Paginate an array
 * @param {Array} array - Array to paginate
 * @param {number} page - Current page (1-based)
 * @param {number} pageSize - Page size
 * @returns {Object} Pagination result
 */
export const paginate = (array, page = 1, pageSize = 10) => {
  if (!array || !Array.isArray(array)) return { data: [], pagination: { page, pageSize, totalItems: 0, totalPages: 0 } };
  
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = array.slice(startIndex, startIndex + pageSize);
  
  return {
    data: paginatedItems,
    pagination: {
      page,
      pageSize,
      totalItems: array.length,
      totalPages: Math.ceil(array.length / pageSize),
    },
  };
};

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Get a nested value from an object using a path
 * @param {Object} obj - Object to get value from
 * @param {string} path - Path to the value (e.g., 'user.address.city')
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} Value at path or default value
 */
export const getNestedValue = (obj, path, defaultValue = undefined) => {
  if (!obj || !path) return defaultValue;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object') {
      return defaultValue;
    }
    
    result = result[key];
  }
  
  return result === undefined ? defaultValue : result;
};

/**
 * Set a nested value in an object using a path
 * @param {Object} obj - Object to set value in
 * @param {string} path - Path to the value (e.g., 'user.address.city')
 * @param {*} value - Value to set
 * @returns {Object} Updated object
 */
export const setNestedValue = (obj, path, value) => {
  if (!obj || !path) return obj;
  
  const result = { ...obj };
  const keys = path.split('.');
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
};
