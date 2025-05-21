"use client";

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from '../../molecules/Tabs';
import GeneralSettings from './GeneralSettings';
import CompanySettings from './CompanySettings';
import UserManagement from './UserManagement';
import IntegrationSettings from './IntegrationSettings';
import NotificationSettings from './NotificationSettings';

/**
 * SettingsPage Component
 * A comprehensive settings page for configuring system-wide settings
 */
const SettingsPage = ({
  settings = {},
  users = [],
  roles = [],
  onUpdate,
  onUserUpdate,
  onUserCreate,
  onUserDelete,
  loading = false,
  className = '',
}) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('general');

  // Handle settings update
  const handleSettingsUpdate = async (section, data) => {
    if (onUpdate) {
      await onUpdate({
        ...settings,
        [section]: {
          ...(settings[section] || {}),
          ...data,
        },
      });
    }
  };

  return (
    <div className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your application settings and preferences
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Tabs
          defaultActiveKey={activeTab}
          onChange={setActiveTab}
          className="p-4 sm:p-6"
        >
          <Tabs.Tab key="general" tab="General">
            <GeneralSettings
              settings={settings.general || {}}
              onUpdate={(data) => handleSettingsUpdate('general', data)}
              loading={loading}
            />
          </Tabs.Tab>
          
          <Tabs.Tab key="company" tab="Company">
            <CompanySettings
              settings={settings.company || {}}
              onUpdate={(data) => handleSettingsUpdate('company', data)}
              loading={loading}
            />
          </Tabs.Tab>
          
          <Tabs.Tab key="users" tab="Users & Permissions">
            <UserManagement
              users={users}
              roles={roles}
              onUserUpdate={onUserUpdate}
              onUserCreate={onUserCreate}
              onUserDelete={onUserDelete}
              loading={loading}
            />
          </Tabs.Tab>
          
          <Tabs.Tab key="integrations" tab="Integrations">
            <IntegrationSettings
              settings={settings.integrations || {}}
              onUpdate={(data) => handleSettingsUpdate('integrations', data)}
              loading={loading}
            />
          </Tabs.Tab>
          
          <Tabs.Tab key="notifications" tab="Notifications">
            <NotificationSettings
              settings={settings.notifications || {}}
              onUpdate={(data) => handleSettingsUpdate('notifications', data)}
              loading={loading}
            />
          </Tabs.Tab>
        </Tabs>
      </div>
    </div>
  );
};

SettingsPage.propTypes = {
  /**
   * Settings data
   */
  settings: PropTypes.shape({
    general: PropTypes.object,
    company: PropTypes.object,
    integrations: PropTypes.object,
    notifications: PropTypes.object,
  }),
  /**
   * Array of user objects
   */
  users: PropTypes.arrayOf(PropTypes.object),
  /**
   * Array of role objects
   */
  roles: PropTypes.arrayOf(PropTypes.object),
  /**
   * Callback when settings are updated
   */
  onUpdate: PropTypes.func,
  /**
   * Callback when a user is updated
   */
  onUserUpdate: PropTypes.func,
  /**
   * Callback when a user is created
   */
  onUserCreate: PropTypes.func,
  /**
   * Callback when a user is deleted
   */
  onUserDelete: PropTypes.func,
  /**
   * Whether the page is in a loading state
   */
  loading: PropTypes.bool,
  /**
   * Additional CSS classes
   */
  className: PropTypes.string,
};

export default SettingsPage;
