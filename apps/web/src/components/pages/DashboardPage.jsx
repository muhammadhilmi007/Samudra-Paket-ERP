"use client";

/**
 * DashboardPage Component
 * Main dashboard page with overview statistics and recent activity
 */

import React from 'react';
import DashboardLayout from '../templates/DashboardLayout';
import Typography from '../atoms/Typography';
import Card from '../molecules/Card';
import DataTable from '../organisms/DataTable';
import Badge from '../atoms/Badge';

const DashboardPage = ({ user }) => {
  // Sample statistics data
  const stats = [
    { id: 1, name: 'Total Shipments', value: '1,284', change: '+12.5%', changeType: 'increase' },
    { id: 2, name: 'Pending Pickups', value: '42', change: '-8.1%', changeType: 'decrease' },
    { id: 3, name: 'In Transit', value: '189', change: '+3.2%', changeType: 'increase' },
    { id: 4, name: 'Delivered Today', value: '76', change: '+24.3%', changeType: 'increase' },
  ];

  // Sample recent shipments data
  const recentShipments = [
    {
      id: 'SHP-12345',
      customer: 'PT Maju Bersama',
      origin: 'Jakarta',
      destination: 'Surabaya',
      status: 'In Transit',
      date: '2025-05-18',
    },
    {
      id: 'SHP-12344',
      customer: 'CV Teknologi Nusantara',
      origin: 'Bandung',
      destination: 'Semarang',
      status: 'Pending Pickup',
      date: '2025-05-18',
    },
    {
      id: 'SHP-12343',
      customer: 'PT Sukses Makmur',
      origin: 'Jakarta',
      destination: 'Medan',
      status: 'Processing',
      status: 'Processing',
      date: '2025-05-17',
    },
    {
      id: 'SHP-12342',
      customer: 'CV Abadi Jaya',
      origin: 'Surabaya',
      destination: 'Makassar',
      status: 'Delivered',
      date: '2025-05-17',
    },
    {
      id: 'SHP-12341',
      customer: 'PT Global Indonesia',
      origin: 'Jakarta',
      destination: 'Bali',
      status: 'Delivered',
      date: '2025-05-16',
    },
  ];

  // Table columns configuration
  const columns = [
    { key: 'id', label: 'Tracking ID', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'origin', label: 'Origin', sortable: true },
    { key: 'destination', label: 'Destination', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (row) => {
        const statusMap = {
          'Delivered': { color: 'success', text: 'Delivered' },
          'In Transit': { color: 'primary', text: 'In Transit' },
          'Pending Pickup': { color: 'warning', text: 'Pending Pickup' },
          'Processing': { color: 'info', text: 'Processing' },
        };
        
        const status = statusMap[row.status] || { color: 'default', text: row.status };
        
        return <Badge color={status.color}>{status.text}</Badge>;
      }
    },
    { key: 'date', label: 'Date', sortable: true },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="mb-6">
        <Typography variant="h4" className="mb-2">Dashboard</Typography>
        <Typography variant="body1" className="text-gray-600">
          Welcome back, {user?.name || 'User'}! Here's what's happening today.
        </Typography>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.id} className="p-6">
            <Typography variant="subtitle2" className="text-gray-500 mb-1">
              {stat.name}
            </Typography>
            <div className="flex items-baseline">
              <Typography variant="h4" className="mr-2">
                {stat.value}
              </Typography>
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Shipments */}
      <Card className="mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <Typography variant="h6">Recent Shipments</Typography>
        </div>
        <div className="p-6">
          <DataTable
            data={recentShipments}
            columns={columns}
            pagination={true}
            onRowClick={(row) => console.log('Clicked row:', row)}
          />
        </div>
      </Card>

      {/* Quick Actions and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <div className="px-6 py-5 border-b border-gray-200">
            <Typography variant="h6">Quick Actions</Typography>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              <li className="py-3">
                <a href="#" className="flex items-center text-primary-600 hover:text-primary-800">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Create New Shipment
                </a>
              </li>
              <li className="py-3">
                <a href="#" className="flex items-center text-primary-600 hover:text-primary-800">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Add New Customer
                </a>
              </li>
              <li className="py-3">
                <a href="#" className="flex items-center text-primary-600 hover:text-primary-800">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                  </svg>
                  Generate Reports
                </a>
              </li>
              <li className="py-3">
                <a href="#" className="flex items-center text-primary-600 hover:text-primary-800">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  View Help Center
                </a>
              </li>
            </ul>
          </div>
        </Card>

        {/* Recent Notifications */}
        <Card className="lg:col-span-2">
          <div className="px-6 py-5 border-b border-gray-200">
            <Typography variant="h6">Recent Notifications</Typography>
          </div>
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              <li className="py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <Typography variant="subtitle2" className="text-gray-900">System Update</Typography>
                    <Typography variant="body2" className="text-gray-500">
                      System maintenance scheduled for May 20, 2025 at 02:00 AM.
                    </Typography>
                    <Typography variant="caption" className="text-gray-400 mt-1">
                      2 hours ago
                    </Typography>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <Typography variant="subtitle2" className="text-gray-900">Shipment Delivered</Typography>
                    <Typography variant="body2" className="text-gray-500">
                      Shipment #SHP-12340 has been successfully delivered to the recipient.
                    </Typography>
                    <Typography variant="caption" className="text-gray-400 mt-1">
                      5 hours ago
                    </Typography>
                  </div>
                </div>
              </li>
              <li className="py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100 text-yellow-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <Typography variant="subtitle2" className="text-gray-900">Pickup Request</Typography>
                    <Typography variant="body2" className="text-gray-500">
                      New pickup request from PT Maju Bersama requires approval.
                    </Typography>
                    <Typography variant="caption" className="text-gray-400 mt-1">
                      1 day ago
                    </Typography>
                  </div>
                </div>
              </li>
            </ul>
            <div className="mt-4 text-center">
              <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all notifications
              </a>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// Sample user data
DashboardPage.defaultProps = {
  user: {
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@example.com',
    role: 'Operations Manager',
    avatar: '/avatars/user-1.jpg',
  },
};

export default DashboardPage;
