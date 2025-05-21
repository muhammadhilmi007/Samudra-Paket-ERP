"use client";

import React from 'react';
import classNames from 'classnames';
import { UserCircleIcon } from '@heroicons/react/24/outline';

/**
 * Avatar Component
 * Displays a user's avatar with fallback to initials or icon
 * 
 * @param {Object} props - Component props
 * @param {string} [props.src] - URL of the avatar image
 * @param {string} [props.alt] - Alt text for the avatar image
 * @param {string} [props.initials] - Initials to display if no image is provided
 * @param {string} [props.size='md'] - Size of the avatar ('sm', 'md', 'lg', 'xl')
 * @param {string} [props.shape='circle'] - Shape of the avatar ('circle' or 'rounded')
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.imgProps] - Additional props to pass to the img element
 */
const Avatar = ({
  src,
  alt = 'User avatar',
  initials,
  size = 'md',
  shape = 'circle',
  className = '',
  ...imgProps
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-md',
  };

  const baseClasses = 'flex items-center justify-center bg-gray-200 text-gray-600 overflow-hidden';

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={classNames(
          baseClasses,
          sizeClasses[size],
          shapeClasses[shape],
          'object-cover',
          className
        )}
        {...imgProps}
      />
    );
  }

  if (initials) {
    return (
      <div
        className={classNames(
          baseClasses,
          sizeClasses[size],
          shapeClasses[shape],
          'font-medium',
          className
        )}
      >
        {initials}
      </div>
    );
  }

  return (
    <UserCircleIcon
      className={classNames(
        baseClasses,
        sizeClasses[size],
        shapeClasses[shape],
        'text-gray-400',
        className
      )}
      aria-hidden="true"
    />
  );
};

export default Avatar;
