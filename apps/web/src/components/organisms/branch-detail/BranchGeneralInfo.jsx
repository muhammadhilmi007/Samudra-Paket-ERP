"use client";

/**
 * BranchGeneralInfo Component
 * Displays general information about a branch
 */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';

const BranchGeneralInfo = ({ branch }) => {
  if (!branch) {
    return <div>No branch information available</div>;
  }

  const infoSections = [
    {
      title: 'Basic Information',
      items: [
        { label: 'Branch Code', value: branch.code },
        { label: 'Branch Name', value: branch.name },
        { label: 'Status', value: branch.isActive ? 'Active' : 'Inactive' },
      ],
    },
    {
      title: 'Contact Information',
      items: [
        { label: 'Email', value: branch.email || '-' },
        { label: 'Phone', value: branch.phone || '-' },
        { label: 'Manager', value: branch.manager || '-' },
      ],
    },
    {
      title: 'Address Information',
      items: [
        { label: 'Address', value: branch.address || '-' },
        { label: 'City', value: branch.city || '-' },
        { label: 'Province', value: branch.province || '-' },
        { label: 'Postal Code', value: branch.postalCode || '-' },
        { label: 'Country', value: branch.country || 'Indonesia' },
      ],
    },
    {
      title: 'Location Coordinates',
      items: [
        { label: 'Latitude', value: branch.latitude || '-' },
        { label: 'Longitude', value: branch.longitude || '-' },
      ],
    },
    {
      title: 'Additional Information',
      items: [
        { label: 'Established Date', value: branch.establishedDate ? new Date(branch.establishedDate).toLocaleDateString() : '-' },
        { label: 'Branch Type', value: branch.branchType || '-' },
        { label: 'Operating Hours', value: branch.operatingHours || '-' },
        { label: 'Capacity', value: branch.capacity ? `${branch.capacity} packages/day` : '-' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <Typography variant="h2" className="text-xl font-semibold mb-4">
        General Information
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoSections.map((section) => (
          <Card key={section.title} className="overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <Typography variant="h3" className="text-md font-medium">
                {section.title}
              </Typography>
            </div>
            <div className="p-4">
              <dl className="divide-y divide-gray-200">
                {section.items.map((item) => (
                  <div key={item.label} className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                    <dd className="text-sm text-gray-900 text-right">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>
        ))}
      </div>
      
      {branch.description && (
        <Card>
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <Typography variant="h3" className="text-md font-medium">
              Description
            </Typography>
          </div>
          <div className="p-4">
            <Typography variant="body1">
              {branch.description}
            </Typography>
          </div>
        </Card>
      )}
    </div>
  );
};

BranchGeneralInfo.propTypes = {
  branch: PropTypes.shape({
    id: PropTypes.string,
    code: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    province: PropTypes.string,
    postalCode: PropTypes.string,
    country: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    manager: PropTypes.string,
    latitude: PropTypes.string,
    longitude: PropTypes.string,
    isActive: PropTypes.bool,
    description: PropTypes.string,
    establishedDate: PropTypes.string,
    branchType: PropTypes.string,
    operatingHours: PropTypes.string,
    capacity: PropTypes.number,
  }),
};

export default BranchGeneralInfo;
