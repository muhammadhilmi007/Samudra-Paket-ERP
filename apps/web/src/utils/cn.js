/**
 * Utility function for conditionally joining class names
 * Used by shadcn UI components
 */

import classNames from 'classnames';

export function cn(...inputs) {
  return classNames(...inputs);
}
