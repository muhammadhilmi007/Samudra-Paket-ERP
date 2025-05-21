"use client";

import React, { useState, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

/**
 * Tabs Component
 * A flexible tabbed interface component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Tab components to be rendered
 * @param {string} [props.defaultActiveKey] - Key of the initially active tab
 * @param {Function} [props.onChange] - Callback when the active tab changes
 * @param {string} [props.variant='default'] - Visual variant ('default' or 'pills')
 * @param {string} [props.size='md'] - Size of the tabs ('sm', 'md', 'lg')
 * @param {boolean} [props.fullWidth] - Whether tabs should take full width of container
 * @param {string} [props.className] - Additional CSS classes for the tabs container
 */
const Tabs = ({
  children,
  defaultActiveKey,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(
    defaultActiveKey || (Children.toArray(children)[0]?.props?.tabKey || '')
  );

  const handleTabClick = (tabKey, disabled, event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    
    setActiveTab(tabKey);
    if (onChange) {
      onChange(tabKey);
    }
  };

  const variantClasses = {
    default: 'border-b border-gray-200',
    pills: 'space-x-2',
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="w-full">
      <div 
        className={cn(
          'flex',
          variantClasses[variant],
          { 'w-full': fullWidth },
          className
        )}
        role="tablist"
      >
        {Children.map(children, (child) => {
          if (!child) return null;
          
          const { tabKey, title, disabled, icon: Icon } = child.props;
          const isActive = activeTab === tabKey;
          
          const tabClasses = cn(
            'flex items-center px-4 py-2 font-medium transition-colors duration-200',
            sizeClasses[size],
            {
              // Default variant
              'border-b-2 -mb-px': variant === 'default',
              'border-primary-500 text-primary-600': isActive && variant === 'default',
              'text-gray-500 hover:text-gray-700 hover:border-gray-300': !isActive && variant === 'default' && !disabled,
              'text-gray-400 cursor-not-allowed': disabled && variant === 'default',
              
              // Pills variant
              'rounded-md': variant === 'pills',
              'bg-primary-50 text-primary-700': isActive && variant === 'pills',
              'text-gray-500 hover:bg-gray-100': !isActive && variant === 'pills' && !disabled,
              'text-gray-400 bg-gray-50': disabled && variant === 'pills',
              
              // Full width
              'flex-1 justify-center': fullWidth,
            }
          );
          
          return (
            <button
              key={tabKey}
              role="tab"
              aria-selected={isActive}
              aria-disabled={disabled}
              disabled={disabled}
              onClick={(e) => handleTabClick(tabKey, disabled, e)}
              className={tabClasses}
              tabIndex={disabled ? -1 : 0}
            >
              {Icon && (
                <Icon className={cn('mr-2 h-4 w-4', {
                  'text-primary-500': isActive,
                  'text-gray-400': !isActive,
                })} />
              )}
              {title}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4">
        {Children.map(children, (child) => {
          if (!child) return null;
          const { tabKey, children: tabContent } = child.props;
          return activeTab === tabKey ? tabContent : null;
        })}
      </div>
    </div>
  );
};

/**
 * Tab Component
 * Represents an individual tab within the Tabs component
 */
const Tab = ({ children }) => {
  return <>{children}</>;
};

Tab.propTypes = {
  tabKey: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  icon: PropTypes.elementType,
  children: PropTypes.node,
};

Tabs.Tab = Tab;

export default Tabs;
