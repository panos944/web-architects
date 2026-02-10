import { useRef, useEffect, useState, useCallback } from 'react';

interface ScrollVideoProps {
  /** Video source URL */
  src: string;
  /** Normalized scroll progress (0 to 1) */
  scrollProgress: number;
  /** Optional poster image while loading */
  poster?: string;
  /** CSS class name */
  className?: string;
  /** Callback when video is loaded and ready */
  onReady?: () => void;
  /** Callback for load progress (0 to 1) */
  onLoadProgress?: (progress: number) => void;
  /** Whether device is mobile (reduces animations for performance) */
  isMobile?: boolean;
}

/**
 * A video component that scrubs through frames based on scroll progress.
 * Used for cinematic scroll-driven experiences like Apple product pages.
 * Includes subtle ambient motion to feel alive when not scrolling (desktop only).
 */
export function ScrollVideo({
  src,
  scrollProgress,
  className = '',
  onReady,
  onLoadProgress,
  isMobile = false,
}: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const durationRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const lastSeekTimeRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(0);
  const pendingSeekRef = useRef<number | null>(null);

  // Handle video metadata loaded
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      durationRef.current = videoRef.current.duration;
      setIsReady(true);
      onReady?.();
    }
  }, [onReady]);

  // Handle loading progress
  const handleProgress = useCallback(() => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const buffered = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      const duration = videoRef.current.duration;
      if (duration > 0) {
        onLoadProgress?.(buffered / duration);
      }
    }
  }, [onLoadProgress]);

  // Update video time based on scroll progress
  // On mobile, use requestAnimationFrame batching to reduce load
  useEffect(() => {
    if (!isReady || !videoRef.current || durationRef.current === 0) return;

    const duration = durationRef.current;
    const targetTime = scrollProgress * (duration - 0.1);

    if (isMobile) {
      // On mobile, batch seeks using requestAnimationFrame
      // Store the pending target and only seek on the next frame
      pendingSeekRef.current = targetTime;

      if (!animationRef.current) {
        const performSeek = () => {
          const now = Date.now();
          const timeSinceLastSeek = now - lastSeekTimeRef.current;

          // Throttle to ~12 seeks per second on mobile (every 83ms)
          if (timeSinceLastSeek >= 83 && pendingSeekRef.current !== null && videoRef.current) {
            videoRef.current.currentTime = pendingSeekRef.current;
            lastSeekTimeRef.current = now;
            lastProgressRef.current = scrollProgress;
            pendingSeekRef.current = null;
          }

          animationRef.current = requestAnimationFrame(performSeek);
        };

        animationRef.current = requestAnimationFrame(performSeek);
      }
    } else {
      // Desktop: direct seeking for responsiveness
      videoRef.current.currentTime = targetTime;
      lastProgressRef.current = scrollProgress;
    }
  }, [scrollProgress, isReady, isMobile]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Preload the video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  // Subtle ambient motion animation - DESKTOP ONLY
  // Disabled on mobile to save CPU/GPU resources
  useEffect(() => {
    if (!isReady || isMobile || !ambientRef.current) return;

    let localAnimationRef: number | null = null;

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;

      const x = Math.sin(elapsed * 0.3) * 3;
      const y = Math.cos(elapsed * 0.2) * 2;
      const scale = 1 + Math.sin(elapsed * 0.15) * 0.008;

      if (ambientRef.current) {
        ambientRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      }

      localAnimationRef = requestAnimationFrame(animate);
    };

    localAnimationRef = requestAnimationFrame(animate);

    return () => {
      if (localAnimationRef) {
        cancelAnimationFrame(localAnimationRef);
      }
    };
  }, [isReady, isMobile]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <div
        ref={ambientRef}
        className="absolute inset-0"
        style={{
          // GPU acceleration hints
          transform: 'translate3d(0, 0, 0)',
          willChange: isMobile ? 'auto' : 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          onProgress={handleProgress}
          className="absolute w-full object-cover"
          style={{
            pointerEvents: 'none',
            height: '115%',
            top: '0',
            left: '0',
            objectPosition: 'center top',
            // GPU layer for video
            transform: 'translateZ(0)',
          }}
        />
      </div>

      {/* Loading indicator */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-orange-900/80 to-orange-600/80">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white/60 text-sm">Loading experience...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScrollVideo;
