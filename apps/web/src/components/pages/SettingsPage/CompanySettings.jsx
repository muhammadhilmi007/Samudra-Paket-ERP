"use client";

import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormField } from '../../organisms/Form';
import FileUpload from '../../molecules/FileUpload';
import { z } from 'zod';

/**
 * CompanySettings Component
 * Company profile settings like name, address, logo, and contact information
 */
const CompanySettings = ({
  settings = {},
  onUpdate,
  loading = false,
}) => {
  // Validation schema
  const companySettingsSchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    legalName: z.string().optional(),
    taxId: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  });

  // Handle form submission
  const handleSubmit = async (data) => {
    if (onUpdate) {
      await onUpdate(data);
    }
  };

  // Handle logo upload
  const handleLogoUpload = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (onUpdate) {
          onUpdate({
            ...settings,
            logo: e.target.result,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Company Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure your company profile information.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Company Logo</h3>
        <div className="flex items-center space-x-6">
          {settings.logo && (
            <div className="w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
              <img 
                src={settings.logo} 
                alt="Company Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          
          <div className="flex-1">
            <FileUpload
              value={[]}
              onChange={handleLogoUpload}
              accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.svg'] }}
              maxSize={2 * 1024 * 1024} // 2MB
              maxFiles={1}
              multiple={false}
              buttonText="Upload Logo"
              description="Upload your company logo"
              helperText="Recommended size: 512x512px. Max 2MB. PNG, JPG, or SVG."
            />
          </div>
        </div>
      </div>

      <Form
        defaultValues={{
          name: settings.name || '',
          legalName: settings.legalName || '',
          taxId: settings.taxId || '',
          email: settings.email || '',
          phone: settings.phone || '',
          website: settings.website || '',
          address: settings.address || '',
          city: settings.city || '',
          state: settings.state || '',
          zipCode: settings.zipCode || '',
          country: settings.country || '',
        }}
        schema={companySettingsSchema}
        onSubmit={handleSubmit}
        loading={loading}
        className="space-y-6"
      >
        {({ control }) => (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="name"
                label="Company Name"
                type="text"
                required
                control={control}
                helperText="The name displayed throughout the application"
              />
              
              <FormField
                name="legalName"
                label="Legal Name"
                type="text"
                control={control}
                helperText="The registered legal name of your company"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="taxId"
                label="Tax ID / NPWP"
                type="text"
                control={control}
                helperText="Your company's tax identification number"
              />
              
              <FormField
                name="email"
                label="Company Email"
                type="email"
                control={control}
                helperText="Primary contact email for your company"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="phone"
                label="Company Phone"
                type="tel"
                control={control}
                helperText="Primary contact phone for your company"
              />
              
              <FormField
                name="website"
                label="Website"
                type="url"
                control={control}
                helperText="Your company's website URL"
              />
            </div>
            
            <FormField
              name="address"
              label="Address"
              type="text"
              control={control}
              helperText="Street address"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                name="city"
                label="City"
                type="text"
                control={control}
              />
              
              <FormField
                name="state"
                label="State/Province"
                type="text"
                control={control}
              />
              
              <FormField
                name="zipCode"
                label="ZIP/Postal Code"
                type="text"
                control={control}
              />
            </div>
            
            <FormField
              name="country"
              label="Country"
              type="select"
              control={control}
              options={[
                { value: 'indonesia', label: 'Indonesia' },
                { value: 'malaysia', label: 'Malaysia' },
                { value: 'singapore', label: 'Singapore' },
                { value: 'thailand', label: 'Thailand' },
                { value: 'vietnam', label: 'Vietnam' },
              ]}
            />
          </>
        )}
      </Form>
    </div>
  );
};

CompanySettings.propTypes = {
  /**
   * Company settings data
   */
  settings: PropTypes.shape({
    name: PropTypes.string,
    legalName: PropTypes.string,
    taxId: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string,
    logo: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipCode: PropTypes.string,
    country: PropTypes.string,
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

export default CompanySettings;
