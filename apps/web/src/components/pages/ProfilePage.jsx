"use client";

/**
 * ProfilePage Component
 * User profile management page with avatar upload
 */

import React, { useState, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { 
  useGetProfileQuery, 
  useUpdateProfileMutation,
  useChangePasswordMutation 
} from '../../store/api/authApi';
import { selectCurrentUser } from '../../store/slices/authSlice';
import DashboardLayout from '../templates/DashboardLayout';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import Tabs from '../molecules/Tabs';
import { createNotificationHandler } from '../../utils/notificationUtils';
import { useDispatch } from 'react-redux';

// Profile validation schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  position: z.string().optional(),
});

// Password change validation schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const ProfilePage = () => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  const user = useSelector(selectCurrentUser);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  
  // RTK Query hooks
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  // Profile form
  const profileMethods = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      position: user?.position || '',
    },
  });
  
  // Password form
  const passwordMethods = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  // Update form values when profile data is loaded
  React.useEffect(() => {
    if (profileData) {
      profileMethods.reset({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        position: profileData.position || '',
      });
    }
  }, [profileData, profileMethods]);
  
  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      notifications.error('Please upload an image file');
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      notifications.error('Image size should be less than 2MB');
      return;
    }
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Store file for upload
    setAvatarFile(file);
  };
  
  // Handle profile update
  const handleProfileSubmit = async (data) => {
    try {
      // Create form data for multipart/form-data request
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone || '');
      formData.append('position', data.position || '');
      
      // Add avatar if changed
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      await updateProfile(formData).unwrap();
      notifications.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update failed:', error);
      notifications.error(error?.data?.message || 'Failed to update profile');
    }
  };
  
  // Handle password change
  const handlePasswordSubmit = async (data) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      
      notifications.success('Password changed successfully');
      passwordMethods.reset();
    } catch (error) {
      console.error('Password change failed:', error);
      notifications.error(error?.data?.message || 'Failed to change password');
    }
  };
  
  // Tabs configuration
  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'password', label: 'Change Password' },
    { id: 'preferences', label: 'Account Preferences' },
    { id: 'security', label: 'Security Settings' },
  ];
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Typography variant="h1" className="text-2xl font-bold mb-6">
          My Profile
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile sidebar */}
          <div className="md:col-span-1">
            <Card className="p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div 
                  className="rounded-full overflow-hidden w-full h-full cursor-pointer border-4 border-gray-200 hover:border-primary-500 transition-colors"
                  onClick={handleAvatarClick}
                >
                  {avatarPreview || user?.avatar ? (
                    <Image 
                      src={avatarPreview || user?.avatar || '/images/default-avatar.png'} 
                      alt="Profile avatar" 
                      width={128} 
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0">
                  <button 
                    className="bg-primary-500 text-white rounded-full p-2 shadow-md hover:bg-primary-600 focus:outline-none"
                    onClick={handleAvatarClick}
                    type="button"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              
              <Typography variant="h2" className="text-xl font-semibold">
                {user?.name || 'User Name'}
              </Typography>
              
              <Typography variant="body2" className="text-gray-600 mt-1">
                {user?.position || 'Position'}
              </Typography>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <Typography variant="body2" className="text-gray-600">
                    Role:
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {user?.role || 'User'}
                  </Typography>
                </div>
                
                <div className="flex justify-between mb-2">
                  <Typography variant="body2" className="text-gray-600">
                    Branch:
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {user?.branch || 'Head Office'}
                  </Typography>
                </div>
                
                <div className="flex justify-between">
                  <Typography variant="body2" className="text-gray-600">
                    Status:
                  </Typography>
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <Typography variant="body2" className="font-medium">
                      Active
                    </Typography>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Profile content */}
          <div className="md:col-span-2">
            <Card className="p-6">
              <Tabs 
                tabs={tabs} 
                activeTab={activeTab} 
                onChange={setActiveTab} 
              />
              
              <div className="mt-6">
                {/* Profile Information Tab */}
                {activeTab === 'profile' && (
                  <FormProvider {...profileMethods}>
                    <form onSubmit={profileMethods.handleSubmit(handleProfileSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          name="name"
                          label="Full Name"
                          type="text"
                          required
                        />
                        
                        <FormField
                          name="email"
                          label="Email Address"
                          type="email"
                          required
                        />
                        
                        <FormField
                          name="phone"
                          label="Phone Number"
                          type="tel"
                        />
                        
                        <FormField
                          name="position"
                          label="Position"
                          type="text"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          variant="primary" 
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                )}
                
                {/* Change Password Tab */}
                {activeTab === 'password' && (
                  <FormProvider {...passwordMethods}>
                    <form onSubmit={passwordMethods.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                      <FormField
                        name="currentPassword"
                        label="Current Password"
                        type="password"
                        required
                      />
                      
                      <FormField
                        name="newPassword"
                        label="New Password"
                        type="password"
                        required
                      />
                      
                      <FormField
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        required
                      />
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          variant="primary" 
                          disabled={isChangingPassword}
                        >
                          {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                )}
                
                {/* Account Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <Typography variant="h3" className="text-lg font-medium mb-4">
                        Notification Preferences
                      </Typography>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Typography variant="body1" className="font-medium">
                              Email Notifications
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                              Receive email notifications for important updates
                            </Typography>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="emailNotifications" 
                              name="emailNotifications" 
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                              defaultChecked
                            />
                            <label 
                              htmlFor="emailNotifications" 
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Typography variant="body1" className="font-medium">
                              SMS Notifications
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                              Receive SMS notifications for critical alerts
                            </Typography>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="smsNotifications" 
                              name="smsNotifications" 
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            />
                            <label 
                              htmlFor="smsNotifications" 
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-6">
                      <Typography variant="h3" className="text-lg font-medium mb-4">
                        Display Preferences
                      </Typography>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Typography variant="body1" className="font-medium">
                              Dark Mode
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                              Switch between light and dark theme
                            </Typography>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="darkMode" 
                              name="darkMode" 
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            />
                            <label 
                              htmlFor="darkMode" 
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Typography variant="body1" className="font-medium">
                              Compact View
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                              Display more content with less spacing
                            </Typography>
                          </div>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input 
                              type="checkbox" 
                              id="compactView" 
                              name="compactView" 
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            />
                            <label 
                              htmlFor="compactView" 
                              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                            ></label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="primary">
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Security Settings Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <Typography variant="h3" className="text-lg font-medium mb-4">
                        Two-Factor Authentication
                      </Typography>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <Typography variant="body1" className="text-sm font-medium text-yellow-800">
                              Two-factor authentication is not enabled yet
                            </Typography>
                            <Typography variant="body2" className="text-sm text-yellow-700 mt-1">
                              Add an extra layer of security to your account
                            </Typography>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline">
                        Enable Two-Factor Authentication
                      </Button>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-6">
                      <Typography variant="h3" className="text-lg font-medium mb-4">
                        Active Sessions
                      </Typography>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                          <div className="flex items-center">
                            <div className="p-2 bg-gray-200 rounded-md mr-4">
                              <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <Typography variant="body1" className="font-medium">
                                Current Session
                              </Typography>
                              <Typography variant="body2" className="text-gray-600">
                                Windows • Chrome • Jakarta, Indonesia
                              </Typography>
                            </div>
                          </div>
                          <Typography variant="body2" className="text-green-600 font-medium">
                            Active Now
                          </Typography>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Typography variant="h3" className="text-lg font-medium mb-4">
                        Login History
                      </Typography>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                          <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-md mr-4">
                              <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <Typography variant="body1" className="font-medium">
                                Windows • Chrome
                              </Typography>
                              <Typography variant="body2" className="text-gray-600">
                                Jakarta, Indonesia • May 21, 2025, 8:30 AM
                              </Typography>
                            </div>
                          </div>
                          <Typography variant="body2" className="text-gray-600">
                            Current
                          </Typography>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                          <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-md mr-4">
                              <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <Typography variant="body1" className="font-medium">
                                Android • Mobile App
                              </Typography>
                              <Typography variant="body2" className="text-gray-600">
                                Jakarta, Indonesia • May 20, 2025, 4:15 PM
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
