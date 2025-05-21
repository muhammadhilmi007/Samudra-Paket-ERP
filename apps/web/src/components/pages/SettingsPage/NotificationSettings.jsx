"use client";

import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormField } from '../../organisms/Form';
import { z } from 'zod';

/**
 * NotificationSettings Component
 * Configure notification templates and settings for various events
 */
const NotificationSettings = ({
  settings = {},
  onUpdate,
  loading = false,
}) => {
  // Validation schema
  const notificationSettingsSchema = z.object({
    emailTemplates: z.object({
      shipmentCreated: z.object({
        enabled: z.boolean(),
        subject: z.string().min(1, 'Subject is required'),
        body: z.string().min(1, 'Body is required'),
      }),
      shipmentDelivered: z.object({
        enabled: z.boolean(),
        subject: z.string().min(1, 'Subject is required'),
        body: z.string().min(1, 'Body is required'),
      }),
      paymentReceived: z.object({
        enabled: z.boolean(),
        subject: z.string().min(1, 'Subject is required'),
        body: z.string().min(1, 'Body is required'),
      }),
    }),
    smsTemplates: z.object({
      shipmentCreated: z.object({
        enabled: z.boolean(),
        message: z.string().min(1, 'Message is required'),
      }),
      shipmentDelivered: z.object({
        enabled: z.boolean(),
        message: z.string().min(1, 'Message is required'),
      }),
      paymentReceived: z.object({
        enabled: z.boolean(),
        message: z.string().min(1, 'Message is required'),
      }),
    }),
    pushNotifications: z.object({
      enabled: z.boolean(),
      newShipment: z.boolean(),
      shipmentStatusUpdate: z.boolean(),
      paymentUpdate: z.boolean(),
      deliveryReminder: z.boolean(),
    }),
  });

  // Handle form submission
  const handleSubmit = async (data) => {
    if (onUpdate) {
      await onUpdate(data);
    }
  };

  // Template variables helper
  const renderTemplateVariables = () => {
    return (
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Available Template Variables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
          <div><code>{'{{customerName}}'}</code> - Customer's full name</div>
          <div><code>{'{{shipmentId}}'}</code> - Shipment tracking number</div>
          <div><code>{'{{origin}}'}</code> - Shipment origin</div>
          <div><code>{'{{destination}}'}</code> - Shipment destination</div>
          <div><code>{'{{estimatedDelivery}}'}</code> - Estimated delivery date</div>
          <div><code>{'{{trackingUrl}}'}</code> - Shipment tracking URL</div>
          <div><code>{'{{status}}'}</code> - Current shipment status</div>
          <div><code>{'{{amount}}'}</code> - Payment amount</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 py-4">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure notification templates and settings for various events.
        </p>
      </div>

      {renderTemplateVariables()}

      <Form
        defaultValues={{
          emailTemplates: {
            shipmentCreated: {
              enabled: settings.emailTemplates?.shipmentCreated?.enabled !== false,
              subject: settings.emailTemplates?.shipmentCreated?.subject || 'Your shipment {{shipmentId}} has been created',
              body: settings.emailTemplates?.shipmentCreated?.body || 'Dear {{customerName}},\n\nYour shipment with tracking number {{shipmentId}} has been created. You can track your shipment at {{trackingUrl}}.\n\nEstimated delivery: {{estimatedDelivery}}\nOrigin: {{origin}}\nDestination: {{destination}}\n\nThank you for using our service.',
            },
            shipmentDelivered: {
              enabled: settings.emailTemplates?.shipmentDelivered?.enabled !== false,
              subject: settings.emailTemplates?.shipmentDelivered?.subject || 'Your shipment {{shipmentId}} has been delivered',
              body: settings.emailTemplates?.shipmentDelivered?.body || 'Dear {{customerName}},\n\nYour shipment with tracking number {{shipmentId}} has been delivered.\n\nThank you for using our service.',
            },
            paymentReceived: {
              enabled: settings.emailTemplates?.paymentReceived?.enabled !== false,
              subject: settings.emailTemplates?.paymentReceived?.subject || 'Payment received for shipment {{shipmentId}}',
              body: settings.emailTemplates?.paymentReceived?.body || 'Dear {{customerName}},\n\nWe have received your payment of {{amount}} for shipment {{shipmentId}}.\n\nThank you for using our service.',
            },
          },
          smsTemplates: {
            shipmentCreated: {
              enabled: settings.smsTemplates?.shipmentCreated?.enabled !== false,
              message: settings.smsTemplates?.shipmentCreated?.message || 'Your shipment {{shipmentId}} has been created. Track at {{trackingUrl}}. Est. delivery: {{estimatedDelivery}}',
            },
            shipmentDelivered: {
              enabled: settings.smsTemplates?.shipmentDelivered?.enabled !== false,
              message: settings.smsTemplates?.shipmentDelivered?.message || 'Your shipment {{shipmentId}} has been delivered. Thank you for using our service.',
            },
            paymentReceived: {
              enabled: settings.smsTemplates?.paymentReceived?.enabled !== false,
              message: settings.smsTemplates?.paymentReceived?.message || 'Payment of {{amount}} received for shipment {{shipmentId}}. Thank you.',
            },
          },
          pushNotifications: {
            enabled: settings.pushNotifications?.enabled !== false,
            newShipment: settings.pushNotifications?.newShipment !== false,
            shipmentStatusUpdate: settings.pushNotifications?.shipmentStatusUpdate !== false,
            paymentUpdate: settings.pushNotifications?.paymentUpdate !== false,
            deliveryReminder: settings.pushNotifications?.deliveryReminder !== false,
          },
        }}
        schema={notificationSettingsSchema}
        onSubmit={handleSubmit}
        loading={loading}
        className="space-y-8"
      >
        {({ control }) => (
          <>
            {/* Email Templates */}
            <div className="space-y-6">
              <h3 className="text-md font-medium text-gray-900">Email Notification Templates</h3>
              
              {/* Shipment Created Email */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Shipment Created</h4>
                  <FormField
                    name="emailTemplates.shipmentCreated.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    name="emailTemplates.shipmentCreated.subject"
                    label="Subject"
                    type="text"
                    control={control}
                    disabled={!settings.emailTemplates?.shipmentCreated?.enabled}
                  />
                  
                  <FormField
                    name="emailTemplates.shipmentCreated.body"
                    label="Body"
                    type="textarea"
                    control={control}
                    rows={6}
                    disabled={!settings.emailTemplates?.shipmentCreated?.enabled}
                  />
                </div>
              </div>
              
              {/* Shipment Delivered Email */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Shipment Delivered</h4>
                  <FormField
                    name="emailTemplates.shipmentDelivered.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    name="emailTemplates.shipmentDelivered.subject"
                    label="Subject"
                    type="text"
                    control={control}
                    disabled={!settings.emailTemplates?.shipmentDelivered?.enabled}
                  />
                  
                  <FormField
                    name="emailTemplates.shipmentDelivered.body"
                    label="Body"
                    type="textarea"
                    control={control}
                    rows={6}
                    disabled={!settings.emailTemplates?.shipmentDelivered?.enabled}
                  />
                </div>
              </div>
              
              {/* Payment Received Email */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Payment Received</h4>
                  <FormField
                    name="emailTemplates.paymentReceived.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    name="emailTemplates.paymentReceived.subject"
                    label="Subject"
                    type="text"
                    control={control}
                    disabled={!settings.emailTemplates?.paymentReceived?.enabled}
                  />
                  
                  <FormField
                    name="emailTemplates.paymentReceived.body"
                    label="Body"
                    type="textarea"
                    control={control}
                    rows={6}
                    disabled={!settings.emailTemplates?.paymentReceived?.enabled}
                  />
                </div>
              </div>
            </div>
            
            {/* SMS Templates */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <h3 className="text-md font-medium text-gray-900">SMS Notification Templates</h3>
              
              {/* Shipment Created SMS */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Shipment Created</h4>
                  <FormField
                    name="smsTemplates.shipmentCreated.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <FormField
                  name="smsTemplates.shipmentCreated.message"
                  label="Message"
                  type="textarea"
                  control={control}
                  rows={3}
                  disabled={!settings.smsTemplates?.shipmentCreated?.enabled}
                  helperText="Keep SMS messages under 160 characters to avoid splitting"
                />
              </div>
              
              {/* Shipment Delivered SMS */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Shipment Delivered</h4>
                  <FormField
                    name="smsTemplates.shipmentDelivered.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <FormField
                  name="smsTemplates.shipmentDelivered.message"
                  label="Message"
                  type="textarea"
                  control={control}
                  rows={3}
                  disabled={!settings.smsTemplates?.shipmentDelivered?.enabled}
                  helperText="Keep SMS messages under 160 characters to avoid splitting"
                />
              </div>
              
              {/* Payment Received SMS */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Payment Received</h4>
                  <FormField
                    name="smsTemplates.paymentReceived.enabled"
                    type="checkbox"
                    control={control}
                  />
                </div>
                
                <FormField
                  name="smsTemplates.paymentReceived.message"
                  label="Message"
                  type="textarea"
                  control={control}
                  rows={3}
                  disabled={!settings.smsTemplates?.paymentReceived?.enabled}
                  helperText="Keep SMS messages under 160 characters to avoid splitting"
                />
              </div>
            </div>
            
            {/* Push Notifications */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-900">Push Notifications</h3>
                <FormField
                  name="pushNotifications.enabled"
                  type="checkbox"
                  control={control}
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="space-y-4">
                  <FormField
                    name="pushNotifications.newShipment"
                    type="checkbox"
                    checkboxLabel="New Shipment Notifications"
                    control={control}
                    disabled={!settings.pushNotifications?.enabled}
                    helperText="Notify when a new shipment is created"
                  />
                  
                  <FormField
                    name="pushNotifications.shipmentStatusUpdate"
                    type="checkbox"
                    checkboxLabel="Shipment Status Updates"
                    control={control}
                    disabled={!settings.pushNotifications?.enabled}
                    helperText="Notify when a shipment status changes"
                  />
                  
                  <FormField
                    name="pushNotifications.paymentUpdate"
                    type="checkbox"
                    checkboxLabel="Payment Updates"
                    control={control}
                    disabled={!settings.pushNotifications?.enabled}
                    helperText="Notify when a payment is received or updated"
                  />
                  
                  <FormField
                    name="pushNotifications.deliveryReminder"
                    type="checkbox"
                    checkboxLabel="Delivery Reminders"
                    control={control}
                    disabled={!settings.pushNotifications?.enabled}
                    helperText="Send reminders before scheduled deliveries"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

NotificationSettings.propTypes = {
  /**
   * Notification settings data
   */
  settings: PropTypes.shape({
    emailTemplates: PropTypes.shape({
      shipmentCreated: PropTypes.shape({
        enabled: PropTypes.bool,
        subject: PropTypes.string,
        body: PropTypes.string,
      }),
      shipmentDelivered: PropTypes.shape({
        enabled: PropTypes.bool,
        subject: PropTypes.string,
        body: PropTypes.string,
      }),
      paymentReceived: PropTypes.shape({
        enabled: PropTypes.bool,
        subject: PropTypes.string,
        body: PropTypes.string,
      }),
    }),
    smsTemplates: PropTypes.shape({
      shipmentCreated: PropTypes.shape({
        enabled: PropTypes.bool,
        message: PropTypes.string,
      }),
      shipmentDelivered: PropTypes.shape({
        enabled: PropTypes.bool,
        message: PropTypes.string,
      }),
      paymentReceived: PropTypes.shape({
        enabled: PropTypes.bool,
        message: PropTypes.string,
      }),
    }),
    pushNotifications: PropTypes.shape({
      enabled: PropTypes.bool,
      newShipment: PropTypes.bool,
      shipmentStatusUpdate: PropTypes.bool,
      paymentUpdate: PropTypes.bool,
      deliveryReminder: PropTypes.bool,
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

export default NotificationSettings;
