import { useState, useEffect } from 'react';

/**
 * Mobile Detection Hook
 * ব্রাউজার screen size দেখে mobile/tablet/desktop detect করে
 * 
 * @returns {boolean} isMobile - true if screen width <= 768px
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkMobile();

    // Listen for resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

/**
 * Breakpoint Hook
 * আরো detail breakpoint detection
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBreakpoint('mobile'); // 360px - 640px
      } else if (width < 1024) {
        setBreakpoint('tablet'); // 640px - 1024px
      } else {
        setBreakpoint('desktop'); // 1024px+
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}
