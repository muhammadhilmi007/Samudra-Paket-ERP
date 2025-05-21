"use client";

import React, { forwardRef } from 'react';
import cn from 'classnames';

/**
 * Radio Component
 * A reusable radio button input with consistent styling and behavior
 * 
 * @param {Object} props - Component props
 * @param {string} [props.id] - Unique identifier for the radio button
 * @param {string} [props.name] - Name attribute for the radio button group
 * @param {string} [props.value] - Value of the radio button
 * @param {string} [props.label] - Label text to display next to the radio button
 * @param {boolean} [props.checked] - Whether the radio button is checked
 * @param {Function} [props.onChange] - Change event handler
 * @param {boolean} [props.disabled] - Whether the radio button is disabled
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.rest] - Additional props to spread to the input element
 */
const Radio = forwardRef(({
  id,
  name,
  value,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  ...rest
}, ref) => {
  const radioId = id || `radio-${name || 'input'}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={radioId}
          name={name}
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            'h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500',
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
          htmlFor={radioId}
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

Radio.displayName = 'Radio';

export default Radio;
