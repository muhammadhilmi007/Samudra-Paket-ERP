/**
 * useBreakpoint Hook
 * Custom hook for responsive design with Tailwind CSS breakpoints
 */

import { useState, useEffect } from 'react';

// Tailwind CSS breakpoints in pixels
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Custom hook for detecting current breakpoint based on Tailwind CSS
 * Follows mobile-first responsive design approach
 * 
 * @returns {Object} Current breakpoint information
 */
const useBreakpoint = () => {
  // Initialize with mobile breakpoint
  const [breakpoint, setBreakpoint] = useState({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    current: 'xs',
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      const width = window.innerWidth;
      
      setBreakpoint({
        isMobile: width < breakpoints.sm,
        isTablet: width >= breakpoints.sm && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg && width < breakpoints.xl,
        isLargeDesktop: width >= breakpoints.xl,
        current: 
          width < breakpoints.sm ? 'xs' :
          width < breakpoints.md ? 'sm' :
          width < breakpoints.lg ? 'md' :
          width < breakpoints.xl ? 'lg' :
          width < breakpoints['2xl'] ? 'xl' : '2xl',
      });
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return breakpoint;
};

export default useBreakpoint;
