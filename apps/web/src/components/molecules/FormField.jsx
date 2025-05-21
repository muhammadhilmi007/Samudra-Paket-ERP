"use client";

/**
 * FormField Component
 * Combines label, input, and error message with React Hook Form integration
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../atoms/Input';

const FormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  className = '',
  register: externalRegister,
  error: externalError,
  ...props
}) => {
  // Try to use form context if available
  const formContext = useFormContext();
  
  // If we have external register and error props, use those (for standalone usage)
  // Otherwise use the form context if available
  const register = externalRegister || (formContext?.register ? formContext.register : () => ({}));
  const error = externalError || (formContext?.formState?.errors?.[name]?.message);

  return (
    <Input
      {...register(name)}
      id={name}
      name={name}
      label={label}
      type={type}
      placeholder={placeholder}
      error={error}
      required={required}
      className={className}
      {...props}
    />
  );
};

export default FormField;
