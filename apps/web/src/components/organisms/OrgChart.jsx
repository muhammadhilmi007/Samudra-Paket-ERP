"use client";

/**
 * OrgChart Component
 * Displays an interactive organizational chart with employee positioning
 */

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../atoms/Typography';

const OrgChart = ({ data, onNodeClick }) => {
  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Get a consistent color for a department
  const getDepartmentColor = (department) => {
    const colors = {
      'Management': '#3b82f6', // blue-500
      'Finance': '#10b981', // emerald-500
      'Human Resources': '#8b5cf6', // violet-500
      'IT': '#6366f1', // indigo-500
      'Operations': '#f59e0b', // amber-500
      'Warehouse': '#d97706', // amber-600
      'Delivery': '#ef4444', // red-500
      'Customer Service': '#ec4899', // pink-500
      'Marketing': '#8b5cf6', // violet-500
    };
    
    return colors[department] || '#6b7280'; // gray-500 as default
  };
  
  // Recursive function to render a node and its children
  const renderNode = (node) => {
    if (!node) return null;
    
    const departmentColor = getDepartmentColor(node.department);
    
    return (
      <li key={node.id}>
        <div className="relative">
          <div 
            className="border-2 rounded-lg p-3 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow duration-200"
            style={{ borderColor: departmentColor }}
            onClick={() => onNodeClick(node)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 mr-3">
                {node.avatar ? (
                  <img
                    className="h-12 w-12 rounded-full"
                    src={node.avatar}
                    alt={node.name}
                  />
                ) : (
                  <div 
                    className="h-12 w-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: departmentColor + '20' }} // 20% opacity
                  >
                    <span style={{ color: departmentColor }} className="font-bold text-lg">
                      {getInitials(node.name)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <Typography variant="body1" className="font-medium text-gray-900">
                  {node.name}
                </Typography>
                <Typography variant="body2" className="text-sm text-gray-600">
                  {node.title}
                </Typography>
                <Typography variant="body2" className="text-xs text-gray-500">
                  {node.department}
                </Typography>
              </div>
            </div>
          </div>
        </div>
        
        {node.children && node.children.length > 0 && (
          <ul className="children mt-6 ml-6 relative">
            {/* Vertical line from parent to children connector */}
            <div className="absolute left-0 -top-6 w-0.5 h-6 bg-gray-300"></div>
            
            {/* Horizontal line above all children */}
            {node.children.length > 1 && (
              <div className="absolute left-0 top-0 h-0.5 bg-gray-300" style={{ width: `calc(100% - ${node.children.length > 1 ? 12 : 0}px)` }}></div>
            )}
            
            {/* Render all children */}
            {node.children.map((child, index) => {
              const isFirst = index === 0;
              const isLast = index === node.children.length - 1;
              
              return (
                <div key={child.id} className="relative">
                  {/* Vertical line to each child */}
                  {node.children.length > 1 && (
                    <div className="absolute left-0 -top-0.5 w-0.5 h-6 bg-gray-300"></div>
                  )}
                  
                  {renderNode(child)}
                </div>
              );
            })}
          </ul>
        )}
      </li>
    );
  };
  
  return (
    <div className="org-chart-container p-8">
      <ul className="org-chart flex flex-col items-center">
        {renderNode(data)}
      </ul>
    </div>
  );
};

OrgChart.propTypes = {
  data: PropTypes.object.isRequired,
  onNodeClick: PropTypes.func.isRequired,
};

export default OrgChart;
