"use client";

/**
 * OrganizationalChartTab Component
 * Displays an interactive organizational chart for a branch
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../atoms/Typography';
import Card from '../../molecules/Card';
import Button from '../../atoms/Button';
import Modal from '../../molecules/Modal';

// Mock org chart data
const generateMockOrgChart = (branchId) => {
  return {
    id: `manager-${branchId}`,
    name: 'Branch Manager',
    title: 'Branch Manager',
    department: 'Management',
    email: 'manager@samudrapaket.com',
    phone: '021-5551234 ext. 101',
    image: null,
    children: [
      {
        id: `ops-${branchId}`,
        name: 'Operations Supervisor',
        title: 'Operations Supervisor',
        department: 'Operations',
        email: 'operations@samudrapaket.com',
        phone: '021-5551234 ext. 102',
        image: null,
        children: [
          {
            id: `warehouse-${branchId}`,
            name: 'Warehouse Coordinator',
            title: 'Warehouse Coordinator',
            department: 'Warehouse',
            email: 'warehouse@samudrapaket.com',
            phone: '021-5551234 ext. 103',
            image: null,
            children: []
          },
          {
            id: `courier-${branchId}`,
            name: 'Courier Coordinator',
            title: 'Courier Coordinator',
            department: 'Delivery',
            email: 'courier@samudrapaket.com',
            phone: '021-5551234 ext. 104',
            image: null,
            children: []
          },
          {
            id: `cs-${branchId}`,
            name: 'Customer Service Team',
            title: 'Customer Service Representatives',
            department: 'Customer Service',
            email: 'cs@samudrapaket.com',
            phone: '021-5551234 ext. 105',
            image: null,
            children: []
          }
        ]
      },
      {
        id: `admin-${branchId}`,
        name: 'Administrative Assistant',
        title: 'Administrative Assistant',
        department: 'Administration',
        email: 'admin@samudrapaket.com',
        phone: '021-5551234 ext. 106',
        image: null,
        children: []
      }
    ]
  };
};

// OrgChart Node Component
const OrgChartNode = ({ node, onNodeClick }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-48 p-3 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
        onClick={() => onNodeClick(node)}
      >
        <div className="flex items-center justify-center mb-2">
          {node.image ? (
            <img 
              src={node.image} 
              alt={node.name} 
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-medium text-lg">
                {node.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>
        <div className="text-center">
          <h4 className="text-sm font-medium">{node.title}</h4>
          <p className="text-xs text-gray-500">{node.department}</p>
        </div>
      </div>
      
      {node.children && node.children.length > 0 && (
        <>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex flex-col">
            <div className={`flex items-center ${node.children.length > 1 ? 'mb-4' : ''}`}>
              {node.children.length > 1 && (
                <div className="w-full h-px bg-gray-300"></div>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {node.children.map((childNode) => (
                <div key={childNode.id} className="flex flex-col items-center">
                  <OrgChartNode node={childNode} onNodeClick={onNodeClick} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

OrgChartNode.propTypes = {
  node: PropTypes.object.isRequired,
  onNodeClick: PropTypes.func.isRequired
};

const OrganizationalChartTab = ({ branchId }) => {
  const [orgChart, setOrgChart] = useState(generateMockOrgChart(branchId));
  const [selectedNode, setSelectedNode] = useState(null);
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Handle node click
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setIsNodeModalOpen(true);
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    if (zoomLevel < 150) {
      setZoomLevel(zoomLevel + 10);
    }
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    if (zoomLevel > 70) {
      setZoomLevel(zoomLevel - 10);
    }
  };
  
  // Handle reset zoom
  const handleResetZoom = () => {
    setZoomLevel(100);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h2" className="text-xl font-semibold">
          Organizational Chart
        </Typography>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 70}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetZoom}
          >
            {zoomLevel}%
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 150}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </Button>
        </div>
      </div>
      
      <Card className="p-6 overflow-auto">
        <div className="flex justify-center min-h-[600px] items-start">
          <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.3s ease' }}>
            <OrgChartNode node={orgChart} onNodeClick={handleNodeClick} />
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="p-4 border-b border-gray-200">
          <Typography variant="h3" className="text-lg font-medium">
            Legend
          </Typography>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary-100 border border-primary-300 rounded"></div>
              <span className="text-sm">Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-sm">Operations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm">Customer Service</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span className="text-sm">Warehouse</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
              <span className="text-sm">Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-sm">Administration</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Node Detail Modal */}
      <Modal
        isOpen={isNodeModalOpen}
        onClose={() => setIsNodeModalOpen(false)}
        title="Position Details"
      >
        {selectedNode && (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              {selectedNode.image ? (
                <img 
                  src={selectedNode.image} 
                  alt={selectedNode.name} 
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-xl">
                    {selectedNode.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-center mb-4">
              <Typography variant="h3" className="text-lg font-medium">
                {selectedNode.title}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {selectedNode.department}
              </Typography>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <span className="text-sm text-gray-900">{selectedNode.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Phone:</span>
                <span className="text-sm text-gray-900">{selectedNode.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Direct Reports:</span>
                <span className="text-sm text-gray-900">{selectedNode.children?.length || 0}</span>
              </div>
            </div>
            
            {selectedNode.children && selectedNode.children.length > 0 && (
              <div>
                <Typography variant="h4" className="text-md font-medium mt-4 mb-2">
                  Direct Reports
                </Typography>
                <ul className="space-y-2">
                  {selectedNode.children.map((child) => (
                    <li key={child.id} className="text-sm">
                      <button 
                        className="text-primary-600 hover:text-primary-800 font-medium"
                        onClick={() => {
                          setSelectedNode(child);
                        }}
                      >
                        {child.title}
                      </button>
                      <span className="text-gray-500 ml-2">({child.department})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsNodeModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

OrganizationalChartTab.propTypes = {
  branchId: PropTypes.string.isRequired,
};

export default OrganizationalChartTab;
