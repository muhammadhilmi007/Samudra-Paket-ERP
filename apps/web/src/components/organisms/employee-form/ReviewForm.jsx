"use client";

/**
 * ReviewForm Component
 * Final step in the employee form wizard for reviewing all information
 */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';

const ReviewForm = ({ data, mode }) => {
  return (
    <div className="space-y-6">
      <Typography variant="h2" className="text-xl font-semibold">
        Review Information
      </Typography>
      
      <Typography variant="body1" className="text-gray-600 mb-6">
        Please review all information before submitting. You can go back to previous steps to make changes if needed.
      </Typography>
      
      {/* Personal Information */}
      <div>
        <Typography variant="h3" className="text-lg font-semibold mb-3">
          Personal Information
        </Typography>
        
        <Card className="overflow-hidden mb-6">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Full Name
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.name || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Employee ID
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.employeeId || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Date of Birth
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.dateOfBirth || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Gender
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.gender === 'MALE' ? 'Male' : data.gender === 'FEMALE' ? 'Female' : data.gender || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Nationality
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.nationality || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Identity Number
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.identityNumber || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Tax Number
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.taxNumber || 'Not provided'}
              </Typography>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Employment Information */}
      <div>
        <Typography variant="h3" className="text-lg font-semibold mb-3">
          Employment Information
        </Typography>
        
        <Card className="overflow-hidden mb-6">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Position
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.position || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Department
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.department || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Branch
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.branch || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Join Date
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.joinDate || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Status
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  data.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {data.status === 'ACTIVE' ? 'Active' : data.status || 'Not provided'}
                </span>
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Contract Type
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  data.contractType === 'PERMANENT'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {data.contractType === 'PERMANENT' ? 'Permanent' : data.contractType || 'Not provided'}
                </span>
              </Typography>
            </div>
            
            {data.contractType !== 'PERMANENT' && (
              <div>
                <Typography variant="body2" className="text-sm font-medium text-gray-500">
                  Contract End Date
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {data.contractEnd || 'Not provided'}
                </Typography>
              </div>
            )}
          </div>
        </Card>
      </div>
      
      {/* Contact Information */}
      <div>
        <Typography variant="h3" className="text-lg font-semibold mb-3">
          Contact Information
        </Typography>
        
        <Card className="overflow-hidden mb-6">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Email
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.email || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Phone
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.phone || 'Not provided'}
              </Typography>
            </div>
            
            <div className="md:col-span-2">
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Address
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.address || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                City
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.city || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Province
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.province || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Postal Code
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.postalCode || 'Not provided'}
              </Typography>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Documents */}
      <div>
        <Typography variant="h3" className="text-lg font-semibold mb-3">
          Documents
        </Typography>
        
        <Card className="overflow-hidden mb-6">
          <div className="p-4">
            {data.documents && data.documents.length > 0 ? (
              <div className="space-y-2">
                {data.documents.map((doc, index) => (
                  <div key={doc.id || index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <Typography variant="body1" className="font-medium">
                        {doc.name}
                      </Typography>
                      <Typography variant="body2" className="text-sm text-gray-500">
                        {doc.type} • {doc.category}
                      </Typography>
                    </div>
                    <div className="text-sm text-gray-500">
                      {doc.fileSize} KB • {doc.fileType}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Typography variant="body1" className="text-gray-500">
                No documents uploaded
              </Typography>
            )}
          </div>
        </Card>
      </div>
      
      {/* Bank Information */}
      <div>
        <Typography variant="h3" className="text-lg font-semibold mb-3">
          Bank Information
        </Typography>
        
        <Card className="overflow-hidden mb-6">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Bank Name
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.bankAccount?.bank || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Account Number
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.bankAccount?.accountNumber || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Account Holder Name
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.bankAccount?.accountName || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Branch
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.bankAccount?.branch || 'Not provided'}
              </Typography>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Emergency Contact */}
      <div>
        <Typography variant="h3" className="text-lg font-semibold mb-3">
          Emergency Contact
        </Typography>
        
        <Card className="overflow-hidden mb-6">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Name
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.emergencyContact?.name || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Relationship
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.emergencyContact?.relationship || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Phone
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.emergencyContact?.phone || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Alternate Phone
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.emergencyContact?.alternatePhone || 'Not provided'}
              </Typography>
            </div>
            
            <div>
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Email
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.emergencyContact?.email || 'Not provided'}
              </Typography>
            </div>
            
            <div className="md:col-span-2">
              <Typography variant="body2" className="text-sm font-medium text-gray-500">
                Address
              </Typography>
              <Typography variant="body1" className="text-gray-900">
                {data.emergencyContact?.address || 'Not provided'}
              </Typography>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Education */}
      <div>
        <Typography variant="h3" className="text-lg font-semibold mb-3">
          Education
        </Typography>
        
        <Card className="overflow-hidden mb-6">
          <div className="p-4">
            {data.education && data.education.length > 0 ? (
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={edu.id || index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <Typography variant="body1" className="font-medium">
                        {edu.level}
                      </Typography>
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                        {edu.graduationYear}
                      </span>
                    </div>
                    
                    <Typography variant="body2" className="mt-1">
                      {edu.institution}
                    </Typography>
                    
                    {edu.major && (
                      <Typography variant="body2" className="text-sm text-gray-500 mt-1">
                        {edu.major} {edu.gpa && `• GPA: ${edu.gpa}`}
                      </Typography>
                    )}
                    
                    {edu.description && (
                      <Typography variant="body2" className="text-sm text-gray-500 mt-1">
                        {edu.description}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Typography variant="body1" className="text-gray-500">
                No education records added
              </Typography>
            )}
          </div>
        </Card>
      </div>
      
      {/* Submission Notice */}
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <Typography variant="body1" className="text-sm text-blue-800 font-medium">
              Ready to {mode === 'add' ? 'create' : 'update'} employee record
            </Typography>
            <Typography variant="body2" className="text-sm text-blue-700 mt-1">
              By clicking Submit, you confirm that all the information provided is accurate and complete. You can go back to previous steps to make changes if needed.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

ReviewForm.propTypes = {
  data: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(['add', 'edit']).isRequired,
};

export default ReviewForm;
