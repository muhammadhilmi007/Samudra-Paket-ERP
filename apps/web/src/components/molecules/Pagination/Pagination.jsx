"use client";

import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import Button from '../../atoms/Button';
import cn from 'classnames';

/**
 * Pagination Component
 * A flexible pagination component for navigating through pages of content
 */
const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  showPageNumbers = true,
  showPageSizeOptions = true,
  pageSizeOptions = [5, 10, 20, 50, 100],
  className = '',
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange?.(page, itemsPerPage);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    onPageChange?.(1, newItemsPerPage);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      // Less than maxVisiblePages pages, show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than maxVisiblePages pages, calculate start and end pages
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        // Near the start
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        // Near the end
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // Somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    // Add page numbers to array
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (startPage > 1) {
      if (startPage > 2) {
        pages.unshift('...');
      }
      pages.unshift(1);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-200', className)}>
      {/* Items per page selector */}
      {showPageSizeOptions && (
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="text-sm text-gray-700 mr-2">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="block w-20 pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Page info */}
      <div className="text-sm text-gray-700 mb-4 sm:mb-0">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>

      {/* Page navigation */}
      {showPageNumbers && (
        <nav className="flex items-center space-x-1" aria-label="Pagination">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={isFirstPage}
            aria-label="Previous"
            className={cn('px-2 py-1', { 'opacity-50 cursor-not-allowed': isFirstPage })}
          >
            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          </Button>

          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-gray-500"
                >
                  <EllipsisHorizontalIcon className="h-4 w-4" />
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={page === currentPage ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={cn('px-3 py-1 min-w-[2rem]', {
                  'font-semibold': page === currentPage,
                })}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={isLastPage}
            aria-label="Next"
            className={cn('px-2 py-1', { 'opacity-50 cursor-not-allowed': isLastPage })}
          >
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </nav>
      )}
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  showPageNumbers: PropTypes.bool,
  showPageSizeOptions: PropTypes.bool,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string,
};

export default Pagination;
