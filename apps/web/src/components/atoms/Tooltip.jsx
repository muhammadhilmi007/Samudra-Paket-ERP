'use client';

/**
 * Tooltip Component
 * Displays informational text when hovering over an element
 */

import React, { useState } from 'react';
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

/**
 * Tooltip component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The element that triggers the tooltip
 * @param {string} props.content - The content to display in the tooltip
 * @param {string} props.position - The position of the tooltip (top, bottom, left, right)
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Tooltip component
 */
const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  className = '',
  delayDuration = 300,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Map position to Shadcn Tooltip side
  const sideMap = {
    top: 'top',
    bottom: 'bottom',
    left: 'left',
    right: 'right',
  };

  return (
    <TooltipProvider>
      <ShadcnTooltip 
        open={isOpen} 
        onOpenChange={setIsOpen}
        delayDuration={delayDuration}
      >
        <TooltipTrigger 
          asChild 
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={sideMap[position] || 'top'}
          className={`bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md ${className}`}
          {...props}
        >
          {content}
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
};

export default Tooltip;
