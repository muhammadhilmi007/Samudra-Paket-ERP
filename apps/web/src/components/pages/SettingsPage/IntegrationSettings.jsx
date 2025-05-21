"use client";

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormField } from '../../organisms/Form';
import Button from '../../atoms/Button';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

/**
 * IntegrationSettings Component
 * Configure integrations with external services like payment gateways and maps
 */
const IntegrationSettings = ({
  settings = {},
  onUpdate,
  loading = false,
}) => {
  // State for showing/hiding API keys
  const [showApiKeys, setShowApiKeys] = useState({});

  // Toggle API key visibility
  const toggleApiKeyVisibility = (key) => {
    setShowApiKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Validation schema
  const paymentGatewaySchema = z.object({
    midtrans: z.object({
      enabled: z.boolean(),
      clientKey: z.string().min(1, 'Client key is required').optional().or(z.literal('')),
      serverKey: z.string().min(1, 'Server key is required').optional().or(z.literal('')),
      environment: z.string(),
    }),
    xendit: z.object({
      enabled: z.boolean(),
      apiKey: z.string().min(1, 'API key is required').optional().or(z.literal('')),
      environment: z.string(),
    }),
  });

  const mapsSchema = z.object({
    googleMaps: z.object({
      enabled: z.boolean(),
      apiKey: z.string().min(1, 'API key is required').optional().or(z.literal('')),
    }),
    mapbox: z.object({
      enabled: z.boolean(),
      accessToken: z.string().min(1, 'Access token is required').optional().or(z.literal('')),
    }),
  });

  const notificationSchema = z.object({
    twilio: z.object({
      enabled: z.boolean(),
      accountSid: z.string().min(1, 'Account SID is required').optional().or(z.literal('')),
      authToken: z.string().min(1, 'Auth token is required').optional().or(z.literal('')),
      phoneNumber: z.string().min(1, 'Phone number is required').optional().or(z.literal('')),
    }),
    sendgrid: z.object({
      enabled: z.boolean(),
      apiKey: z.string().min(1, 'API key is required').optional().or(z.literal('')),
      fromEmail: z.string().email('Invalid email').optional().or(z.literal('')),
    }),
    fcm: z.object({
      enabled: z.boolean(),
      serverKey: z.string().min(1, 'Server key is required').optional().or(z.literal('')),
    }),
  });

  // Handle form submission
  const handlePaymentGatewaySubmit = async (data) => {
    if (onUpdate) {
      await onUpdate({
        ...settings,
        paymentGateways: data,
      });
    }
  };

  const handleMapsSubmit = async (data) => {
    if (onUpdate) {
      await onUpdate({
        ...settings,
        maps: data,
      });
    }
  };

  const handleNotificationSubmit = async (data) => {
    if (onUpdate) {
      await onUpdate({
        ...settings,
        notifications: data,
      });
    }
  };

  return (
    <div className="space-y-10 py-4">
      {/* Payment Gateway Integrations */}
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Payment Gateway Integrations</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure payment gateway integrations for processing payments.
          </p>
        </div>

        <Form
          defaultValues={{
            midtrans: {
              enabled: settings.paymentGateways?.midtrans?.enabled || false,
              clientKey: settings.paymentGateways?.midtrans?.clientKey || '',
              serverKey: settings.paymentGateways?.midtrans?.serverKey || '',
              environment: settings.paymentGateways?.midtrans?.environment || 'sandbox',
            },
            xendit: {
              enabled: settings.paymentGateways?.xendit?.enabled || false,
              apiKey: settings.paymentGateways?.xendit?.apiKey || '',
              environment: settings.paymentGateways?.xendit?.environment || 'sandbox',
            },
          }}
          schema={paymentGatewaySchema}
          onSubmit={handlePaymentGatewaySubmit}
          loading={loading}
          className="space-y-6"
        >
          {({ control }) => (
            <>
              {/* Midtrans */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">Midtrans</h3>
                  <FormField
                    name="midtrans.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <FormField
                        name="midtrans.clientKey"
                        label="Client Key"
                        type="text"
                        control={control}
                        inputClassName="pr-10"
                        disabled={!settings.paymentGateways?.midtrans?.enabled}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-8 text-gray-400 hover:text-gray-500"
                        onClick={() => toggleApiKeyVisibility('midtransClientKey')}
                      >
                        {showApiKeys.midtransClientKey ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
                    <div className="relative">
                      <FormField
                        name="midtrans.serverKey"
                        label="Server Key"
                        type={showApiKeys.midtransServerKey ? 'text' : 'password'}
                        control={control}
                        inputClassName="pr-10"
                        disabled={!settings.paymentGateways?.midtrans?.enabled}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-8 text-gray-400 hover:text-gray-500"
                        onClick={() => toggleApiKeyVisibility('midtransServerKey')}
                      >
                        {showApiKeys.midtransServerKey ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <FormField
                    name="midtrans.environment"
                    label="Environment"
                    type="select"
                    control={control}
                    options={[
                      { value: 'sandbox', label: 'Sandbox (Testing)' },
                      { value: 'production', label: 'Production' },
                    ]}
                    disabled={!settings.paymentGateways?.midtrans?.enabled}
                  />
                </div>
              </div>
              
              {/* Xendit */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">Xendit</h3>
                  <FormField
                    name="xendit.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <FormField
                      name="xendit.apiKey"
                      label="API Key"
                      type={showApiKeys.xenditApiKey ? 'text' : 'password'}
                      control={control}
                      inputClassName="pr-10"
                      disabled={!settings.paymentGateways?.xendit?.enabled}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-8 text-gray-400 hover:text-gray-500"
                      onClick={() => toggleApiKeyVisibility('xenditApiKey')}
                    >
                      {showApiKeys.xenditApiKey ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  <FormField
                    name="xendit.environment"
                    label="Environment"
                    type="select"
                    control={control}
                    options={[
                      { value: 'sandbox', label: 'Sandbox (Testing)' },
                      { value: 'production', label: 'Production' },
                    ]}
                    disabled={!settings.paymentGateways?.xendit?.enabled}
                  />
                </div>
              </div>
            </>
          )}
        </Form>
      </div>

      {/* Maps Integrations */}
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Maps Integrations</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure map service integrations for routing and geolocation.
          </p>
        </div>

        <Form
          defaultValues={{
            googleMaps: {
              enabled: settings.maps?.googleMaps?.enabled || false,
              apiKey: settings.maps?.googleMaps?.apiKey || '',
            },
            mapbox: {
              enabled: settings.maps?.mapbox?.enabled || false,
              accessToken: settings.maps?.mapbox?.accessToken || '',
            },
          }}
          schema={mapsSchema}
          onSubmit={handleMapsSubmit}
          loading={loading}
          className="space-y-6"
        >
          {({ control }) => (
            <>
              {/* Google Maps */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">Google Maps</h3>
                  <FormField
                    name="googleMaps.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <div className="relative">
                  <FormField
                    name="googleMaps.apiKey"
                    label="API Key"
                    type={showApiKeys.googleMapsApiKey ? 'text' : 'password'}
                    control={control}
                    inputClassName="pr-10"
                    disabled={!settings.maps?.googleMaps?.enabled}
                    helperText="Required for geocoding, routing, and map display"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-8 text-gray-400 hover:text-gray-500"
                    onClick={() => toggleApiKeyVisibility('googleMapsApiKey')}
                  >
                    {showApiKeys.googleMapsApiKey ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Mapbox */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">Mapbox</h3>
                  <FormField
                    name="mapbox.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <div className="relative">
                  <FormField
                    name="mapbox.accessToken"
                    label="Access Token"
                    type={showApiKeys.mapboxAccessToken ? 'text' : 'password'}
                    control={control}
                    inputClassName="pr-10"
                    disabled={!settings.maps?.mapbox?.enabled}
                    helperText="Alternative to Google Maps for routing and map display"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-8 text-gray-400 hover:text-gray-500"
                    onClick={() => toggleApiKeyVisibility('mapboxAccessToken')}
                  >
                    {showApiKeys.mapboxAccessToken ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </Form>
      </div>

      {/* Notification Integrations */}
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900">Notification Integrations</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure notification services for SMS, email, and push notifications.
          </p>
        </div>

        <Form
          defaultValues={{
            twilio: {
              enabled: settings.notifications?.twilio?.enabled || false,
              accountSid: settings.notifications?.twilio?.accountSid || '',
              authToken: settings.notifications?.twilio?.authToken || '',
              phoneNumber: settings.notifications?.twilio?.phoneNumber || '',
            },
            sendgrid: {
              enabled: settings.notifications?.sendgrid?.enabled || false,
              apiKey: settings.notifications?.sendgrid?.apiKey || '',
              fromEmail: settings.notifications?.sendgrid?.fromEmail || '',
            },
            fcm: {
              enabled: settings.notifications?.fcm?.enabled || false,
              serverKey: settings.notifications?.fcm?.serverKey || '',
            },
          }}
          schema={notificationSchema}
          onSubmit={handleNotificationSubmit}
          loading={loading}
          className="space-y-6"
        >
          {({ control }) => (
            <>
              {/* Twilio */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">Twilio (SMS & WhatsApp)</h3>
                  <FormField
                    name="twilio.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <FormField
                        name="twilio.accountSid"
                        label="Account SID"
                        type={showApiKeys.twilioAccountSid ? 'text' : 'password'}
                        control={control}
                        inputClassName="pr-10"
                        disabled={!settings.notifications?.twilio?.enabled}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-8 text-gray-400 hover:text-gray-500"
                        onClick={() => toggleApiKeyVisibility('twilioAccountSid')}
                      >
                        {showApiKeys.twilioAccountSid ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
                    <div className="relative">
                      <FormField
                        name="twilio.authToken"
                        label="Auth Token"
                        type={showApiKeys.twilioAuthToken ? 'text' : 'password'}
                        control={control}
                        inputClassName="pr-10"
                        disabled={!settings.notifications?.twilio?.enabled}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-8 text-gray-400 hover:text-gray-500"
                        onClick={() => toggleApiKeyVisibility('twilioAuthToken')}
                      >
                        {showApiKeys.twilioAuthToken ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <FormField
                    name="twilio.phoneNumber"
                    label="From Phone Number"
                    type="text"
                    control={control}
                    disabled={!settings.notifications?.twilio?.enabled}
                    helperText="Include country code, e.g., +6281234567890"
                  />
                </div>
              </div>
              
              {/* SendGrid */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">SendGrid (Email)</h3>
                  <FormField
                    name="sendgrid.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <FormField
                      name="sendgrid.apiKey"
                      label="API Key"
                      type={showApiKeys.sendgridApiKey ? 'text' : 'password'}
                      control={control}
                      inputClassName="pr-10"
                      disabled={!settings.notifications?.sendgrid?.enabled}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-8 text-gray-400 hover:text-gray-500"
                      onClick={() => toggleApiKeyVisibility('sendgridApiKey')}
                    >
                      {showApiKeys.sendgridApiKey ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  <FormField
                    name="sendgrid.fromEmail"
                    label="From Email Address"
                    type="email"
                    control={control}
                    disabled={!settings.notifications?.sendgrid?.enabled}
                    helperText="Must be verified in SendGrid"
                  />
                </div>
              </div>
              
              {/* Firebase Cloud Messaging */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">Firebase Cloud Messaging (Push)</h3>
                  <FormField
                    name="fcm.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <div className="relative">
                  <FormField
                    name="fcm.serverKey"
                    label="Server Key"
                    type={showApiKeys.fcmServerKey ? 'text' : 'password'}
                    control={control}
                    inputClassName="pr-10"
                    disabled={!settings.notifications?.fcm?.enabled}
                    helperText="Required for sending push notifications to mobile devices"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-8 text-gray-400 hover:text-gray-500"
                    onClick={() => toggleApiKeyVisibility('fcmServerKey')}
                  >
                    {showApiKeys.fcmServerKey ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  );
};

IntegrationSettings.propTypes = {
  /**
   * Integration settings data
   */
  settings: PropTypes.shape({
    paymentGateways: PropTypes.shape({
      midtrans: PropTypes.shape({
        enabled: PropTypes.bool,
        clientKey: PropTypes.string,
        serverKey: PropTypes.string,
        environment: PropTypes.string,
      }),
      xendit: PropTypes.shape({
        enabled: PropTypes.bool,
        apiKey: PropTypes.string,
        environment: PropTypes.string,
      }),
    }),
    maps: PropTypes.shape({
      googleMaps: PropTypes.shape({
        enabled: PropTypes.bool,
        apiKey: PropTypes.string,
      }),
      mapbox: PropTypes.shape({
        enabled: PropTypes.bool,
        accessToken: PropTypes.string,
      }),
    }),
    notifications: PropTypes.shape({
      twilio: PropTypes.shape({
        enabled: PropTypes.bool,
        accountSid: PropTypes.string,
        authToken: PropTypes.string,
        phoneNumber: PropTypes.string,
      }),
      sendgrid: PropTypes.shape({
        enabled: PropTypes.bool,
        apiKey: PropTypes.string,
        fromEmail: PropTypes.string,
      }),
      fcm: PropTypes.shape({
        enabled: PropTypes.bool,
        serverKey: PropTypes.string,
      }),
    }),
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

export default IntegrationSettings;
