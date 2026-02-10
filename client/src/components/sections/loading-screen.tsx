import { useEffect, useState, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface LoadingScreenProps {
  /** External progress value (0-1) - if provided, uses this instead of simulated progress */
  progress?: number;
  /** Whether loading is complete (video is ready) */
  isReady?: boolean;
  /** Callback when loading animation completes */
  onComplete?: () => void;
}

export function LoadingScreen({ progress: externalProgress, isReady = false, onComplete }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);
  const webArchitectsRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  // Animate progress based on external progress or simulate it
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Start text animation
    const textTl = gsap.timeline();
    textTl.to({}, { duration: 0.3 })
      .call(() => setShowText(true))
      .fromTo(textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
  }, []);

  // Update display progress smoothly
  useEffect(() => {
    // Use external progress if available, otherwise simulate
    const targetProgress = externalProgress !== undefined
      ? Math.round(externalProgress * 100)
      : displayProgress;

    if (externalProgress !== undefined && targetProgress > displayProgress) {
      // Smoothly animate to target progress
      const diff = targetProgress - displayProgress;
      const increment = Math.max(1, Math.ceil(diff / 10));
      const timer = setTimeout(() => {
        setDisplayProgress(prev => Math.min(prev + increment, targetProgress));
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [externalProgress, displayProgress]);

  // Simulate progress if no external progress provided
  useEffect(() => {
    if (externalProgress !== undefined) return;

    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Slower as we approach 100 to wait for video
        const increment = prev < 70 ? 3 : prev < 90 ? 1 : 0.5;
        return Math.min(prev + increment, isReady ? 100 : 95);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [externalProgress, isReady]);

  // Jump to 100% when ready
  useEffect(() => {
    if (isReady && displayProgress >= 95) {
      setDisplayProgress(100);
    }
  }, [isReady, displayProgress]);

  // Handle exit animation when complete
  useEffect(() => {
    if (displayProgress >= 100 && isReady && !isExiting) {
      setIsExiting(true);

      // Hold for a moment, then fade out
      const exitTl = gsap.timeline();
      exitTl.to({}, { duration: 0.6 })
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            onComplete?.();
          }
        });
    }
  }, [displayProgress, isReady, isExiting, onComplete]);

  // Update text glow based on progress
  useEffect(() => {
    const progress = displayProgress / 100;

    // Move counter based on progress
    if (counterRef.current) {
      const maxTranslateX = window.innerWidth * 0.3;
      gsap.set(counterRef.current, {
        x: progress * maxTranslateX - maxTranslateX / 2
      });
    }

    // "Welcome" lights up 0-33%
    if (welcomeRef.current) {
      const welcomeOpacity = Math.min(progress * 3, 1);
      gsap.set(welcomeRef.current, {
        opacity: welcomeOpacity,
        textShadow: `0 0 ${welcomeOpacity * 20}px rgba(246, 130, 56, ${welcomeOpacity * 0.5})`
      });
    }

    // "to" lights up 33-66%
    if (toRef.current) {
      const toOpacity = Math.max(0, Math.min((progress - 0.33) * 3, 1));
      gsap.set(toRef.current, {
        opacity: toOpacity,
        textShadow: `0 0 ${toOpacity * 15}px rgba(246, 130, 56, ${toOpacity * 0.4})`
      });
    }

    // "Web Architects" lights up 66-100%
    if (webArchitectsRef.current) {
      const waOpacity = Math.max(0, Math.min((progress - 0.66) * 3, 1));
      gsap.set(webArchitectsRef.current, {
        opacity: waOpacity,
        textShadow: `0 0 ${waOpacity * 30}px rgba(246, 130, 56, ${waOpacity * 0.6})`
      });
    }
  }, [displayProgress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#263226] text-white overflow-hidden"
    >
      {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#263226] via-[#1a241a] to-[#0f150f]" />

      {/* Subtle desert-colored ambient glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 50% 80%, rgba(246, 130, 56, 0.3) 0%, transparent 60%)'
        }}
      />

      {/* Content container */}
      <div className="relative z-10 text-center px-4">
        {/* Welcome text */}
        {showText && (
          <div
            ref={textRef}
            className="mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-wider">
              <span
                ref={welcomeRef}
                className="opacity-0 transition-all duration-300"
              >
                Welcome
              </span>{' '}
              <span
                ref={toRef}
                className="opacity-0 transition-all duration-300"
              >
                to
              </span>
              <span
                ref={webArchitectsRef}
                className="block mt-2 md:mt-4 text-[#F68238] font-medium opacity-0 transition-all duration-300"
              >
                Web Architects
              </span>
            </h1>
          </div>
        )}

        {/* Counter container */}
        <div className="relative h-24 md:h-32 flex items-center justify-center">
          <div
            ref={counterRef}
            className="relative"
          >
            <div className="text-6xl md:text-8xl lg:text-9xl font-thin tabular-nums text-white/90">
              {displayProgress}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 md:mt-12 w-48 md:w-64 mx-auto">
          <div className="h-[2px] bg-white/10 relative rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F68238] to-[#FFA366] absolute left-0 top-0 rounded-full"
              style={{
                width: `${displayProgress}%`,
                transition: 'width 0.1s ease-out',
                boxShadow: '0 0 10px rgba(246, 130, 56, 0.5)'
              }}
            />
          </div>
          <div className="mt-4 text-xs md:text-sm font-light tracking-[0.3em] text-white/40">
            {displayProgress < 100 ? 'LOADING' : 'READY'}
          </div>
        </div>
      </div>

      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-particle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              backgroundColor: i % 3 === 0 ? 'rgba(246, 130, 56, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.1;
          }
          25% {
            transform: translateY(-15px) translateX(10px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-25px) translateX(-5px);
            opacity: 0.2;
          }
          75% {
            transform: translateY(-10px) translateX(-10px);
            opacity: 0.3;
          }
        }
        .animate-float-particle {
          animation: float-particle infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
