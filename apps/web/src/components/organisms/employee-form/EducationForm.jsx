"use client";

/**
 * EducationForm Component
 * Seventh step in the employee form wizard for collecting education information
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';
import Card from '../../molecules/Card';
import FormField from '../../molecules/FormField';

// Education levels
const EDUCATION_LEVELS = [
  'High School', 'Diploma', 'Associate Degree', 'Bachelor', 'Master', 'Doctorate', 'Professional Certification', 'Other'
];

const EducationForm = ({ data, updateData }) => {
  const [education, setEducation] = useState(data.education || []);
  const [showForm, setShowForm] = useState(false);
  const [currentEducation, setCurrentEducation] = useState({
    id: '',
    level: EDUCATION_LEVELS[0],
    institution: '',
    major: '',
    graduationYear: '',
    gpa: '',
    description: '',
  });
  
  // Update parent form data when education changes
  useEffect(() => {
    updateData({ education });
  }, [education, updateData]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEducation({
      ...currentEducation,
      [name]: value
    });
  };
  
  // Add new education
  const handleAddEducation = (e) => {
    e.preventDefault();
    
    if (!currentEducation.institution || !currentEducation.level || !currentEducation.graduationYear) {
      // Show error notification
      return;
    }
    
    const newEducation = {
      ...currentEducation,
      id: `edu-${Date.now()}`
    };
    
    setEducation([...education, newEducation]);
    setShowForm(false);
    setCurrentEducation({
      id: '',
      level: EDUCATION_LEVELS[0],
      institution: '',
      major: '',
      graduationYear: '',
      gpa: '',
      description: '',
    });
  };
  
  // Edit education
  const handleEditEducation = (edu) => {
    setCurrentEducation(edu);
    setShowForm(true);
  };
  
  // Update education
  const handleUpdateEducation = (e) => {
    e.preventDefault();
    
    if (!currentEducation.institution || !currentEducation.level || !currentEducation.graduationYear) {
      // Show error notification
      return;
    }
    
    setEducation(education.map(edu => 
      edu.id === currentEducation.id ? currentEducation : edu
    ));
    setShowForm(false);
    setCurrentEducation({
      id: '',
      level: EDUCATION_LEVELS[0],
      institution: '',
      major: '',
      graduationYear: '',
      gpa: '',
      description: '',
    });
  };
  
  // Remove education
  const handleRemoveEducation = (id) => {
    setEducation(education.filter(edu => edu.id !== id));
  };
  
  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentEducation({
      id: '',
      level: EDUCATION_LEVELS[0],
      institution: '',
      major: '',
      graduationYear: '',
      gpa: '',
      description: '',
    });
  };
  
  return (
    <div className="space-y-6">
      <Typography variant="h2" className="text-xl font-semibold">
        Education Background
      </Typography>
      
      <div className="flex justify-between items-center mb-4">
        <Typography variant="body1" className="text-gray-600">
          Add educational qualifications and certifications
        </Typography>
        
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Education
        </Button>
      </div>
      
      {/* Education form */}
      {showForm && (
        <Card className="mb-6">
          <div className="p-4">
            <Typography variant="h3" className="text-lg font-semibold mb-4">
              {currentEducation.id ? 'Edit Education' : 'Add Education'}
            </Typography>
            
            <form onSubmit={currentEducation.id ? handleUpdateEducation : handleAddEducation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  id="level"
                  label="Education Level"
                  type="select"
                  name="level"
                  value={currentEducation.level}
                  onChange={handleInputChange}
                  required
                  options={EDUCATION_LEVELS.map(level => ({ value: level, label: level }))}
                />
                
                <FormField
                  id="institution"
                  label="Institution Name"
                  type="text"
                  name="institution"
                  value={currentEducation.institution}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter institution name"
                />
                
                <FormField
                  id="major"
                  label="Major/Field of Study"
                  type="text"
                  name="major"
                  value={currentEducation.major}
                  onChange={handleInputChange}
                  placeholder="Enter major or field of study"
                />
                
                <FormField
                  id="graduationYear"
                  label="Graduation Year"
                  type="text"
                  name="graduationYear"
                  value={currentEducation.graduationYear}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 2015"
                />
                
                <FormField
                  id="gpa"
                  label="GPA/Grade"
                  type="text"
                  name="gpa"
                  value={currentEducation.gpa}
                  onChange={handleInputChange}
                  placeholder="e.g., 3.5 or A (optional)"
                />
                
                <div className="md:col-span-2">
                  <FormField
                    id="description"
                    label="Additional Information"
                    type="textarea"
                    name="description"
                    value={currentEducation.description}
                    onChange={handleInputChange}
                    placeholder="Enter additional information (optional)"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {currentEducation.id ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}
      
      {/* Education list */}
      {education.length > 0 ? (
        <div className="space-y-4">
          {education.map((edu) => (
            <Card key={edu.id} className="overflow-hidden">
              <div className="p-4 flex justify-between">
                <div>
                  <div className="flex items-center">
                    <Typography variant="h3" className="text-lg font-medium text-gray-900">
                      {edu.level}
                    </Typography>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                      {edu.graduationYear}
                    </span>
                  </div>
                  
                  <Typography variant="body1" className="mt-1 text-gray-600">
                    {edu.institution}
                  </Typography>
                  
                  {edu.major && (
                    <Typography variant="body2" className="mt-1 text-gray-500">
                      {edu.major} {edu.gpa && `• GPA: ${edu.gpa}`}
                    </Typography>
                  )}
                  
                  {edu.description && (
                    <Typography variant="body2" className="mt-2 text-gray-500">
                      {edu.description}
                    </Typography>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditEducation(edu)}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveEducation(edu.id)}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <Typography variant="body1" className="mt-2 text-gray-500">
            No education records added yet
          </Typography>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => setShowForm(true)}
          >
            Add Education
          </Button>
        </div>
      )}
    </div>
  );
};

EducationForm.propTypes = {
  data: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
};

export default EducationForm;
