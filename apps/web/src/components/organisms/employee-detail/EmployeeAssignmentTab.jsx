"use client";

/**
 * EmployeeAssignmentTab Component
 * Manages employee assignments with a list interface
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { PlusCircle, Edit, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Label } from '../../../components/atoms/Label';
import { useDispatch } from 'react-redux';

// Mock data for assignments
const generateMockAssignments = (employeeId) => {
  return {
    current: [
      {
        id: 'assign-1',
        title: 'Warehouse Operations',
        type: 'Department',
        startDate: '2024-01-15',
        endDate: null,
        status: 'Active',
        description: 'Responsible for warehouse inventory management and operations',
        location: 'Jakarta HQ',
        manager: 'Budi Santoso'
      },
      {
        id: 'assign-2',
        title: 'Inventory Specialist',
        type: 'Role',
        startDate: '2024-01-15',
        endDate: null,
        status: 'Active',
        description: 'Specialized role for inventory tracking and management',
        location: 'Jakarta HQ',
        manager: 'Budi Santoso'
      },
      {
        id: 'assign-3',
        title: 'System Implementation',
        type: 'Project',
        startDate: '2024-03-01',
        endDate: '2024-06-30',
        status: 'Active',
        description: 'Implementation of new warehouse management system',
        location: 'Jakarta HQ',
        manager: 'Dewi Putri'
      }
    ],
    available: [
      {
        id: 'assign-4',
        title: 'Delivery Coordination',
        type: 'Role',
        description: 'Coordinate delivery schedules and routes',
        location: 'Jakarta HQ',
        manager: 'Budi Santoso'
      },
      {
        id: 'assign-5',
        title: 'Customer Service',
        type: 'Department',
        description: 'Handle customer inquiries and issue resolution',
        location: 'Jakarta HQ',
        manager: 'Siti Rahayu'
      },
      {
        id: 'assign-6',
        title: 'Mobile App Testing',
        type: 'Project',
        description: 'User acceptance testing for new mobile application',
        location: 'Jakarta HQ',
        manager: 'Dewi Putri'
      },
      {
        id: 'assign-7',
        title: 'Training Program',
        type: 'Project',
        description: 'Develop training materials for new hires',
        location: 'Jakarta HQ',
        manager: 'Siti Rahayu'
      }
    ],
    history: [
      {
        id: 'assign-8',
        title: 'Onboarding',
        type: 'Project',
        startDate: '2024-01-01',
        endDate: '2024-01-14',
        status: 'Completed',
        description: 'New employee onboarding program',
        location: 'Jakarta HQ',
        manager: 'Siti Rahayu'
      }
    ]
  };
};

const EmployeeAssignmentTab = ({ employeeId }) => {
  const dispatch = useDispatch();
  const [assignments, setAssignments] = useState(generateMockAssignments(employeeId));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentType, setAssignmentType] = useState('current');
  
  // Function to handle adding an assignment from available to current
  const handleAddAssignment = (assignment) => {
    const newAssignment = {
      ...assignment,
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      status: 'Active'
    };
    
    setAssignments(prev => ({
      ...prev,
      current: [...prev.current, newAssignment],
      available: prev.available.filter(item => item.id !== assignment.id)
    }));
    
    dispatch({ 
      type: 'SHOW_NOTIFICATION', 
      payload: { 
        message: `Added ${assignment.title} to current assignments`, 
        type: 'success' 
      } 
    });
  };
  
  // Function to handle ending an assignment
  const handleEndAssignment = (assignment) => {
    const endedAssignment = {
      ...assignment,
      endDate: new Date().toISOString().split('T')[0],
      status: 'Completed'
    };
    
    setAssignments(prev => ({
      ...prev,
      current: prev.current.filter(item => item.id !== assignment.id),
      history: [...prev.history, endedAssignment]
    }));
    
    dispatch({ 
      type: 'SHOW_NOTIFICATION', 
      payload: { 
        message: `Ended ${assignment.title} assignment`, 
        type: 'success' 
      } 
    });
  };
  
  // Function to open assignment details dialog
  const handleOpenDialog = (assignment, type) => {
    setSelectedAssignment(assignment);
    setAssignmentType(type);
    setIsDialogOpen(true);
  };
  
  // Function to close assignment details dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAssignment(null);
  };

  // Function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'Completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Assignments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.current.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.current.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.title}</TableCell>
                    <TableCell>{assignment.type}</TableCell>
                    <TableCell>{assignment.startDate}</TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell>{assignment.location}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(assignment, 'current')}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEndAssignment(assignment)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No current assignments</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Available Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.available.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.available.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.title}</TableCell>
                    <TableCell>{assignment.type}</TableCell>
                    <TableCell className="max-w-xs truncate">{assignment.description}</TableCell>
                    <TableCell>{assignment.location}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddAssignment(assignment)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No available assignments</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment History */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment History</CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.history.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.title}</TableCell>
                    <TableCell>{assignment.type}</TableCell>
                    <TableCell>
                      {assignment.startDate} - {assignment.endDate}
                    </TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(assignment, 'history')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No assignment history</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assignment Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAssignment?.title || 'Assignment Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <p className="text-sm">{selectedAssignment.title}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="text-sm">{selectedAssignment.type}</p>
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="text-sm">{selectedAssignment.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <p className="text-sm">{selectedAssignment.location}</p>
                </div>
                <div>
                  <Label>Manager</Label>
                  <p className="text-sm">{selectedAssignment.manager}</p>
                </div>
              </div>
              
              {(assignmentType === 'current' || assignmentType === 'history') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <p className="text-sm">{selectedAssignment.startDate}</p>
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <p className="text-sm">{selectedAssignment.endDate || 'Ongoing'}</p>
                  </div>
                </div>
              )}
              
              {(assignmentType === 'current' || assignmentType === 'history') && (
                <div>
                  <Label>Status</Label>
                  <p className="text-sm">{getStatusBadge(selectedAssignment.status)}</p>
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                <Button onClick={handleCloseDialog}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

EmployeeAssignmentTab.propTypes = {
  employeeId: PropTypes.string.isRequired,
};

export default EmployeeAssignmentTab;
