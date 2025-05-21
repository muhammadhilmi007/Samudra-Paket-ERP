"use client";

import React, { forwardRef } from 'react';
import cn from 'classnames';

/**
 * Checkbox Component
 * A reusable checkbox input with consistent styling and behavior
 * 
 * @param {Object} props - Component props
 * @param {string} [props.id] - Unique identifier for the checkbox
 * @param {string} [props.name] - Name attribute for the checkbox
 * @param {string} [props.label] - Label text to display next to the checkbox
 * @param {boolean} [props.checked] - Whether the checkbox is checked
 * @param {Function} [props.onChange] - Change event handler
 * @param {boolean} [props.disabled] - Whether the checkbox is disabled
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.rest] - Additional props to spread to the input element
 */
const Checkbox = forwardRef(({
  id,
  name,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  ...rest
}, ref) => {
  const checkboxId = id || `checkbox-${name || 'input'}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={checkboxId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500',
            {
              'opacity-50 cursor-not-allowed': disabled,
              'cursor-pointer': !disabled,
            }
          )}
          {...rest}
        />
      </div>
      {label && (
        <label
          htmlFor={checkboxId}
          className={cn('ml-2 block text-sm text-gray-900', {
            'opacity-50 cursor-not-allowed': disabled,
            'cursor-pointer': !disabled,
          })}
        >
          {label}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
