/**
 * Icon Component
 * Wrapper for various icon libraries with consistent sizing
 */

import React from 'react';

const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const Icon = ({ 
  icon: IconComponent, 
  size = 'md', 
  className = '',
  ...props 
}) => {
  if (!IconComponent) return null;
  
  const sizeClass = sizeMap[size] || sizeMap.md;
  
  return (
    <span className={`inline-flex items-center justify-center ${sizeClass} ${className}`}>
      <IconComponent aria-hidden="true" {...props} />
    </span>
  );
};

export default Icon;
