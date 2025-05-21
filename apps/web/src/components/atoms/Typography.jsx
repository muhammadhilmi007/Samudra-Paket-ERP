/**
 * Typography Component
 * Consistent text styling across the application
 */

import React from 'react';

const variants = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-bold tracking-tight',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  h5: 'text-lg font-bold',
  h6: 'text-base font-bold',
  subtitle1: 'text-lg font-medium',
  subtitle2: 'text-base font-medium',
  body1: 'text-base',
  body2: 'text-sm',
  caption: 'text-xs',
  overline: 'text-xs uppercase tracking-wider',
};

const Typography = ({
  variant = 'body1',
  component,
  className = '',
  color = '',
  children,
  ...props
}) => {
  const Component = component || 
    (variant === 'h1' ? 'h1' : 
     variant === 'h2' ? 'h2' : 
     variant === 'h3' ? 'h3' : 
     variant === 'h4' ? 'h4' : 
     variant === 'h5' ? 'h5' : 
     variant === 'h6' ? 'h6' : 
     variant === 'subtitle1' || variant === 'subtitle2' ? 'h6' : 
     'p');

  const colorClass = color ? `text-${color}` : '';

  return (
    <Component
      className={`${variants[variant] || variants.body1} ${colorClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Typography;
