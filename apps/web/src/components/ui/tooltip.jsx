'use client';

/**
 * Tooltip Component
 * Simple tooltip implementation using CSS
 */

import React, { useState } from 'react';
import { cn } from '../../utils/cn';

const TooltipProvider = ({ children }) => {
  return children;
};

const Tooltip = ({ children, open, onOpenChange }) => {
  return children;
};

const TooltipTrigger = React.forwardRef(({ asChild, children, ...props }, ref) => {
  return React.cloneElement(children, { ref, ...props });
});
TooltipTrigger.displayName = 'TooltipTrigger';

const TooltipContent = React.forwardRef(({ className, children, side = 'top', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-50 px-3 py-1.5 text-sm bg-gray-800 text-white rounded shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
