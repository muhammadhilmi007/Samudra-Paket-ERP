"use client";

import React, { forwardRef } from 'react';
import cn from 'classnames';

/**
 * Select Component
 * A reusable select dropdown with consistent styling and behavior
 * 
 * @param {Object} props - Component props
 * @param {string} [props.id] - Unique identifier for the select
 * @param {string} [props.name] - Name attribute for the select
 * @param {string} [props.label] - Label text to display above the select
 * @param {Array} [props.options=[]] - Array of options for the select
 * @param {string} [props.value] - The currently selected value
 * @param {Function} [props.onChange] - Change event handler
 * @param {boolean} [props.required] - Whether the select is required
 * @param {boolean} [props.disabled] - Whether the select is disabled
 * @param {string} [props.placeholder] - Placeholder text when no option is selected
 * @param {string} [props.error] - Error message to display below the select
 * @param {string} [props.helperText] - Helper text to display below the select
 * @param {string} [props.className] - Additional CSS classes for the wrapper
 * @param {Object} [props.selectProps] - Additional props to spread to the select element
 */
const Select = forwardRef(({
  id,
  name,
  label,
  options = [],
  value = '',
  onChange,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  error,
  helperText,
  className = '',
  ...selectProps
}, ref) => {
  const selectId = id || `select-${name || 'input'}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            {
              'border-red-500 focus:ring-red-500 focus:border-red-500': error,
              'border-gray-300': !error,
              'bg-gray-100 opacity-50 cursor-not-allowed': disabled,
              'bg-white': !disabled,
            }
          )}
          {...selectProps}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
