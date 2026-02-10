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

// Minimum time the loading screen will be shown (in seconds)
const MIN_LOADING_DURATION = 2.8;

export function LoadingScreen({ progress: externalProgress, isReady = false, onComplete }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);
  const webArchitectsRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const hasInitializedRef = useRef(false);
  const progressObjRef = useRef({ value: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Initialize animations on mount
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    startTimeRef.current = Date.now();

    // Animate text elements in with stagger
    const tl = gsap.timeline();

    tl.set([welcomeRef.current, toRef.current, webArchitectsRef.current], { opacity: 0, y: 20 })
      .set(textRef.current, { opacity: 1 })
      .to(welcomeRef.current, {
        opacity: 0.15, // Start dim
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.3
      })
      .to(toRef.current, {
        opacity: 0.15,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.4")
      .to(webArchitectsRef.current, {
        opacity: 0.15,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.4");
  }, []);

  // Smoothly animate progress with GSAP
  useEffect(() => {
    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
    const timeProgress = Math.min(elapsedTime / MIN_LOADING_DURATION, 1);

    // Calculate target: blend of time-based progress and actual load progress
    // This ensures minimum duration while responding to actual load
    const actualProgress = externalProgress ?? 0;
    const minProgress = timeProgress * 100;

    // Don't exceed actual progress too much, but always advance based on time
    let targetProgress = Math.min(
      Math.max(minProgress, actualProgress * 100 * 0.7), // Advance with time, but cap at 70% of actual
      actualProgress * 100 // Never exceed actual progress
    );

    // If ready and time elapsed, go to 100
    if (isReady && elapsedTime >= MIN_LOADING_DURATION * 0.9) {
      targetProgress = 100;
    } else if (!isReady) {
      // Cap at 92% until ready
      targetProgress = Math.min(targetProgress, 92);
    }

    // Kill existing tween if any
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    // Smoothly animate to target
    tweenRef.current = gsap.to(progressObjRef.current, {
      value: targetProgress,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayProgress(Math.round(progressObjRef.current.value));
      }
    });

    // Continue checking progress
    if (targetProgress < 100) {
      const timer = setTimeout(() => {
        // Force a re-render to check progress again
        setDisplayProgress(prev => prev);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [externalProgress, isReady, displayProgress]);

  // Handle exit animation when complete
  useEffect(() => {
    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;

    if (displayProgress >= 100 && isReady && elapsedTime >= MIN_LOADING_DURATION && !isExiting) {
      setIsExiting(true);

      // Elegant exit animation
      const exitTl = gsap.timeline();
      exitTl
        .to({}, { duration: 0.4 }) // Brief hold at 100%
        .to([welcomeRef.current, toRef.current, webArchitectsRef.current], {
          opacity: 0,
          y: -20,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.in"
        })
        .to(counterRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 0.4,
          ease: "power2.in"
        }, "-=0.3")
        .to(progressBarRef.current?.parentElement, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        }, "-=0.3")
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            onComplete?.();
          }
        }, "-=0.2");
    }
  }, [displayProgress, isReady, isExiting, onComplete]);

  // Update text glow based on progress - smooth lighting effect
  useEffect(() => {
    const progress = displayProgress / 100;

    // Move counter smoothly based on progress
    if (counterRef.current) {
      const maxTranslateX = window.innerWidth * 0.25;
      gsap.to(counterRef.current, {
        x: progress * maxTranslateX - maxTranslateX / 2,
        duration: 0.3,
        ease: "power1.out"
      });
    }

    // "Welcome" lights up 0-35% with smooth glow
    if (welcomeRef.current) {
      const welcomeProgress = Math.min(progress / 0.35, 1);
      const welcomeOpacity = 0.15 + welcomeProgress * 0.85;
      gsap.to(welcomeRef.current, {
        opacity: welcomeOpacity,
        textShadow: `0 0 ${welcomeProgress * 25}px rgba(246, 130, 56, ${welcomeProgress * 0.6})`,
        duration: 0.4,
        ease: "power1.out"
      });
    }

    // "to" lights up 30-60%
    if (toRef.current) {
      const toProgress = Math.max(0, Math.min((progress - 0.30) / 0.30, 1));
      const toOpacity = 0.15 + toProgress * 0.85;
      gsap.to(toRef.current, {
        opacity: toOpacity,
        textShadow: `0 0 ${toProgress * 18}px rgba(246, 130, 56, ${toProgress * 0.5})`,
        duration: 0.4,
        ease: "power1.out"
      });
    }

    // "Web Architects" lights up 55-100%
    if (webArchitectsRef.current) {
      const waProgress = Math.max(0, Math.min((progress - 0.55) / 0.45, 1));
      const waOpacity = 0.15 + waProgress * 0.85;
      gsap.to(webArchitectsRef.current, {
        opacity: waOpacity,
        textShadow: `0 0 ${waProgress * 35}px rgba(246, 130, 56, ${waProgress * 0.7})`,
        duration: 0.4,
        ease: "power1.out"
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
        <div
          ref={textRef}
          className="mb-8 md:mb-12 opacity-0"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-wider">
            <span
              ref={welcomeRef}
              className="inline-block opacity-0"
            >
              Welcome
            </span>{' '}
            <span
              ref={toRef}
              className="inline-block opacity-0"
            >
              to
            </span>
            <span
              ref={webArchitectsRef}
              className="block mt-2 md:mt-4 text-[#F68238] font-medium opacity-0"
            >
              Web Architects
            </span>
          </h1>
        </div>

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
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#F68238] to-[#FFA366] absolute left-0 top-0 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${displayProgress}%`,
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
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-particle"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              backgroundColor: i % 3 === 0 ? 'rgba(246, 130, 56, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
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
            transform: translateY(-20px) translateX(12px);
            opacity: 0.35;
          }
          50% {
            transform: translateY(-35px) translateX(-8px);
            opacity: 0.2;
          }
          75% {
            transform: translateY(-15px) translateX(-12px);
            opacity: 0.35;
          }
        }
        .animate-float-particle {
          animation: float-particle infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
