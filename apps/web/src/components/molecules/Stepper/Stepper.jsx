"use client";

import React from 'react';
import PropTypes from 'prop-types';
import { CheckIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';

/**
 * Stepper Component
 * A multi-step progress indicator that guides users through a process
 */
const Stepper = ({
  steps = [],
  activeStep = 0,
  onStepClick,
  orientation = 'horizontal',
  className = '',
}) => {
  const isVertical = orientation === 'vertical';
  const isClickable = typeof onStepClick === 'function';

  // Calculate the progress percentage for the active step
  const progressPercentage = steps.length > 1 
    ? ((activeStep) / (steps.length - 1)) * 100 
    : 0;

  return (
    <div 
      className={cn(
        'w-full',
        isVertical ? 'flex' : 'block',
        className
      )}
    >
      <div 
        className={cn(
          'relative',
          isVertical 
            ? 'flex flex-col h-full ml-2.5' 
            : 'flex items-center justify-between w-full'
        )}
      >
        {/* Progress bar */}
        {!isVertical && (
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10">
            <div 
              className="h-full bg-primary-500 transition-all duration-300 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
        
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isLast = index === steps.length - 1;
          
          // Determine step status for accessibility
          let status = 'upcoming';
          if (isCompleted) status = 'complete';
          if (isActive) status = 'current';
          
          return (
            <React.Fragment key={step.id || index}>
              <div 
                className={cn(
                  'flex items-center',
                  isVertical ? 'mb-6' : 'flex-col',
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                )}
                onClick={() => isClickable && onStepClick(index, step)}
                role="button"
                tabIndex={isClickable ? 0 : -1}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onStepClick(index, step);
                  }
                }}
              >
                {/* Step indicator */}
                <div 
                  className={cn(
                    'flex items-center justify-center rounded-full border-2 flex-shrink-0',
                    'transition-colors duration-200',
                    {
                      'h-8 w-8 text-sm': !isVertical,
                      'h-10 w-10 text-base': isVertical,
                      'border-primary-500 bg-primary-500 text-white': isActive,
                      'border-primary-500 bg-white': isCompleted,
                      'border-gray-300 bg-white text-gray-500': !isActive && !isCompleted,
                    }
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <span className="font-medium">{index + 1}</span>
                  )}
                </div>
                
                {/* Step label */}
                <div 
                  className={cn(
                    'text-sm font-medium',
                    isVertical ? 'ml-3' : 'mt-2 text-center',
                    {
                      'text-primary-600': isActive,
                      'text-gray-900': isCompleted,
                      'text-gray-500': !isActive && !isCompleted,
                    }
                  )}
                >
                  {step.label}
                </div>
              </div>
              
              {/* Vertical connector */}
              {isVertical && !isLast && (
                <div className="flex-shrink-0 w-0.5 h-6 bg-gray-200 ml-[19px] -my-1">
                  {isCompleted && (
                    <div className="w-full h-full bg-primary-500" />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

Stepper.propTypes = {
  /**
   * Array of step objects with shape: { id: string|number, label: string, [key: string]: any }
   */
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.node.isRequired,
    })
  ).isRequired,
  /**
   * Index of the currently active step (0-based)
   */
  activeStep: PropTypes.number,
  /**
   * Callback function when a step is clicked
   * @param {number} stepIndex - The index of the clicked step
   * @param {Object} step - The step object that was clicked
   */
  onStepClick: PropTypes.func,
  /**
   * Orientation of the stepper
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * Additional CSS classes for the stepper container
   */
  className: PropTypes.string,
};

export default Stepper;
