import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Breadcrumb component for navigation
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of breadcrumb items with label and href
 * @param {string} props.className - Additional CSS classes
 */
const Breadcrumb = ({ items = [], className }) => {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      <ol className="flex items-center space-x-1">
        <li className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center text-primary hover:text-primary/80"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1" />
            {item.href ? (
              <Link 
                href={item.href} 
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
