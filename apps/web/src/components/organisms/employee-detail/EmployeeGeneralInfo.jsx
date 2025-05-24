"use client";

/**
 * EmployeeGeneralInfo Component
 * Displays general information about an employee
 */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';

const EmployeeGeneralInfo = ({ employee }) => {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div>
        <Typography variant="h2" className="text-xl font-semibold mb-4">
          Personal Information
        </Typography>
        
        <Card className="overflow-hidden">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Full Name
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.name}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Employee ID
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.employeeId}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Date of Birth
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.dateOfBirth}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Gender
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.gender === 'MALE' ? 'Male' : 'Female'}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Nationality
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.nationality}
                </Typography>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Address
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.address}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Email
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.email}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Phone Number
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.phone}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Identity Number
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.identityNumber}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Tax Number
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.taxNumber}
                </Typography>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Employment Information */}
      <div>
        <Typography variant="h2" className="text-xl font-semibold mb-4">
          Employment Information
        </Typography>
        
        <Card className="overflow-hidden">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Position
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.position}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Department
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.department}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Branch
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.branch}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Join Date
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.joinDate}
                </Typography>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Status
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    employee.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                  </span>
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Contract Type
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    employee.contractType === 'PERMANENT'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {employee.contractType === 'PERMANENT' ? 'Permanent' : 'Contract'}
                  </span>
                </Typography>
              </div>
              
              {employee.contractEnd && (
                <div>
                  <Typography variant="body2" className="text-sm font-medium text-gray-500">
                    Contract End Date
                  </Typography>
                  <Typography variant="body1" className="text-gray-900">
                    {employee.contractEnd}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Bank Account */}
      <div>
        <Typography variant="h2" className="text-xl font-semibold mb-4">
          Bank Account
        </Typography>
        
        <Card className="overflow-hidden">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Bank Name
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.bankAccount.bank}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Account Number
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.bankAccount.accountNumber}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Account Name
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.bankAccount.accountName}
                </Typography>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Emergency Contact */}
      <div>
        <Typography variant="h2" className="text-xl font-semibold mb-4">
          Emergency Contact
        </Typography>
        
        <Card className="overflow-hidden">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Name
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.emergencyContact.name}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Relationship
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.emergencyContact.relationship}
                </Typography>
              </div>
              
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Phone Number
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {employee.emergencyContact.phone}
                </Typography>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Education */}
      <div>
        <Typography variant="h2" className="text-xl font-semibold mb-4">
          Education
        </Typography>
        
        <Card className="overflow-hidden">
          <div className="p-6">
            {employee.education.map((edu, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                  <Typography variant="body1" className="font-medium">
                    {edu.level} in {edu.major}
                  </Typography>
                </div>
                <div className="ml-4">
                  <Typography variant="body2" className="text-gray-700">
                    {edu.institution} ({edu.graduationYear})
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

EmployeeGeneralInfo.propTypes = {
  employee: PropTypes.object.isRequired,
};

export default EmployeeGeneralInfo;
