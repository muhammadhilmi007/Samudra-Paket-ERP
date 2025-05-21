"use client";

import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormField } from '../../organisms/Form';
import { z } from 'zod';

/**
 * GeneralSettings Component
 * General application settings like language, timezone, and date formats
 */
const GeneralSettings = ({
  settings = {},
  onUpdate,
  loading = false,
}) => {
  // Validation schema
  const generalSettingsSchema = z.object({
    language: z.string(),
    timezone: z.string(),
    dateFormat: z.string(),
    timeFormat: z.string(),
    currency: z.string(),
    fiscalYearStart: z.string(),
  });

  // Handle form submission
  const handleSubmit = async (data) => {
    if (onUpdate) {
      await onUpdate(data);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure general application settings like language, timezone, and date formats.
        </p>
      </div>

      <Form
        defaultValues={{
          language: settings.language || 'en',
          timezone: settings.timezone || 'Asia/Jakarta',
          dateFormat: settings.dateFormat || 'MM/DD/YYYY',
          timeFormat: settings.timeFormat || '24h',
          currency: settings.currency || 'IDR',
          fiscalYearStart: settings.fiscalYearStart || '01-01',
        }}
        schema={generalSettingsSchema}
        onSubmit={handleSubmit}
        loading={loading}
        className="space-y-6"
      >
        {({ control }) => (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="language"
                label="Language"
                type="select"
                control={control}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'id', label: 'Indonesian' },
                ]}
                helperText="Default language for the application"
              />
              
              <FormField
                name="timezone"
                label="Timezone"
                type="select"
                control={control}
                options={[
                  { value: 'Asia/Jakarta', label: 'Jakarta (GMT+7)' },
                  { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
                  { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur (GMT+8)' },
                  { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)' },
                ]}
                helperText="Default timezone for the application"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="dateFormat"
                label="Date Format"
                type="select"
                control={control}
                options={[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]}
                helperText="Format for displaying dates"
              />
              
              <FormField
                name="timeFormat"
                label="Time Format"
                type="select"
                control={control}
                options={[
                  { value: '12h', label: '12-hour (AM/PM)' },
                  { value: '24h', label: '24-hour' },
                ]}
                helperText="Format for displaying times"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="currency"
                label="Default Currency"
                type="select"
                control={control}
                options={[
                  { value: 'IDR', label: 'Indonesian Rupiah (IDR)' },
                  { value: 'MYR', label: 'Malaysian Ringgit (MYR)' },
                  { value: 'SGD', label: 'Singapore Dollar (SGD)' },
                  { value: 'THB', label: 'Thai Baht (THB)' },
                  { value: 'USD', label: 'US Dollar (USD)' },
                ]}
                helperText="Default currency for financial calculations"
              />
              
              <FormField
                name="fiscalYearStart"
                label="Fiscal Year Start"
                type="select"
                control={control}
                options={[
                  { value: '01-01', label: 'January 1' },
                  { value: '04-01', label: 'April 1' },
                  { value: '07-01', label: 'July 1' },
                  { value: '10-01', label: 'October 1' },
                ]}
                helperText="Start date of the fiscal year"
              />
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

GeneralSettings.propTypes = {
  /**
   * General settings data
   */
  settings: PropTypes.shape({
    language: PropTypes.string,
    timezone: PropTypes.string,
    dateFormat: PropTypes.string,
    timeFormat: PropTypes.string,
    currency: PropTypes.string,
    fiscalYearStart: PropTypes.string,
  }),
  /**
   * Callback when settings are updated
   */
  onUpdate: PropTypes.func,
  /**
   * Whether the component is in a loading state
   */
  loading: PropTypes.bool,
};

export default GeneralSettings;
