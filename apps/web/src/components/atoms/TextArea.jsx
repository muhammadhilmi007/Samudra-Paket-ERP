"use client";

import React, { forwardRef } from 'react';
import cn from 'classnames';

/**
 * TextArea Component
 * A reusable multi-line text input with consistent styling and behavior
 * 
 * @param {Object} props - Component props
 * @param {string} [props.id] - Unique identifier for the textarea
 * @param {string} [props.name] - Name attribute for the textarea
 * @param {string} [props.label] - Label text to display above the textarea
 * @param {string} [props.value] - The current value of the textarea
 * @param {Function} [props.onChange] - Change event handler
 * @param {boolean} [props.required] - Whether the textarea is required
 * @param {boolean} [props.disabled] - Whether the textarea is disabled
 * @param {string} [props.placeholder] - Placeholder text when the textarea is empty
 * @param {number} [props.rows=3] - Number of visible text lines
 * @param {string} [props.error] - Error message to display below the textarea
 * @param {string} [props.helperText] - Helper text to display below the textarea
 * @param {string} [props.className] - Additional CSS classes for the wrapper
 * @param {Object} [props.textareaProps] - Additional props to spread to the textarea element
 */
const TextArea = forwardRef(({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = '',
  rows = 3,
  error,
  helperText,
  className = '',
  ...textareaProps
}, ref) => {
  const textareaId = id || `textarea-${name || 'input'}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label 
          htmlFor={textareaId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="mt-1">
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
            'py-2 px-3 border',
            {
              'border-red-500 focus:ring-red-500': error,
              'border-gray-300': !error,
              'bg-gray-100 opacity-50 cursor-not-allowed': disabled,
              'bg-white': !disabled,
            }
          )}
          {...textareaProps}
        />
      </div>
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
