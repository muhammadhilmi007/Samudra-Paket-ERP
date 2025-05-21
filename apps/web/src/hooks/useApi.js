/**
 * useApi Hook
 * Custom hook for handling API requests with loading and error states
 */

import { useState, useCallback } from 'react';

/**
 * Custom hook for handling API requests with loading and error states
 * 
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Hook options
 * @param {boolean} options.loadingInitial - Initial loading state
 * @param {Function} options.onSuccess - Callback function on success
 * @param {Function} options.onError - Callback function on error
 * @returns {Object} - API request handler, loading state, error state, and reset function
 */
const useApi = (apiFunction, { loadingInitial = false, onSuccess, onError } = {}) => {
  const [loading, setLoading] = useState(loadingInitial);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await apiFunction(...args);
        setData(result);
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        
        if (onError) {
          onError(err);
        }
        
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    loading,
    error,
    data,
    reset,
  };
};

export default useApi;
