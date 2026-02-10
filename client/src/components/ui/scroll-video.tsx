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
 * Includes subtle ambient motion to feel alive when not scrolling.
 */
export function ScrollVideo({
  src,
  scrollProgress,
  poster,
  className = '',
  onReady,
  onLoadProgress,
  isMobile = false,
}: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [ambientOffset, setAmbientOffset] = useState({ x: 0, y: 0, scale: 1 });
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const lastSeekTimeRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(0);

  // Handle video metadata loaded
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
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
  // Throttled on mobile to reduce seeking frequency
  useEffect(() => {
    if (!isReady || !videoRef.current || duration === 0) return;

    const now = Date.now();
    const progressDelta = Math.abs(scrollProgress - lastProgressRef.current);

    // On mobile, throttle seeks to reduce load
    // Only update if enough time passed OR if there's significant scroll change
    if (isMobile) {
      const timeSinceLastSeek = now - lastSeekTimeRef.current;
      const minSeekInterval = 50; // ~20 seeks per second max on mobile
      const minProgressDelta = 0.005; // Only seek if progress changed by 0.5%

      if (timeSinceLastSeek < minSeekInterval && progressDelta < minProgressDelta) {
        return;
      }
    }

    // Calculate target time based on scroll progress
    // Leave a small buffer at the end to prevent flickering
    const targetTime = scrollProgress * (duration - 0.1);

    // Directly set video time for responsive feel
    videoRef.current.currentTime = targetTime;
    lastSeekTimeRef.current = now;
    lastProgressRef.current = scrollProgress;
  }, [scrollProgress, isReady, duration, isMobile]);

  // Preload the video
  useEffect(() => {
    if (videoRef.current) {
      // Ensure video is loaded
      videoRef.current.load();
    }
  }, [src]);

  // Subtle ambient motion animation - keeps the scene feeling alive
  // Reduced intensity on mobile for better performance
  useEffect(() => {
    if (!isReady) return;

    // Mobile: slower update rate and smaller movements
    const updateInterval = isMobile ? 50 : 16; // ~20fps on mobile, 60fps on desktop
    let lastUpdate = 0;

    const animate = () => {
      const now = Date.now();
      if (now - lastUpdate < updateInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastUpdate = now;

      const elapsed = (now - startTimeRef.current) / 1000;

      // Reduced motion on mobile
      const intensity = isMobile ? 0.4 : 1;
      const x = Math.sin(elapsed * 0.3) * 3 * intensity;
      const y = Math.cos(elapsed * 0.2) * 2 * intensity;
      const scale = 1 + Math.sin(elapsed * 0.15) * 0.008 * intensity;

      setAmbientOffset({ x, y, scale });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isReady, isMobile]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${ambientOffset.x}px, ${ambientOffset.y}px) scale(${ambientOffset.scale})`,
          willChange: 'transform',
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
            // Prevent video controls and interactions
            pointerEvents: 'none',
            // Scale up and position to crop bottom 10%
            height: '115%',
            top: '0',
            left: '0',
            objectPosition: 'center top',
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
