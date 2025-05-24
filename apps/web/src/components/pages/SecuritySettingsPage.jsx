"use client";

/**
 * SecuritySettingsPage Component
 * Page for managing security settings, devices, and login alerts
 */

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import DashboardLayout from '../templates/DashboardLayout';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import FormField from '../molecules/FormField';
import Tabs from '../molecules/Tabs';
import { 
  useGetSecuritySettingsQuery, 
  useUpdateSecuritySettingsMutation,
  useGetTrustedDevicesQuery,
  useRemoveTrustedDeviceMutation,
  useSetupTwoFactorMutation,
  useDisableTwoFactorMutation
} from '../../store/api/authApi';
import { createNotificationHandler } from '../../utils/notificationUtils';

// Security settings validation schema
const securitySettingsSchema = z.object({
  loginNotifications: z.boolean().optional(),
  unusualActivityAlerts: z.boolean().optional(),
  twoFactorAuthentication: z.boolean().optional(),
  rememberDevices: z.boolean().optional(),
  sessionTimeout: z.number().min(5).max(60),
});

const SecuritySettingsPage = () => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  const [activeTab, setActiveTab] = useState('settings');
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  // RTK Query hooks
  const { data: securitySettings, isLoading } = useGetSecuritySettingsQuery();
  const { data: trustedDevices, isLoading: isLoadingDevices } = useGetTrustedDevicesQuery();
  const [updateSecuritySettings, { isLoading: isUpdating }] = useUpdateSecuritySettingsMutation();
  const [removeTrustedDevice, { isLoading: isRemoving }] = useRemoveTrustedDeviceMutation();
  const [setupTwoFactor, { isLoading: isSettingUp2FA }] = useSetupTwoFactorMutation();
  const [disableTwoFactor, { isLoading: isDisabling2FA }] = useDisableTwoFactorMutation();
  
  // Form setup
  const methods = useForm({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      loginNotifications: securitySettings?.loginNotifications || false,
      unusualActivityAlerts: securitySettings?.unusualActivityAlerts || false,
      twoFactorAuthentication: securitySettings?.twoFactorAuthentication || false,
      rememberDevices: securitySettings?.rememberDevices || false,
      sessionTimeout: securitySettings?.sessionTimeout || 30,
    },
  });
  
  // Update form values when security settings data is loaded
  React.useEffect(() => {
    if (securitySettings) {
      methods.reset({
        loginNotifications: securitySettings.loginNotifications,
        unusualActivityAlerts: securitySettings.unusualActivityAlerts,
        twoFactorAuthentication: securitySettings.twoFactorAuthentication,
        rememberDevices: securitySettings.rememberDevices,
        sessionTimeout: securitySettings.sessionTimeout,
      });
    }
  }, [securitySettings, methods]);
  
  // Handle security settings update
  const handleSubmit = async (data) => {
    try {
      await updateSecuritySettings(data).unwrap();
      notifications.success('Security settings updated successfully');
    } catch (error) {
      console.error('Failed to update security settings:', error);
      notifications.error(error?.data?.message || 'Failed to update security settings');
    }
  };
  
  // Handle trusted device removal
  const handleRemoveDevice = async (deviceId) => {
    try {
      await removeTrustedDevice(deviceId).unwrap();
      notifications.success('Device removed successfully');
    } catch (error) {
      console.error('Failed to remove device:', error);
      notifications.error(error?.data?.message || 'Failed to remove device');
    }
  };
  
  // Handle two-factor authentication setup
  const handleSetupTwoFactor = async () => {
    try {
      const result = await setupTwoFactor().unwrap();
      setQrCodeUrl(result.qrCodeUrl);
      setTwoFactorCode(result.secretKey);
      setShowTwoFactorSetup(true);
    } catch (error) {
      console.error('Failed to set up two-factor authentication:', error);
      notifications.error(error?.data?.message || 'Failed to set up two-factor authentication');
    }
  };
  
  // Handle two-factor authentication verification
  const handleVerifyTwoFactor = async (code) => {
    try {
      await setupTwoFactor({ code }).unwrap();
      setShowTwoFactorSetup(false);
      methods.setValue('twoFactorAuthentication', true);
      notifications.success('Two-factor authentication enabled successfully');
    } catch (error) {
      console.error('Failed to verify two-factor authentication:', error);
      notifications.error(error?.data?.message || 'Invalid verification code');
    }
  };
  
  // Handle two-factor authentication disable
  const handleDisableTwoFactor = async () => {
    try {
      await disableTwoFactor().unwrap();
      methods.setValue('twoFactorAuthentication', false);
      notifications.success('Two-factor authentication disabled successfully');
    } catch (error) {
      console.error('Failed to disable two-factor authentication:', error);
      notifications.error(error?.data?.message || 'Failed to disable two-factor authentication');
    }
  };
  
  // Tabs configuration
  const tabs = [
    { id: 'settings', label: 'Security Settings' },
    { id: 'devices', label: 'Trusted Devices' },
    { id: 'activity', label: 'Login Alerts' },
  ];
  
  // Get device icon based on device type
  const getDeviceIcon = (deviceType) => {
    if (deviceType.toLowerCase().includes('mobile') || deviceType.toLowerCase().includes('android') || deviceType.toLowerCase().includes('ios')) {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      );
    } else if (deviceType.toLowerCase().includes('tablet') || deviceType.toLowerCase().includes('ipad')) {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
      );
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Typography variant="h1" className="text-2xl font-bold mb-6">
          Security Settings
        </Typography>
        
        <Card className="overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {/* Security Settings Tab */}
            {activeTab === 'settings' && (
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <Typography variant="h2" className="text-lg font-medium mb-4">
                      Account Security
                    </Typography>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="body1" className="font-medium">
                            Two-Factor Authentication
                          </Typography>
                          <Typography variant="body2" className="text-gray-600">
                            Add an extra layer of security to your account
                          </Typography>
                        </div>
                        <div className="flex items-center">
                          {methods.watch('twoFactorAuthentication') ? (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={handleDisableTwoFactor}
                              disabled={isDisabling2FA}
                            >
                              Disable
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={handleSetupTwoFactor}
                              disabled={isSettingUp2FA}
                            >
                              Enable
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Two-Factor Authentication Setup */}
                      {showTwoFactorSetup && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <Typography variant="h3" className="text-md font-medium mb-2">
                            Set up Two-Factor Authentication
                          </Typography>
                          
                          <ol className="list-decimal list-inside space-y-4 mb-4">
                            <li className="text-sm">
                              <Typography variant="body2">
                                Download and install an authenticator app like Google Authenticator or Authy
                              </Typography>
                            </li>
                            <li className="text-sm">
                              <Typography variant="body2">
                                Scan the QR code below with your authenticator app
                              </Typography>
                              <div className="mt-2 p-4 bg-white inline-block rounded border border-gray-200">
                                {qrCodeUrl && (
                                  <img src={qrCodeUrl} alt="QR Code" className="h-40 w-40" />
                                )}
                              </div>
                            </li>
                            <li className="text-sm">
                              <Typography variant="body2">
                                Or manually enter this code in your authenticator app:
                              </Typography>
                              <div className="mt-2 font-mono bg-gray-100 p-2 rounded text-sm break-all">
                                {twoFactorCode}
                              </div>
                            </li>
                            <li className="text-sm">
                              <Typography variant="body2">
                                Enter the 6-digit verification code from your authenticator app:
                              </Typography>
                              <div className="mt-2 flex space-x-2">
                                <input
                                  type="text"
                                  className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                  placeholder="000000"
                                  maxLength={6}
                                  onChange={(e) => setTwoFactorCode(e.target.value)}
                                />
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleVerifyTwoFactor(twoFactorCode)}
                                  disabled={twoFactorCode.length !== 6}
                                >
                                  Verify
                                </Button>
                              </div>
                            </li>
                          </ol>
                          
                          <div className="mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowTwoFactorSetup(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="body1" className="font-medium">
                            Remember Devices
                          </Typography>
                          <Typography variant="body2" className="text-gray-600">
                            Stay logged in on trusted devices
                          </Typography>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="rememberDevices"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            {...methods.register('rememberDevices')}
                          />
                          <label
                            htmlFor="rememberDevices"
                            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                          ></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="body1" className="font-medium">
                            Session Timeout
                          </Typography>
                          <Typography variant="body2" className="text-gray-600">
                            Automatically log out after period of inactivity
                          </Typography>
                        </div>
                        <div className="w-32">
                          <select
                            id="sessionTimeout"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            {...methods.register('sessionTimeout', { valueAsNumber: true })}
                          >
                            <option value={5}>5 minutes</option>
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={60}>60 minutes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-6">
                    <Typography variant="h2" className="text-lg font-medium mb-4">
                      Notifications
                    </Typography>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="body1" className="font-medium">
                            Login Notifications
                          </Typography>
                          <Typography variant="body2" className="text-gray-600">
                            Receive email notifications when you log in from a new device
                          </Typography>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="loginNotifications"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            {...methods.register('loginNotifications')}
                          />
                          <label
                            htmlFor="loginNotifications"
                            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                          ></label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="body1" className="font-medium">
                            Unusual Activity Alerts
                          </Typography>
                          <Typography variant="body2" className="text-gray-600">
                            Get notified about suspicious account activity
                          </Typography>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id="unusualActivityAlerts"
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            {...methods.register('unusualActivityAlerts')}
                          />
                          <label
                            htmlFor="unusualActivityAlerts"
                            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                          ></label>
                        </div>
                      </div>
                    </div>
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
            
            {/* Trusted Devices Tab */}
            {activeTab === 'devices' && (
              <div>
                <Typography variant="body2" className="text-gray-600 mb-6">
                  These are devices that you have used to log in and chosen to remember.
                  You can remove any devices that you no longer use.
                </Typography>
                
                {isLoadingDevices ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                ) : !trustedDevices || trustedDevices.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <Typography variant="h3" className="mt-2 text-sm font-medium text-gray-900">
                      No trusted devices
                    </Typography>
                    <Typography variant="body2" className="mt-1 text-sm text-gray-500">
                      You have not added any trusted devices yet.
                    </Typography>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trustedDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                        <div className="flex items-center">
                          <div className="p-2 bg-gray-100 rounded-md mr-4">
                            {getDeviceIcon(device.deviceType)}
                          </div>
                          <div>
                            <Typography variant="body1" className="font-medium">
                              {device.deviceType}
                              {device.isCurrent && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Current
                                </span>
                              )}
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                              {device.browser} • {device.location?.city || 'Unknown'}, {device.location?.country || 'Unknown'}
                            </Typography>
                            <Typography variant="body2" className="text-gray-500 text-xs">
                              Last used {new Date(device.lastUsedAt).toLocaleDateString()}
                            </Typography>
                          </div>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveDevice(device.id)}
                          disabled={isRemoving}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Login Alerts Tab */}
            {activeTab === 'activity' && (
              <div>
                <Typography variant="body2" className="text-gray-600 mb-6">
                  Configure how you want to be notified about login activity and security events.
                </Typography>
                
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <Typography variant="h3" className="text-md font-medium mb-4">
                      Email Notifications
                    </Typography>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="email-new-login"
                          name="email-alerts"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="email-new-login" className="ml-3">
                          <Typography variant="body1" className="font-medium">
                            New login from an unrecognized device
                          </Typography>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="email-password-change"
                          name="email-alerts"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="email-password-change" className="ml-3">
                          <Typography variant="body1" className="font-medium">
                            Password changes
                          </Typography>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="email-failed-login"
                          name="email-alerts"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="email-failed-login" className="ml-3">
                          <Typography variant="body1" className="font-medium">
                            Failed login attempts
                          </Typography>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-6">
                    <Typography variant="h3" className="text-md font-medium mb-4">
                      SMS Notifications
                    </Typography>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          id="sms-new-login"
                          name="sms-alerts"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sms-new-login" className="ml-3">
                          <Typography variant="body1" className="font-medium">
                            New login from an unrecognized device
                          </Typography>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="sms-password-change"
                          name="sms-alerts"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sms-password-change" className="ml-3">
                          <Typography variant="body1" className="font-medium">
                            Password changes
                          </Typography>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <FormField
                        name="phoneNumber"
                        label="Phone Number for SMS Alerts"
                        type="tel"
                        placeholder="+62 812 3456 7890"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                    >
                      Save Notification Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SecuritySettingsPage;
