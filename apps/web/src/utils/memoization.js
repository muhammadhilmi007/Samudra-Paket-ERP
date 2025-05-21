"use client";

/**
 * Memoization Utilities
 * Provides utilities for memoizing components and functions
 */

import { memo, useCallback, useMemo } from 'react';

/**
 * Creates a memoized component with custom comparison function
 * @param {React.Component} Component - Component to memoize
 * @param {Function} areEqual - Custom comparison function (optional)
 * @returns {React.Component} - Memoized component
 */
export function memoWithName(Component, areEqual) {
  const MemoizedComponent = memo(Component, areEqual);
  // Preserve the display name for debugging
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name || 'Component'})`;
  return MemoizedComponent;
}

/**
 * Creates a stable callback function that only changes when dependencies change
 * @param {Function} callback - Callback function
 * @param {Array} dependencies - Dependencies array
 * @returns {Function} - Memoized callback function
 */
export function stableCallback(callback, dependencies) {
  return useCallback(callback, dependencies);
}

/**
 * Creates a memoized value that only recalculates when dependencies change
 * @param {Function} factory - Factory function that returns the value
 * @param {Array} dependencies - Dependencies array
 * @returns {any} - Memoized value
 */
export function stableValue(factory, dependencies) {
  return useMemo(factory, dependencies);
}

/**
 * Creates a deep comparison function for React.memo
 * Useful for components with complex props
 * @returns {Function} - Deep comparison function
 */
export function createDeepEqualityCheck() {
  return (prevProps, nextProps) => {
    // Compare each prop deeply
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);
    
    if (prevKeys.length !== nextKeys.length) return false;
    
    return prevKeys.every(key => {
      const prevVal = prevProps[key];
      const nextVal = nextProps[key];
      
      if (typeof prevVal === 'function' && typeof nextVal === 'function') {
        // Functions are considered equal (they're likely stable due to useCallback)
        return true;
      }
      
      if (prevVal === nextVal) return true;
      
      if (
        typeof prevVal === 'object' && 
        prevVal !== null && 
        typeof nextVal === 'object' && 
        nextVal !== null
      ) {
        // Deep comparison for objects and arrays
        const prevValKeys = Object.keys(prevVal);
        const nextValKeys = Object.keys(nextVal);
        
        if (prevValKeys.length !== nextValKeys.length) return false;
        
        return prevValKeys.every(k => prevVal[k] === nextVal[k]);
      }
      
      return false;
    });
  };
}
