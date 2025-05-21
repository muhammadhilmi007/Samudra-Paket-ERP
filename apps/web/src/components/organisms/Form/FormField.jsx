"use client";

import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import cn from 'classnames';
import Input from '../../atoms/Input';
import Select from '../../atoms/Select';
import Checkbox from '../../atoms/Checkbox';
import Radio from '../../atoms/Radio';
import TextArea from '../../atoms/TextArea';
import DatePicker from '../../molecules/DatePicker';
import FileUpload from '../../molecules/FileUpload';

/**
 * FormField Component
 * A flexible form field component that integrates with React Hook Form
 * and renders the appropriate input type based on the field type
 */
const FormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  helperText,
  required = false,
  disabled = false,
  className = '',
  options = [],
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  helperTextClassName = '',
  rules = {},
  defaultValue,
  onChange,
  ...props
}) => {
  // Get form context from React Hook Form
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  // Get error message for the field
  const errorMessage = errors[name]?.message;

  // Render label
  const renderLabel = () => {
    if (!label) return null;

    return (
      <label
        htmlFor={name}
        className={cn('block text-sm font-medium text-gray-700 mb-1', labelClassName)}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  };

  // Render error message
  const renderError = () => {
    if (!errorMessage) return null;

    return (
      <p className={cn('mt-1 text-sm text-red-600', errorClassName)}>
        {errorMessage}
      </p>
    );
  };

  // Render helper text
  const renderHelperText = () => {
    if (!helperText || errorMessage) return null;

    return (
      <p className={cn('mt-1 text-xs text-gray-500', helperTextClassName)}>
        {helperText}
      </p>
    );
  };

  // Render different field types
  const renderField = () => {
    // Common props for all field types
    const commonProps = {
      id: name,
      name,
      disabled,
      placeholder,
      ...props,
    };

    // For simple input types, use register
    if (['text', 'email', 'password', 'number', 'tel', 'url', 'search'].includes(type)) {
      return (
        <Input
          {...commonProps}
          {...register(name, rules)}
          type={type}
          error={errorMessage}
          className={inputClassName}
          onChange={(e) => {
            register(name).onChange(e);
            if (onChange) onChange(e);
          }}
        />
      );
    }

    // For complex components, use Controller
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => {
          // Merge onChange handlers
          const handleChange = (value) => {
            field.onChange(value);
            if (onChange) onChange(value);
          };

          // Common controlled props
          const controlledProps = {
            ...commonProps,
            ...field,
            onChange: handleChange,
            error: errorMessage,
            className: inputClassName,
          };

          switch (type) {
            case 'select':
              return (
                <Select
                  {...controlledProps}
                  options={options}
                />
              );
            case 'checkbox':
              return (
                <Checkbox
                  {...controlledProps}
                  checked={field.value}
                  label={props.checkboxLabel || label}
                />
              );
            case 'radio':
              return (
                <div className="space-y-2">
                  {options.map((option) => (
                    <Radio
                      key={option.value}
                      {...commonProps}
                      id={`${name}-${option.value}`}
                      value={option.value}
                      checked={field.value === option.value}
                      onChange={() => handleChange(option.value)}
                      label={option.label}
                    />
                  ))}
                </div>
              );
            case 'textarea':
              return (
                <TextArea
                  {...controlledProps}
                />
              );
            case 'date':
              return (
                <DatePicker
                  {...controlledProps}
                  selected={field.value}
                />
              );
            case 'file':
              return (
                <FileUpload
                  {...controlledProps}
                  value={field.value || []}
                />
              );
            default:
              return (
                <Input
                  {...controlledProps}
                  type="text"
                />
              );
          }
        }}
      />
    );
  };

  return (
    <div className={cn('w-full', containerClassName, className)}>
      {renderLabel()}
      {renderField()}
      {renderError()}
      {renderHelperText()}
    </div>
  );
};

FormField.propTypes = {
  /**
   * Name of the form field (used for registration with React Hook Form)
   */
  name: PropTypes.string.isRequired,
  /**
   * Label text for the field
   */
  label: PropTypes.node,
  /**
   * Type of the form field
   */
  type: PropTypes.oneOf([
    'text',
    'email',
    'password',
    'number',
    'tel',
    'url',
    'search',
    'select',
    'checkbox',
    'radio',
    'textarea',
    'date',
    'file',
  ]),
  /**
   * Placeholder text for the field
   */
  placeholder: PropTypes.string,
  /**
   * Helper text to display below the field
   */
  helperText: PropTypes.node,
  /**
   * Whether the field is required
   */
  required: PropTypes.bool,
  /**
   * Whether the field is disabled
   */
  disabled: PropTypes.bool,
  /**
   * Additional CSS classes for the field container
   */
  className: PropTypes.string,
  /**
   * Options for select, radio, or checkbox group fields
   */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      label: PropTypes.node,
    })
  ),
  /**
   * Additional CSS classes for the field container
   */
  containerClassName: PropTypes.string,
  /**
   * Additional CSS classes for the label
   */
  labelClassName: PropTypes.string,
  /**
   * Additional CSS classes for the input
   */
  inputClassName: PropTypes.string,
  /**
   * Additional CSS classes for the error message
   */
  errorClassName: PropTypes.string,
  /**
   * Additional CSS classes for the helper text
   */
  helperTextClassName: PropTypes.string,
  /**
   * Validation rules for React Hook Form
   */
  rules: PropTypes.object,
  /**
   * Default value for the field
   */
  defaultValue: PropTypes.any,
  /**
   * Callback function when the field value changes
   */
  onChange: PropTypes.func,
  /**
   * Label text for checkbox (when type is 'checkbox')
   */
  checkboxLabel: PropTypes.node,
};

export default FormField;
