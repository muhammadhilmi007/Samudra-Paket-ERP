"use client";

/**
 * Sidebar Component
 * Navigation sidebar with collapsible sections and active state
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Typography from '../atoms/Typography';

const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState({
    operations: true,
    management: false,
    reports: false,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Navigation items grouped by section
  const navigation = {
    main: [
      { name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' },
    ],
    operations: [
      { name: 'Shipments', href: '/shipments', icon: 'TruckIcon' },
      { name: 'Pickups', href: '/pickups', icon: 'PackageIcon' },
      { name: 'Deliveries', href: '/deliveries', icon: 'MapPinIcon' },
      { name: 'Returns', href: '/returns', icon: 'ArrowUturnLeftIcon' },
    ],
    management: [
      { name: 'Branches', href: '/branches', icon: 'BuildingOfficeIcon' },
      { name: 'Employees', href: '/employees', icon: 'UsersIcon' },
      { name: 'Vehicles', href: '/vehicles', icon: 'TruckIcon' },
      { name: 'Service Areas', href: '/service-areas', icon: 'MapIcon' },
    ],
    reports: [
      { name: 'Operations', href: '/reports/operations', icon: 'ChartBarIcon' },
      { name: 'Financial', href: '/reports/financial', icon: 'BanknotesIcon' },
      { name: 'Performance', href: '/reports/performance', icon: 'ChartPieIcon' },
    ],
    settings: [
      { name: 'Settings', href: '/settings', icon: 'CogIcon' },
      { name: 'Performance', href: '/settings/performance', icon: 'ChartBarSquareIcon' },
      { name: 'Analytics', href: '/settings/analytics', icon: 'PresentationChartLineIcon' },
      { name: 'Help', href: '/help', icon: 'QuestionMarkCircleIcon' },
    ],
  };

  // Simple icon placeholder component
  const Icon = ({ name }) => (
    <div className="w-5 h-5 mr-3 flex-shrink-0 text-gray-400">
      {/* This would be replaced with actual icons in a real implementation */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </div>
  );

  // Check if a route is active
  const isRouteActive = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      {/* Sidebar header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center">
          <img
            className="h-8 w-auto"
            src="/logo.svg"
            alt="Samudra Paket"
          />
          <Typography variant="h6" className="ml-2 text-primary-600">
            Samudra Paket
          </Typography>
        </Link>
        <button
          type="button"
          className="md:hidden text-gray-500 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="sr-only">Close sidebar</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Sidebar content */}
      <div className="h-[calc(100vh-4rem)] overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {/* Main navigation */}
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isRouteActive(item.href)
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon name={item.icon} />
              {item.name}
            </Link>
          ))}

          {/* Operations section */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              onClick={() => toggleSection('operations')}
            >
              <div className="flex items-center">
                <Icon name="CubeIcon" />
                <span>Operations</span>
              </div>
              <svg
                className={`h-5 w-5 transform transition-transform ${
                  expandedSections.operations ? 'rotate-90' : ''
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {expandedSections.operations && (
              <div className="ml-4 mt-1 space-y-1">
                {navigation.operations.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isRouteActive(item.href)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon name={item.icon} />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Management section */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              onClick={() => toggleSection('management')}
            >
              <div className="flex items-center">
                <Icon name="UsersIcon" />
                <span>Management</span>
              </div>
              <svg
                className={`h-5 w-5 transform transition-transform ${
                  expandedSections.management ? 'rotate-90' : ''
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {expandedSections.management && (
              <div className="ml-4 mt-1 space-y-1">
                {navigation.management.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isRouteActive(item.href)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon name={item.icon} />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reports section */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
              onClick={() => toggleSection('reports')}
            >
              <div className="flex items-center">
                <Icon name="ChartBarIcon" />
                <span>Reports</span>
              </div>
              <svg
                className={`h-5 w-5 transform transition-transform ${
                  expandedSections.reports ? 'rotate-90' : ''
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {expandedSections.reports && (
              <div className="ml-4 mt-1 space-y-1">
                {navigation.reports.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isRouteActive(item.href)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon name={item.icon} />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            {navigation.settings.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isRouteActive(item.href)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon name={item.icon} />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
