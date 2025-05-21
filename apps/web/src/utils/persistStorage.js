/**
 * Custom storage adapter for Redux Persist
 * Safely handles both server-side and client-side environments
 */

// Create a custom storage object that safely checks for window/localStorage
const createNoopStorage = () => {
  return {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  };
};

// Create a storage that works in both browser and server environments
const createSafeStorage = () => {
  // Check if window is defined (client-side)
  if (typeof window === 'undefined') {
    return createNoopStorage();
  }
  
  // Use localStorage on the client side
  return {
    getItem: (key) => {
      return new Promise((resolve) => {
        resolve(localStorage.getItem(key));
      });
    },
    setItem: (key, item) => {
      return new Promise((resolve) => {
        resolve(localStorage.setItem(key, item));
      });
    },
    removeItem: (key) => {
      return new Promise((resolve) => {
        resolve(localStorage.removeItem(key));
      });
    },
  };
};

export default createSafeStorage();
