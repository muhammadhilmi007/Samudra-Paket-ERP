"use client";

/**
 * EmployeeSkillsTab Component
 * Displays employee skills matrix and competencies
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Modal from '../../molecules/Modal';
import { createNotificationHandler } from '../../../utils/notificationUtils';
import { useDispatch } from 'react-redux';

// Skill levels
const SKILL_LEVELS = [
  { value: 1, label: 'Novice', color: 'bg-red-100 text-red-800' },
  { value: 2, label: 'Basic', color: 'bg-orange-100 text-orange-800' },
  { value: 3, label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { value: 4, label: 'Advanced', color: 'bg-green-100 text-green-800' },
  { value: 5, label: 'Expert', color: 'bg-blue-100 text-blue-800' },
];

// Skill categories
const SKILL_CATEGORIES = [
  'Technical',
  'Operational',
  'Communication',
  'Management',
  'Software',
  'Safety',
];

// Mock data for skills
const generateMockSkills = (employeeId) => {
  return [
    {
      id: `skill-${employeeId}-1`,
      name: 'Delivery Route Optimization',
      category: 'Operational',
      level: 4,
      lastAssessed: '2023-10-15',
      assessedBy: 'John Doe',
      description: 'Ability to plan and optimize delivery routes for efficiency',
      certifications: ['Route Planning Certificate'],
    },
    {
      id: `skill-${employeeId}-2`,
      name: 'Customer Service',
      category: 'Communication',
      level: 5,
      lastAssessed: '2023-10-15',
      assessedBy: 'John Doe',
      description: 'Ability to communicate effectively with customers and resolve issues',
      certifications: ['Customer Service Excellence'],
    },
    {
      id: `skill-${employeeId}-3`,
      name: 'Package Handling',
      category: 'Operational',
      level: 4,
      lastAssessed: '2023-10-15',
      assessedBy: 'John Doe',
      description: 'Proper techniques for handling packages of various sizes and weights',
      certifications: [],
    },
    {
      id: `skill-${employeeId}-4`,
      name: 'Delivery Documentation',
      category: 'Technical',
      level: 3,
      lastAssessed: '2023-10-15',
      assessedBy: 'John Doe',
      description: 'Accurate completion of delivery documentation and records',
      certifications: [],
    },
    {
      id: `skill-${employeeId}-5`,
      name: 'Mobile App Proficiency',
      category: 'Software',
      level: 4,
      lastAssessed: '2023-10-15',
      assessedBy: 'John Doe',
      description: 'Ability to effectively use the company mobile app for deliveries',
      certifications: [],
    },
    {
      id: `skill-${employeeId}-6`,
      name: 'Safe Driving',
      category: 'Safety',
      level: 5,
      lastAssessed: '2023-10-15',
      assessedBy: 'John Doe',
      description: 'Knowledge and application of safe driving practices',
      certifications: ['Advanced Driver Certificate'],
    },
    {
      id: `skill-${employeeId}-7`,
      name: 'Problem Solving',
      category: 'Operational',
      level: 4,
      lastAssessed: '2023-10-15',
      assessedBy: 'John Doe',
      description: 'Ability to identify and resolve delivery issues independently',
      certifications: [],
    },
    {
      id: `skill-${employeeId}-8`,
      name: 'Team Leadership',
      category: 'Management',
      level: 3,
      lastAssessed: '2023-10-15',
      assessedBy: 'John Doe',
      description: 'Ability to lead and coordinate a team of delivery personnel',
      certifications: [],
    },
    {
      id: `skill-${employeeId}-9`,
      name: 'Inventory Management',
      category: 'Operational',
      level: 2,
      lastAssessed: '2023-10-15',
      assessedBy: 'John Doe',
      description: 'Knowledge of inventory management principles and practices',
      certifications: [],
    },
    {
      id: `skill-${employeeId}-10`,
      name: 'GPS Navigation',
      category: 'Technical',
      level: 5,
      lastAssessed: '2023-10-15',
      assessedBy: 'John Doe',
      description: 'Proficient use of GPS navigation systems for route planning',
      certifications: [],
    },
    {
      id: `skill-${employeeId}-11`,
      name: 'Conflict Resolution',
      category: 'Communication',
      level: 4,
      lastAssessed: '2023-10-15',
      assessedBy: 'John Doe',
      description: 'Ability to handle and resolve conflicts with customers or team members',
      certifications: [],
    },
    {
      id: `skill-${employeeId}-12`,
      name: 'Time Management',
      category: 'Management',
      level: 4,
      lastAssessed: '2023-10-15',
      assessedBy: 'John Doe',
      description: 'Effective management of time to meet delivery schedules',
      certifications: [],
    },
  ];
};

const EmployeeSkillsTab = ({ employeeId }) => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State
  const [skills, setSkills] = useState(generateMockSkills(employeeId));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [filteredCategory, setFilteredCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: SKILL_CATEGORIES[0],
    level: 1,
    description: '',
    certifications: '',
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = searchTerm === '' || 
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filteredCategory === '' || skill.category === filteredCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Group skills by category
  const groupedSkills = filteredSkills.reduce((groups, skill) => {
    if (!groups[skill.category]) {
      groups[skill.category] = [];
    }
    groups[skill.category].push(skill);
    return groups;
  }, {});
  
  // Open add modal
  const openAddModal = () => {
    setFormData({
      name: '',
      category: SKILL_CATEGORIES[0],
      level: 1,
      description: '',
      certifications: '',
    });
    setIsAddModalOpen(true);
  };
  
  // Open edit modal
  const openEditModal = (skill) => {
    setSelectedSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      description: skill.description,
      certifications: skill.certifications.join(', '),
    });
    setIsEditModalOpen(true);
  };
  
  // Handle add skill
  const handleAddSkill = () => {
    // Validate form
    if (!formData.name || !formData.category) {
      notifications.error('Please fill in all required fields');
      return;
    }
    
    // Create new skill
    const newSkill = {
      id: `skill-${employeeId}-${skills.length + 1}`,
      name: formData.name,
      category: formData.category,
      level: parseInt(formData.level),
      lastAssessed: new Date().toISOString().split('T')[0],
      assessedBy: 'Current User', // Would be the actual user in a real app
      description: formData.description,
      certifications: formData.certifications ? formData.certifications.split(',').map(cert => cert.trim()) : [],
    };
    
    setSkills([...skills, newSkill]);
    setIsAddModalOpen(false);
    notifications.success('Skill added successfully');
  };
  
  // Handle edit skill
  const handleEditSkill = () => {
    // Validate form
    if (!formData.name || !formData.category) {
      notifications.error('Please fill in all required fields');
      return;
    }
    
    // Update skill
    const updatedSkills = skills.map(skill => {
      if (skill.id === selectedSkill.id) {
        return {
          ...skill,
          name: formData.name,
          category: formData.category,
          level: parseInt(formData.level),
          lastAssessed: new Date().toISOString().split('T')[0],
          assessedBy: 'Current User', // Would be the actual user in a real app
          description: formData.description,
          certifications: formData.certifications ? formData.certifications.split(',').map(cert => cert.trim()) : [],
        };
      }
      return skill;
    });
    
    setSkills(updatedSkills);
    setIsEditModalOpen(false);
    notifications.success('Skill updated successfully');
  };
  
  // Get skill level label and color
  const getSkillLevel = (level) => {
    return SKILL_LEVELS.find(skillLevel => skillLevel.value === level);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h2" className="text-xl font-semibold">
          Skills Matrix
        </Typography>
        
        <Button
          variant="primary"
          onClick={openAddModal}
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Skill
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="filterCategory"
                value={filteredCategory}
                onChange={(e) => setFilteredCategory(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">All Categories</option>
                {SKILL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Skills Matrix */}
      {Object.keys(groupedSkills).length === 0 ? (
        <Card>
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <Typography variant="body1" className="mt-2 text-gray-600">
              No skills found
            </Typography>
          </div>
        </Card>
      ) : (
        Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            <Typography variant="h3" className="text-lg font-medium mb-3">
              {category}
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {categorySkills.map((skill) => {
                const skillLevel = getSkillLevel(skill.level);
                
                return (
                  <Card key={skill.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <Typography variant="h4" className="text-md font-medium">
                          {skill.name}
                        </Typography>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${skillLevel.color}`}>
                          {skillLevel.label}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${(skill.level / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-600 line-clamp-2">
                        {skill.description}
                      </div>
                      
                      {skill.certifications.length > 0 && (
                        <div className="mt-3">
                          <Typography variant="body2" className="text-xs text-gray-500">
                            Certifications:
                          </Typography>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {skill.certifications.map((cert, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 flex justify-between text-xs text-gray-500">
                        <div>
                          Last assessed: {skill.lastAssessed}
                        </div>
                        <div>
                          By: {skill.assessedBy}
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(skill)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
      
      {/* Add Skill Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Skill"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Skill Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Route Optimization"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              {SKILL_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Skill Level *
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              {SKILL_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.value} - {level.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter skill description"
            />
          </div>
          
          <div>
            <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">
              Certifications
            </label>
            <input
              type="text"
              id="certifications"
              name="certifications"
              value={formData.certifications}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Route Planning Certificate, Safe Driver Certificate"
            />
            <p className="mt-1 text-xs text-gray-500">Separate multiple certifications with commas</p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddSkill}
              disabled={!formData.name || !formData.category}
            >
              Add Skill
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Edit Skill Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Skill"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="editName" className="block text-sm font-medium text-gray-700">
              Skill Name *
            </label>
            <input
              type="text"
              id="editName"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Route Optimization"
              required
            />
          </div>
          
          <div>
            <label htmlFor="editCategory" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="editCategory"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              {SKILL_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="editLevel" className="block text-sm font-medium text-gray-700">
              Skill Level *
            </label>
            <select
              id="editLevel"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required
            >
              {SKILL_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.value} - {level.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="editDescription"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Enter skill description"
            />
          </div>
          
          <div>
            <label htmlFor="editCertifications" className="block text-sm font-medium text-gray-700">
              Certifications
            </label>
            <input
              type="text"
              id="editCertifications"
              name="certifications"
              value={formData.certifications}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Route Planning Certificate, Safe Driver Certificate"
            />
            <p className="mt-1 text-xs text-gray-500">Separate multiple certifications with commas</p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditSkill}
              disabled={!formData.name || !formData.category}
            >
              Update Skill
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

EmployeeSkillsTab.propTypes = {
  employeeId: PropTypes.string.isRequired,
};

export default EmployeeSkillsTab;
