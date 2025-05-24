"use client";

/**
 * BranchDivisionsTab Component
 * Displays and manages divisions assigned to a branch
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Typography from '../../atoms/Typography';
import Button from '../../atoms/Button';
import DataTable from '../../organisms/DataTable';
import Modal from '../../molecules/Modal';
import { 
  useGetDivisionsQuery,
  useAssignDivisionsToBranchMutation,
  useRemoveDivisionFromBranchMutation
} from '../../../store/api/masterDataApi';
import { createNotificationHandler } from '../../../utils/notificationUtils';

const BranchDivisionsTab = ({ branchId, divisions, isLoading }) => {
  const dispatch = useDispatch();
  const notifications = createNotificationHandler(dispatch);
  
  // State for modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedDivisions, setSelectedDivisions] = useState([]);
  const [divisionToRemove, setDivisionToRemove] = useState(null);
  
  // RTK Query hooks
  const { 
    data: allDivisionsData,
    isLoading: isLoadingAllDivisions
  } = useGetDivisionsQuery({ limit: 100 });
  
  const [assignDivisions, { isLoading: isAssigning }] = useAssignDivisionsToBranchMutation();
  const [removeDivision, { isLoading: isRemoving }] = useRemoveDivisionFromBranchMutation();
  
  // Handle assign divisions
  const handleAssignDivisions = async () => {
    try {
      await assignDivisions({
        branchId,
        divisionIds: selectedDivisions
      }).unwrap();
      
      notifications.success('Divisions assigned successfully');
      setIsAssignModalOpen(false);
      setSelectedDivisions([]);
    } catch (error) {
      console.error('Failed to assign divisions:', error);
      notifications.error(error?.data?.message || 'Failed to assign divisions');
    }
  };
  
  // Handle remove division
  const handleRemoveDivision = async () => {
    if (!divisionToRemove) return;
    
    try {
      await removeDivision({
        branchId,
        divisionId: divisionToRemove.id
      }).unwrap();
      
      notifications.success('Division removed successfully');
      setIsRemoveModalOpen(false);
      setDivisionToRemove(null);
    } catch (error) {
      console.error('Failed to remove division:', error);
      notifications.error(error?.data?.message || 'Failed to remove division');
    }
  };
  
  // Toggle division selection
  const toggleDivisionSelection = (divisionId) => {
    setSelectedDivisions((prev) => {
      if (prev.includes(divisionId)) {
        return prev.filter(id => id !== divisionId);
      } else {
        return [...prev, divisionId];
      }
    });
  };
  
  // Open remove confirmation
  const openRemoveConfirmation = (division) => {
    setDivisionToRemove(division);
    setIsRemoveModalOpen(true);
  };
  
  // Table columns
  const columns = [
    {
      header: 'Code',
      accessorKey: 'code',
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Manager',
      accessorKey: 'manager',
      cell: (info) => info.getValue() || '-',
    },
    {
      header: 'Contact Email',
      accessorKey: 'contactEmail',
      cell: (info) => info.getValue() || '-',
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: (info) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            info.getValue()
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {info.getValue() ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (info) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => openRemoveConfirmation(info.row.original)}
        >
          Remove
        </Button>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h2" className="text-xl font-semibold">
          Assigned Divisions
        </Typography>
        
        <Button
          variant="primary"
          onClick={() => setIsAssignModalOpen(true)}
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Assign Divisions
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={divisions}
        isLoading={isLoading}
        emptyMessage="No divisions assigned to this branch"
      />
      
      {/* Assign Divisions Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedDivisions([]);
        }}
        title="Assign Divisions to Branch"
      >
        <div className="space-y-6">
          <Typography variant="body2" className="mb-2">
            Select divisions to assign to this branch:
          </Typography>
          
          {isLoadingAllDivisions ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
              {allDivisionsData?.data?.map((division) => {
                const isAssigned = divisions.some(d => d.id === division.id);
                
                return (
                  <div key={division.id} className="flex items-center p-2 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={`division-${division.id}`}
                      value={division.id}
                      checked={selectedDivisions.includes(division.id)}
                      onChange={() => toggleDivisionSelection(division.id)}
                      disabled={isAssigned}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`division-${division.id}`} 
                      className={`ml-3 block text-sm font-medium ${
                        isAssigned ? 'text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {division.name} ({division.code})
                      {isAssigned && ' - Already assigned'}
                    </label>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAssignModalOpen(false);
                setSelectedDivisions([]);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleAssignDivisions}
              disabled={isAssigning || selectedDivisions.length === 0}
            >
              {isAssigning ? 'Assigning...' : 'Assign Divisions'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Remove Division Confirmation Modal */}
      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => {
          setIsRemoveModalOpen(false);
          setDivisionToRemove(null);
        }}
        title="Confirm Remove Division"
      >
        <div className="space-y-4">
          <Typography variant="body1">
            Are you sure you want to remove the division <span className="font-semibold">{divisionToRemove?.name}</span> from this branch?
          </Typography>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsRemoveModalOpen(false);
                setDivisionToRemove(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleRemoveDivision}
              disabled={isRemoving}
            >
              {isRemoving ? 'Removing...' : 'Remove Division'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

BranchDivisionsTab.propTypes = {
  branchId: PropTypes.string.isRequired,
  divisions: PropTypes.array,
  isLoading: PropTypes.bool,
};

BranchDivisionsTab.defaultProps = {
  divisions: [],
  isLoading: false,
};

export default BranchDivisionsTab;
