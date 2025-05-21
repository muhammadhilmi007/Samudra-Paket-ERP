"use client";

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, UserIcon, KeyIcon, CameraIcon } from '@heroicons/react/24/outline';
import { Form, FormField } from '../../organisms/Form';
import { Tabs } from '../../molecules/Tabs';
import Avatar from '../../atoms/Avatar';
import Button from '../../atoms/Button';
import FileUpload from '../../molecules/FileUpload';
import { z } from 'zod';

/**
 * ProfilePage Component
 * A user profile page with personal information, security settings, and preferences
 */
const ProfilePage = ({
  user = {},
  onUpdate,
  loading = false,
  className = '',
}) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('personal');
  
  // State for profile image
  const [profileImage, setProfileImage] = useState(user.profileImage || null);
  
  // Validation schemas
  const personalInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  });

  const securitySchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

  const preferencesSchema = z.object({
    language: z.string(),
    timezone: z.string(),
    notifications: z.object({
      email: z.boolean(),
      sms: z.boolean(),
      app: z.boolean(),
    }),
    theme: z.string(),
  });

  // Handle personal info form submission
  const handlePersonalInfoSubmit = async (data) => {
    if (onUpdate) {
      await onUpdate({
        ...user,
        ...data,
        profileImage,
      });
    }
  };

  // Handle security form submission
  const handleSecuritySubmit = async (data) => {
    if (onUpdate) {
      await onUpdate({
        ...user,
        password: data.newPassword,
      });
    }
  };

  // Handle preferences form submission
  const handlePreferencesSubmit = async (data) => {
    if (onUpdate) {
      await onUpdate({
        ...user,
        preferences: data,
      });
    }
  };

  // Handle profile image upload
  const handleProfileImageUpload = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // In a real app, you would upload the file to a server here
      if (onUpdate) {
        // Simulate update with the new image
        onUpdate({
          ...user,
          profileImage: URL.createObjectURL(file),
        });
      }
    }
  };

  // Render personal info tab
  const renderPersonalInfoTab = () => {
    return (
      <Form
        defaultValues={{
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          city: user.city || '',
          state: user.state || '',
          zipCode: user.zipCode || '',
          country: user.country || '',
        }}
        schema={personalInfoSchema}
        onSubmit={handlePersonalInfoSubmit}
        loading={loading}
        className="space-y-6"
      >
        {({ control }) => (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="firstName"
                label="First Name"
                type="text"
                required
                control={control}
              />
              <FormField
                name="lastName"
                label="Last Name"
                type="text"
                required
                control={control}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="email"
                label="Email"
                type="email"
                required
                control={control}
                icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
              />
              <FormField
                name="phone"
                label="Phone"
                type="tel"
                control={control}
                icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
              />
            </div>
            
            <FormField
              name="address"
              label="Address"
              type="text"
              control={control}
              icon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
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
    );
  };

  // Render security tab
  const renderSecurityTab = () => {
    return (
      <Form
        defaultValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        schema={securitySchema}
        onSubmit={handleSecuritySubmit}
        loading={loading}
        className="space-y-6"
      >
        {({ control }) => (
          <>
            <FormField
              name="currentPassword"
              label="Current Password"
              type="password"
              required
              control={control}
              icon={<KeyIcon className="h-5 w-5 text-gray-400" />}
            />
            
            <FormField
              name="newPassword"
              label="New Password"
              type="password"
              required
              control={control}
              icon={<KeyIcon className="h-5 w-5 text-gray-400" />}
              helperText="Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
            />
            
            <FormField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              required
              control={control}
              icon={<KeyIcon className="h-5 w-5 text-gray-400" />}
            />
          </>
        )}
      </Form>
    );
  };

  // Render preferences tab
  const renderPreferencesTab = () => {
    return (
      <Form
        defaultValues={{
          language: user.preferences?.language || 'en',
          timezone: user.preferences?.timezone || 'Asia/Jakarta',
          notifications: {
            email: user.preferences?.notifications?.email !== false,
            sms: user.preferences?.notifications?.sms || false,
            app: user.preferences?.notifications?.app !== false,
          },
          theme: user.preferences?.theme || 'light',
        }}
        schema={preferencesSchema}
        onSubmit={handlePreferencesSubmit}
        loading={loading}
        className="space-y-6"
      >
        {({ control }) => (
          <>
            <FormField
              name="language"
              label="Language"
              type="select"
              control={control}
              options={[
                { value: 'en', label: 'English' },
                { value: 'id', label: 'Indonesian' },
              ]}
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
            />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
              
              <FormField
                name="notifications.email"
                type="checkbox"
                checkboxLabel="Email Notifications"
                control={control}
                helperText="Receive notifications via email"
              />
              
              <FormField
                name="notifications.sms"
                type="checkbox"
                checkboxLabel="SMS Notifications"
                control={control}
                helperText="Receive notifications via SMS"
              />
              
              <FormField
                name="notifications.app"
                type="checkbox"
                checkboxLabel="App Notifications"
                control={control}
                helperText="Receive in-app notifications"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Theme</h3>
              
              <div className="flex space-x-4">
                <FormField
                  name="theme"
                  type="radio"
                  value="light"
                  label="Light"
                  control={control}
                />
                
                <FormField
                  name="theme"
                  type="radio"
                  value="dark"
                  label="Dark"
                  control={control}
                />
                
                <FormField
                  name="theme"
                  type="radio"
                  value="system"
                  label="System"
                  control={control}
                />
              </div>
            </div>
          </>
        )}
      </Form>
    );
  };

  return (
    <div className={`max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile header */}
        <div className="bg-primary-600 h-32"></div>
        
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12 mb-6 sm:space-x-5">
            <div className="relative">
              <Avatar 
                src={profileImage} 
                alt={`${user.firstName} ${user.lastName}`} 
                size="xl" 
                className="border-4 border-white shadow-md"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-primary-500 text-white p-1 rounded-full shadow-md"
                onClick={() => document.getElementById('profile-image-upload').click()}
              >
                <CameraIcon className="h-4 w-4" />
              </button>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleProfileImageUpload(e.target.files)}
              />
            </div>
            
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-gray-500">
                {user.role || 'User'} • {user.email}
              </p>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs
            defaultActiveKey={activeTab}
            onChange={setActiveTab}
            className="mb-6"
          >
            <Tabs.Tab key="personal" tab="Personal Information">
              {renderPersonalInfoTab()}
            </Tabs.Tab>
            <Tabs.Tab key="security" tab="Security">
              {renderSecurityTab()}
            </Tabs.Tab>
            <Tabs.Tab key="preferences" tab="Preferences">
              {renderPreferencesTab()}
            </Tabs.Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  /**
   * User data
   */
  user: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipCode: PropTypes.string,
    country: PropTypes.string,
    role: PropTypes.string,
    profileImage: PropTypes.string,
    preferences: PropTypes.shape({
      language: PropTypes.string,
      timezone: PropTypes.string,
      notifications: PropTypes.shape({
        email: PropTypes.bool,
        sms: PropTypes.bool,
        app: PropTypes.bool,
      }),
      theme: PropTypes.string,
    }),
  }),
  /**
   * Callback when user data is updated
   */
  onUpdate: PropTypes.func,
  /**
   * Whether the page is in a loading state
   */
  loading: PropTypes.bool,
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
};

export default ProfilePage;
