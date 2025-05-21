/**
 * Card Component
 * Container for content with consistent styling
 */

import React from 'react';
import Typography from '../atoms/Typography';

const Card = ({
  title,
  subtitle,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  ...props
}) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className={`px-4 py-3 border-b border-gray-200 ${headerClassName}`}>
          {title && <Typography variant="h5">{title}</Typography>}
          {subtitle && <Typography variant="body2" className="text-gray-600 mt-1">{subtitle}</Typography>}
        </div>
      )}
      
      <div className={`px-4 py-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-4 py-3 border-t border-gray-200 bg-gray-50 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
