"use client";

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';

/**
 * KanbanBoard Component
 * A flexible kanban board for task management and workflow visualization
 */
const KanbanBoard = ({
  columns = [],
  tasks = [],
  onColumnAdd,
  onColumnUpdate,
  onColumnDelete,
  onTaskAdd,
  onTaskUpdate,
  onTaskDelete,
  onTaskMove,
  className = '',
  columnClassName = '',
  taskClassName = '',
  loading = false,
  loadingMessage = 'Loading board...',
  emptyMessage = 'No columns available',
  readonly = false,
  ...props
}) => {
  // State for drag and drop operations
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    setIsDragging(false);

    const { source, destination, type } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Handle column reordering
    if (type === 'column') {
      const reorderedColumns = [...columns];
      const [removed] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, removed);

      // Call onColumnUpdate with reordered columns
      if (onColumnUpdate) {
        reorderedColumns.forEach((column, index) => {
          onColumnUpdate({ ...column, order: index });
        });
      }

      return;
    }

    // Handle task movement
    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destinationColumn = columns.find((col) => col.id === destination.droppableId);

    // Moving within the same column
    if (sourceColumn.id === destinationColumn.id) {
      const columnTasks = tasks
        .filter((task) => task.columnId === sourceColumn.id)
        .sort((a, b) => a.order - b.order);

      const [movedTask] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, movedTask);

      // Update task orders
      if (onTaskUpdate) {
        columnTasks.forEach((task, index) => {
          if (task.order !== index) {
            onTaskUpdate({ ...task, order: index });
          }
        });
      }
    } else {
      // Moving to a different column
      const sourceTasks = tasks
        .filter((task) => task.columnId === sourceColumn.id)
        .sort((a, b) => a.order - b.order);

      const destinationTasks = tasks
        .filter((task) => task.columnId === destinationColumn.id)
        .sort((a, b) => a.order - b.order);

      const [movedTask] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, movedTask);

      // Update the moved task with new column and order
      if (onTaskMove) {
        onTaskMove({
          ...movedTask,
          columnId: destinationColumn.id,
          order: destination.index,
        });
      }

      // Update the order of tasks in the source column
      if (onTaskUpdate && sourceTasks.length > 0) {
        sourceTasks.forEach((task, index) => {
          if (task.order !== index) {
            onTaskUpdate({ ...task, order: index });
          }
        });
      }

      // Update the order of tasks in the destination column
      if (onTaskUpdate && destinationTasks.length > 0) {
        destinationTasks.forEach((task, index) => {
          if (task.order !== index) {
            onTaskUpdate({ ...task, order: index });
          }
        });
      }
    }
  };

  // Handle adding a new column
  const handleAddColumn = () => {
    if (readonly) return;
    
    if (onColumnAdd) {
      onColumnAdd({
        title: 'New Column',
        order: columns.length,
      });
    }
  };

  // Handle adding a new task
  const handleAddTask = (columnId) => {
    if (readonly) return;
    
    if (onTaskAdd) {
      const columnTasks = tasks
        .filter((task) => task.columnId === columnId)
        .sort((a, b) => a.order - b.order);
      
      onTaskAdd({
        title: 'New Task',
        description: '',
        columnId,
        order: columnTasks.length,
      });
    }
  };

  // Handle column title update
  const handleColumnTitleChange = (column, newTitle) => {
    if (readonly) return;
    
    if (onColumnUpdate) {
      onColumnUpdate({
        ...column,
        title: newTitle,
      });
    }
  };

  // Handle column deletion
  const handleColumnDelete = (columnId) => {
    if (readonly) return;
    
    if (onColumnDelete) {
      onColumnDelete(columnId);
    }
  };

  // Handle task update
  const handleTaskUpdate = (task, updates) => {
    if (readonly) return;
    
    if (onTaskUpdate) {
      onTaskUpdate({
        ...task,
        ...updates,
      });
    }
  };

  // Handle task deletion
  const handleTaskDelete = (taskId) => {
    if (readonly) return;
    
    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        {loadingMessage}
      </div>
    );
  }

  // Render empty state
  if (columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="mb-4">{emptyMessage}</p>
        {!readonly && (
          <button
            type="button"
            onClick={handleAddColumn}
            className="flex items-center px-4 py-2 text-sm rounded-md bg-primary-500 text-white hover:bg-primary-600"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Column
          </button>
        )}
      </div>
    );
  }

  // Render kanban board
  return (
    <div
      className={cn(
        'w-full overflow-x-auto',
        isDragging && 'cursor-grabbing',
        className
      )}
      {...props}
    >
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex space-x-4 p-4 min-h-[calc(100vh-200px)]"
            >
              {/* Columns */}
              {columns
                .sort((a, b) => a.order - b.order)
                .map((column, index) => (
                  <Draggable
                    key={column.id}
                    draggableId={column.id}
                    index={index}
                    isDragDisabled={readonly}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          'flex flex-col w-80 min-w-80 bg-gray-50 rounded-md border border-gray-200',
                          snapshot.isDragging && 'shadow-lg',
                          columnClassName
                        )}
                      >
                        {/* Column header */}
                        <div
                          {...provided.dragHandleProps}
                          className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-100 rounded-t-md"
                        >
                          <div className="flex-1">
                            {readonly ? (
                              <h3 className="font-medium text-gray-900 truncate">
                                {column.title}
                              </h3>
                            ) : (
                              <input
                                type="text"
                                value={column.title}
                                onChange={(e) => handleColumnTitleChange(column, e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 font-medium text-gray-900"
                              />
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">
                              {tasks.filter((task) => task.columnId === column.id).length}
                            </span>
                            {!readonly && (
                              <div className="relative group">
                                <button
                                  type="button"
                                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                                >
                                  <EllipsisHorizontalIcon className="h-5 w-5" />
                                </button>
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 hidden group-hover:block z-10">
                                  <div className="py-1">
                                    <button
                                      type="button"
                                      onClick={() => handleColumnDelete(column.id)}
                                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                      Delete Column
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tasks */}
                        <Droppable droppableId={column.id} type="task">
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={cn(
                                'flex-1 p-2 overflow-y-auto',
                                snapshot.isDraggingOver && 'bg-blue-50'
                              )}
                              style={{ minHeight: '100px' }}
                            >
                              {tasks
                                .filter((task) => task.columnId === column.id)
                                .sort((a, b) => a.order - b.order)
                                .map((task, index) => (
                                  <Draggable
                                    key={task.id}
                                    draggableId={task.id}
                                    index={index}
                                    isDragDisabled={readonly}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={cn(
                                          'mb-2 p-3 bg-white rounded-md border border-gray-200',
                                          'hover:shadow-md transition-shadow',
                                          snapshot.isDragging && 'shadow-lg',
                                          taskClassName
                                        )}
                                      >
                                        {readonly ? (
                                          <h4 className="font-medium text-gray-900 mb-1">
                                            {task.title}
                                          </h4>
                                        ) : (
                                          <input
                                            type="text"
                                            value={task.title}
                                            onChange={(e) =>
                                              handleTaskUpdate(task, { title: e.target.value })
                                            }
                                            className="w-full mb-1 border-none p-0 focus:ring-0 font-medium text-gray-900"
                                          />
                                        )}
                                        {task.description && (
                                          <p className="text-sm text-gray-600 mb-2">
                                            {task.description}
                                          </p>
                                        )}
                                        {task.labels && task.labels.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mb-2">
                                            {task.labels.map((label) => (
                                              <span
                                                key={label.id}
                                                className={cn(
                                                  'text-xs px-2 py-0.5 rounded-full',
                                                  label.color
                                                    ? `bg-${label.color}-100 text-${label.color}-800`
                                                    : 'bg-gray-100 text-gray-800'
                                                )}
                                              >
                                                {label.name}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                        {!readonly && (
                                          <div className="flex justify-end mt-2">
                                            <button
                                              type="button"
                                              onClick={() => handleTaskDelete(task.id)}
                                              className="text-xs text-red-600 hover:text-red-800"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                              {!readonly && (
                                <button
                                  type="button"
                                  onClick={() => handleAddTask(column.id)}
                                  className="w-full flex items-center justify-center p-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                  <PlusIcon className="h-4 w-4 mr-1" />
                                  Add Task
                                </button>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}

              {/* Add column button */}
              {!readonly && (
                <div className="flex-shrink-0 w-80">
                  <button
                    type="button"
                    onClick={handleAddColumn}
                    className="w-full h-12 flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Column
                  </button>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

KanbanBoard.propTypes = {
  /**
   * Array of column objects
   */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
    })
  ).isRequired,
  /**
   * Array of task objects
   */
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      columnId: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
      labels: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          color: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  /**
   * Callback when a new column is added
   */
  onColumnAdd: PropTypes.func,
  /**
   * Callback when a column is updated
   */
  onColumnUpdate: PropTypes.func,
  /**
   * Callback when a column is deleted
   */
  onColumnDelete: PropTypes.func,
  /**
   * Callback when a new task is added
   */
  onTaskAdd: PropTypes.func,
  /**
   * Callback when a task is updated
   */
  onTaskUpdate: PropTypes.func,
  /**
   * Callback when a task is deleted
   */
  onTaskDelete: PropTypes.func,
  /**
   * Callback when a task is moved to a different column or position
   */
  onTaskMove: PropTypes.func,
  /**
   * Additional CSS classes for the board container
   */
  className: PropTypes.string,
  /**
   * Additional CSS classes for columns
   */
  columnClassName: PropTypes.string,
  /**
   * Additional CSS classes for tasks
   */
  taskClassName: PropTypes.string,
  /**
   * Whether the board is in a loading state
   */
  loading: PropTypes.bool,
  /**
   * Message to display when the board is loading
   */
  loadingMessage: PropTypes.node,
  /**
   * Message to display when there are no columns
   */
  emptyMessage: PropTypes.node,
  /**
   * Whether the board is in readonly mode
   */
  readonly: PropTypes.bool,
};

export default KanbanBoard;
