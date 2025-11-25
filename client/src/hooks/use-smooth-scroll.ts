import { useCallback } from 'react';

/**
 * Custom hook for smooth scrolling to hash anchors with retry logic.
 * Handles cases where DOM elements may not be immediately available (e.g., hydration delays).
 */
export function useSmoothScroll() {
  const scrollToHash = useCallback((hash: string) => {
    if (!hash) return;
    const normalized = hash.startsWith('#') ? hash : `#${hash}`;
    
    const performScroll = () => {
      const target = document.querySelector<HTMLElement>(normalized);
      if (!target) {
        return false;
      }

      // Calculate scroll position accounting for fixed navbar (96px)
      const rect = target.getBoundingClientRect();
      const offset = window.scrollY + rect.top - 96;
      window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
      return true;
    };

    // Try to scroll immediately
    if (performScroll()) return;

    // Retry with increasing delays for production environments
    // This handles cases where DOM hydration takes longer
    const retries = [100, 300, 500, 1000];
    
    retries.forEach((delay) => {
      setTimeout(() => {
        performScroll();
      }, delay);
    });
  }, []);
  
  return { scrollToHash };
}

