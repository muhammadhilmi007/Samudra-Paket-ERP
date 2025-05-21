"use client";

import React from 'react';
import PropTypes from 'prop-types';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'classnames';
import Button from '../../atoms/Button';

/**
 * Form Component
 * A reusable form component that integrates with React Hook Form and Zod validation
 */
const Form = ({
  defaultValues = {},
  schema,
  onSubmit,
  onError,
  children,
  className = '',
  submitButtonText = 'Submit',
  resetButtonText = 'Reset',
  showResetButton = false,
  loading = false,
  disabled = false,
  autoComplete = 'off',
  id,
  buttonContainerClassName = '',
  submitButtonClassName = '',
  resetButtonClassName = '',
  submitButtonProps = {},
  resetButtonProps = {},
}) => {
  // Initialize form with React Hook Form
  const methods = useForm({
    defaultValues,
    resolver: schema ? zodResolver(schema) : undefined,
    mode: 'onBlur',
  });

  // Handle form submission
  const handleSubmit = async (data) => {
    try {
      await onSubmit(data, methods);
    } catch (error) {
      console.error('Form submission error:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  // Handle form reset
  const handleReset = () => {
    methods.reset(defaultValues);
  };

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        className={cn('space-y-6', className)}
        onSubmit={methods.handleSubmit(handleSubmit)}
        autoComplete={autoComplete}
        noValidate
      >
        {/* Form fields */}
        {typeof children === 'function'
          ? children({
              formState: methods.formState,
              register: methods.register,
              control: methods.control,
              setValue: methods.setValue,
              getValues: methods.getValues,
              watch: methods.watch,
              reset: methods.reset,
              trigger: methods.trigger,
              clearErrors: methods.clearErrors,
              setError: methods.setError,
              resetField: methods.resetField,
              unregister: methods.unregister,
            })
          : children}

        {/* Form buttons */}
        <div className={cn('flex items-center justify-end space-x-4', buttonContainerClassName)}>
          {showResetButton && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={disabled || loading}
              className={resetButtonClassName}
              {...resetButtonProps}
            >
              {resetButtonText}
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={disabled}
            className={submitButtonClassName}
            {...submitButtonProps}
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

Form.propTypes = {
  /**
   * Default values for the form fields
   */
  defaultValues: PropTypes.object,
  /**
   * Zod schema for form validation
   */
  schema: PropTypes.object,
  /**
   * Callback function when the form is submitted
   * @param {Object} data - Form data
   * @param {Object} methods - React Hook Form methods
   * @returns {Promise|void}
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * Callback function when an error occurs during submission
   * @param {Error} error - The error that occurred
   */
  onError: PropTypes.func,
  /**
   * Form fields and content
   * Can be a function that receives form methods or JSX
   */
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  /**
   * Additional CSS classes for the form
   */
  className: PropTypes.string,
  /**
   * Text for the submit button
   */
  submitButtonText: PropTypes.string,
  /**
   * Text for the reset button
   */
  resetButtonText: PropTypes.string,
  /**
   * Whether to show the reset button
   */
  showResetButton: PropTypes.bool,
  /**
   * Whether the form is in a loading state
   */
  loading: PropTypes.bool,
  /**
   * Whether the form is disabled
   */
  disabled: PropTypes.bool,
  /**
   * HTML autocomplete attribute
   */
  autoComplete: PropTypes.string,
  /**
   * HTML id attribute for the form
   */
  id: PropTypes.string,
  /**
   * Additional CSS classes for the button container
   */
  buttonContainerClassName: PropTypes.string,
  /**
   * Additional CSS classes for the submit button
   */
  submitButtonClassName: PropTypes.string,
  /**
   * Additional CSS classes for the reset button
   */
  resetButtonClassName: PropTypes.string,
  /**
   * Additional props for the submit button
   */
  submitButtonProps: PropTypes.object,
  /**
   * Additional props for the reset button
   */
  resetButtonProps: PropTypes.object,
};

export default Form;
