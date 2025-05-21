/**
 * useZodForm Hook
 * Custom hook for form handling with React Hook Form and Zod validation
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Custom hook that combines React Hook Form with Zod validation
 * 
 * @param {Object} options - Form options
 * @param {Object} options.schema - Zod schema for validation
 * @param {Object} options.defaultValues - Default values for the form
 * @param {Object} options.mode - Form validation mode
 * @returns {Object} - React Hook Form methods and state
 */
const useZodForm = ({ schema, defaultValues = {}, mode = 'onSubmit', ...formOptions }) => {
  const methods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
    mode,
    ...formOptions,
  });

  return {
    ...methods,
    formState: {
      ...methods.formState,
    },
  };
};

export default useZodForm;
