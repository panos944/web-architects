import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

interface UseDesertScrollOptions {
  /** Number of viewport heights the scroll journey spans (default: 4) */
  scrollDistance?: number;
  /** Whether the 3D scene is enabled (false for mobile fallback) */
  enabled?: boolean;
  /** Callback when scroll progress changes */
  onProgress?: (progress: number) => void;
}

interface UseDesertScrollReturn {
  /** Ref to attach to the hero container */
  containerRef: React.RefObject<HTMLElement>;
  /** Normalized scroll progress (0 to 1) */
  scrollProgress: number;
  /** Whether the hero section is currently pinned */
  isPinned: boolean;
  /** Whether the journey has completed */
  isComplete: boolean;
}

/**
 * Custom hook for managing the scroll-driven 3D desert journey.
 * Handles GSAP ScrollTrigger pinning and exposes normalized scroll progress.
 */
export function useDesertScroll({
  scrollDistance = 4,
  enabled = true,
  onProgress,
}: UseDesertScrollOptions = {}): UseDesertScrollReturn {
  const containerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Memoized progress handler to avoid unnecessary re-renders
  const handleProgress = useCallback(
    (progress: number) => {
      setScrollProgress(progress);
      onProgress?.(progress);

      // Track completion state
      if (progress >= 0.98 && !isComplete) {
        setIsComplete(true);
      } else if (progress < 0.98 && isComplete) {
        setIsComplete(false);
      }
    },
    [onProgress, isComplete]
  );

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    // Calculate the total scroll distance
    const scrollEnd = `+=${window.innerHeight * scrollDistance}`;

    // Create the ScrollTrigger for pinning and progress tracking
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: scrollEnd,
      pin: true,
      pinSpacing: true,
      scrub: 0.3, // Slight smoothing for natural feel
      anticipatePin: 1, // Helps prevent flicker on pin
      onUpdate: (self) => {
        handleProgress(self.progress);
      },
      onToggle: (self) => {
        setIsPinned(self.isActive);
      },
      // Ensure proper refresh on resize
      invalidateOnRefresh: true,
    });

    // Force a refresh to ensure proper calculations
    ScrollTrigger.refresh();

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [enabled, scrollDistance, handleProgress]);

  // Handle window resize
  useEffect(() => {
    if (!enabled) return;

    const handleResize = () => {
      // Debounced refresh
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [enabled]);

  return {
    containerRef,
    scrollProgress,
    isPinned,
    isComplete,
  };
}

/**
 * Utility to get eased progress for different animation phases
 */
export function getEasedProgress(progress: number, easeType: 'in' | 'out' | 'inOut' = 'inOut'): number {
  switch (easeType) {
    case 'in':
      return progress * progress;
    case 'out':
      return 1 - (1 - progress) * (1 - progress);
    case 'inOut':
      return progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    default:
      return progress;
  }
}

/**
 * Maps progress to a specific phase range
 * @param progress - Current scroll progress (0-1)
 * @param start - Phase start (0-1)
 * @param end - Phase end (0-1)
 * @returns Normalized progress within the phase (0-1), clamped
 */
export function getPhaseProgress(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}
