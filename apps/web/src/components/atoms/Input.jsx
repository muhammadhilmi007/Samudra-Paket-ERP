"use client";

/**
 * Input Component
 * Base input component with various states and validation
 */

import React, { forwardRef } from 'react';

const Input = forwardRef(({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  error,
  className = '',
  disabled = false,
  required = false,
  helperText,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id || name} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id || name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          disabled:opacity-50 disabled:bg-gray-100
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
