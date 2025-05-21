import { useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed refs
 * @param {Array} refs - Array of refs to check for outside clicks
 * @param {Function} handler - Function to call when a click outside occurs
 */
function useOnClickOutside(refs, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      const isOutside = refs.every(ref => {
        const refElement = ref?.current;
        return refElement && !refElement.contains(event.target);
      });

      if (isOutside) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [refs, handler]);
}

export { useOnClickOutside };
