"use client";

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import cn from 'classnames';
import Pagination from '../../molecules/Pagination';

/**
 * Table Component
 * A powerful and flexible table component with sorting, filtering, and pagination
 */
const Table = ({
  data = [],
  columns = [],
  pagination = true,
  itemsPerPage = 10,
  itemsPerPageOptions = [5, 10, 25, 50, 100],
  currentPage: controlledCurrentPage,
  onPageChange: controlledOnPageChange,
  totalItems: controlledTotalItems,
  sortable = true,
  filterable = true,
  selectable = false,
  onRowClick,
  onSelectionChange,
  loading = false,
  emptyMessage = 'No data available',
  loadingMessage = 'Loading data...',
  className = '',
  headerClassName = '',
  bodyClassName = '',
  rowClassName = '',
  cellClassName = '',
  stickyHeader = false,
  bordered = true,
  striped = true,
  hover = true,
  compact = false,
  responsive = true,
  ...props
}) => {
  // State for internal table management
  const [currentPage, setCurrentPage] = useState(controlledCurrentPage || 1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Update internal state when controlled props change
  useEffect(() => {
    if (controlledCurrentPage !== undefined) {
      setCurrentPage(controlledCurrentPage);
    }
  }, [controlledCurrentPage]);

  // Handle sorting
  const handleSort = (key) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      key = null;
      direction = null;
    }

    setSortConfig({ key, direction });
  };

  // Handle filtering
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle row selection
  const handleRowSelect = (rowId) => {
    if (!selectable) return;

    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(rowId)) {
        const newSelected = prevSelected.filter((id) => id !== rowId);
        if (onSelectionChange) {
          onSelectionChange(newSelected);
        }
        return newSelected;
      } else {
        const newSelected = [...prevSelected, rowId];
        if (onSelectionChange) {
          onSelectionChange(newSelected);
        }
        return newSelected;
      }
    });
  };

  // Handle select all rows
  const handleSelectAll = () => {
    if (!selectable) return;

    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
      if (onSelectionChange) {
        onSelectionChange([]);
      }
    } else {
      const allIds = filteredData.map((row, index) => row.id || index);
      setSelectedRows(allIds);
      if (onSelectionChange) {
        onSelectionChange(allIds);
      }
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (controlledOnPageChange) {
      controlledOnPageChange(page);
    }
  };

  // Apply sorting to data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });
  }, [data, sortConfig]);

  // Apply filtering to data
  const filteredData = useMemo(() => {
    let result = sortedData;

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        result = result.filter((row) => {
          const cellValue = row[key];
          if (cellValue === null || cellValue === undefined) return false;

          if (typeof cellValue === 'string') {
            return cellValue.toLowerCase().includes(value.toLowerCase());
          }

          return cellValue === value;
        });
      }
    });

    // Apply search term across all searchable columns
    if (searchTerm) {
      const searchableColumns = columns.filter((column) => column.searchable !== false);
      result = result.filter((row) =>
        searchableColumns.some((column) => {
          const cellValue = row[column.accessor];
          if (cellValue === null || cellValue === undefined) return false;

          if (typeof cellValue === 'string') {
            return cellValue.toLowerCase().includes(searchTerm.toLowerCase());
          }

          return String(cellValue).includes(searchTerm);
        })
      );
    }

    return result;
  }, [sortedData, filters, searchTerm, columns]);

  // Calculate pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, pagination, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalItems = controlledTotalItems || filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Render sort icon
  const renderSortIcon = (column) => {
    if (!sortable || column.sortable === false) return null;

    if (sortConfig.key === column.accessor) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUpIcon className="h-4 w-4" />
      ) : (
        <ChevronDownIcon className="h-4 w-4" />
      );
    }

    return <ChevronUpDownIcon className="h-4 w-4 text-gray-300" />;
  };

  // Render filter input
  const renderFilterInput = (column) => {
    if (!filterable || column.filterable === false) return null;
    if (!showFilters) return null;

    return (
      <div className="mt-1">
        <input
          type="text"
          value={filters[column.accessor] || ''}
          onChange={(e) => handleFilterChange(column.accessor, e.target.value)}
          placeholder={`Filter ${column.header}`}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
        />
      </div>
    );
  };

  // Render table header
  const renderHeader = () => {
    return (
      <thead
        className={cn(
          'bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
          stickyHeader && 'sticky top-0',
          headerClassName
        )}
      >
        <tr>
          {/* Selection column */}
          {selectable && (
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </th>
          )}

          {/* Data columns */}
          {columns.map((column) => (
            <th
              key={column.accessor}
              className={cn(
                'px-4 py-3',
                column.width && `w-${column.width}`,
                column.className
              )}
            >
              <div
                className={cn(
                  'flex items-center space-x-1',
                  sortable && column.sortable !== false && 'cursor-pointer'
                )}
                onClick={() => handleSort(column.accessor)}
              >
                <span>{column.header}</span>
                {renderSortIcon(column)}
              </div>
              {renderFilterInput(column)}
            </th>
          ))}

          {/* Actions column */}
          {columns.some((column) => column.type === 'actions') && (
            <th className="px-4 py-3 w-24 text-right">Actions</th>
          )}
        </tr>
      </thead>
    );
  };

  // Render table body
  const renderBody = () => {
    if (loading) {
      return (
        <tbody className={bodyClassName}>
          <tr>
            <td
              colSpan={columns.length + (selectable ? 1 : 0)}
              className="px-4 py-8 text-center text-gray-500"
            >
              {loadingMessage}
            </td>
          </tr>
        </tbody>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <tbody className={bodyClassName}>
          <tr>
            <td
              colSpan={columns.length + (selectable ? 1 : 0)}
              className="px-4 py-8 text-center text-gray-500"
            >
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody className={bodyClassName}>
        {paginatedData.map((row, rowIndex) => (
          <tr
            key={row.id || rowIndex}
            className={cn(
              striped && rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50',
              hover && 'hover:bg-gray-100',
              onRowClick && 'cursor-pointer',
              selectedRows.includes(row.id || rowIndex) && 'bg-primary-50',
              rowClassName
            )}
            onClick={() => {
              if (onRowClick) onRowClick(row);
            }}
          >
            {/* Selection column */}
            {selectable && (
              <td className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id || rowIndex)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleRowSelect(row.id || rowIndex);
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </td>
            )}

            {/* Data columns */}
            {columns.map((column) => (
              <td
                key={`${rowIndex}-${column.accessor}`}
                className={cn(
                  'px-4',
                  compact ? 'py-2' : 'py-3',
                  column.align === 'right' && 'text-right',
                  column.align === 'center' && 'text-center',
                  cellClassName,
                  column.cellClassName
                )}
              >
                {column.render
                  ? column.render(row[column.accessor], row, rowIndex)
                  : row[column.accessor]}
              </td>
            ))}

            {/* Actions column */}
            {columns.some((column) => column.type === 'actions') && (
              <td className="px-4 py-3 w-24 text-right">
                <div className="flex justify-end space-x-2">
                  {columns
                    .filter((column) => column.type === 'actions')
                    .map((column) => column.render(null, row, rowIndex))}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    );
  };

  // Render table toolbar
  const renderToolbar = () => {
    if (!filterable && !selectable) return null;

    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {filterable && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          )}

          {filterable && (
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none',
                showFilters && 'bg-gray-100 text-gray-700'
              )}
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {selectable && selectedRows.length > 0 && (
            <div className="text-sm text-gray-700">
              {selectedRows.length} {selectedRows.length === 1 ? 'row' : 'rows'} selected
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;

    return (
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      </div>
    );
  };

  return (
    <div {...props}>
      {renderToolbar()}

      <div className={cn('overflow-hidden', responsive && 'overflow-x-auto')}>
        <table
          className={cn(
            'min-w-full divide-y divide-gray-200',
            bordered && 'border border-gray-200',
            className
          )}
        >
          {renderHeader()}
          {renderBody()}
        </table>
      </div>

      {renderPagination()}
    </div>
  );
};

Table.propTypes = {
  /**
   * Array of data objects to display in the table
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Array of column configuration objects
   */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Unique identifier for the column
       */
      accessor: PropTypes.string.isRequired,
      /**
       * Display name for the column header
       */
      header: PropTypes.node.isRequired,
      /**
       * Custom render function for cell content
       */
      render: PropTypes.func,
      /**
       * Whether the column is sortable
       */
      sortable: PropTypes.bool,
      /**
       * Whether the column is filterable
       */
      filterable: PropTypes.bool,
      /**
       * Whether the column is searchable
       */
      searchable: PropTypes.bool,
      /**
       * Column width (Tailwind width class number, e.g., 16 for w-16)
       */
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      /**
       * Text alignment for the column
       */
      align: PropTypes.oneOf(['left', 'center', 'right']),
      /**
       * Additional CSS classes for the column header
       */
      className: PropTypes.string,
      /**
       * Additional CSS classes for the column cells
       */
      cellClassName: PropTypes.string,
      /**
       * Column type (use 'actions' for action buttons)
       */
      type: PropTypes.string,
    })
  ).isRequired,
  /**
   * Whether to enable pagination
   */
  pagination: PropTypes.bool,
  /**
   * Number of items to display per page
   */
  itemsPerPage: PropTypes.number,
  /**
   * Options for items per page selector
   */
  itemsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  /**
   * Controlled current page number
   */
  currentPage: PropTypes.number,
  /**
   * Callback function when page changes (for controlled pagination)
   */
  onPageChange: PropTypes.func,
  /**
   * Controlled total number of items (for server-side pagination)
   */
  totalItems: PropTypes.number,
  /**
   * Whether to enable sorting
   */
  sortable: PropTypes.bool,
  /**
   * Whether to enable filtering
   */
  filterable: PropTypes.bool,
  /**
   * Whether to enable row selection
   */
  selectable: PropTypes.bool,
  /**
   * Callback function when a row is clicked
   */
  onRowClick: PropTypes.func,
  /**
   * Callback function when selection changes
   */
  onSelectionChange: PropTypes.func,
  /**
   * Whether the table is in a loading state
   */
  loading: PropTypes.bool,
  /**
   * Message to display when there is no data
   */
  emptyMessage: PropTypes.node,
  /**
   * Message to display when the table is loading
   */
  loadingMessage: PropTypes.node,
  /**
   * Additional CSS classes for the table
   */
  className: PropTypes.string,
  /**
   * Additional CSS classes for the table header
   */
  headerClassName: PropTypes.string,
  /**
   * Additional CSS classes for the table body
   */
  bodyClassName: PropTypes.string,
  /**
   * Additional CSS classes for table rows
   */
  rowClassName: PropTypes.string,
  /**
   * Additional CSS classes for table cells
   */
  cellClassName: PropTypes.string,
  /**
   * Whether to make the header sticky
   */
  stickyHeader: PropTypes.bool,
  /**
   * Whether to add borders to the table
   */
  bordered: PropTypes.bool,
  /**
   * Whether to add striped rows
   */
  striped: PropTypes.bool,
  /**
   * Whether to add hover effect to rows
   */
  hover: PropTypes.bool,
  /**
   * Whether to use compact padding
   */
  compact: PropTypes.bool,
  /**
   * Whether to make the table responsive
   */
  responsive: PropTypes.bool,
};

export default Table;
