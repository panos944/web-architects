import { useEffect, useState, useRef } from 'react';
import { gsap } from '@/lib/gsap';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [counter, setCounter] = useState(0);
  const [showText, setShowText] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);
  const webArchitectsRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Start the text animation first
    tl.to({}, { duration: 0.5 }) // Small delay
      .call(() => setShowText(true))
      .fromTo(textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
      )
      // Start counter animation
      .to({}, { duration: 0.3 }) // Brief pause
      .to({ value: 0 }, {
        value: 100,
        duration: 3,
        ease: "power2.out",
        onUpdate: function() {
          const value = Math.round(this.targets()[0].value);
          setCounter(value);
          
          // Move counter from left to right based on progress
          if (counterRef.current) {
            const progress = value / 100;
            const maxTranslateX = window.innerWidth * 0.3; // 30% of screen width
            gsap.set(counterRef.current, {
              x: progress * maxTranslateX - maxTranslateX / 2
            });
          }

          // Gradually light up the text based on counter progress
          const progress = value / 100;
          
          // "Welcome" lights up 0-33%
          if (welcomeRef.current) {
            const welcomeOpacity = Math.min(progress * 3, 1);
            gsap.set(welcomeRef.current, { 
              opacity: welcomeOpacity,
              textShadow: `0 0 ${welcomeOpacity * 20}px rgba(255, 163, 102, ${welcomeOpacity * 0.5})`
            });
          }
          
          // "to" lights up 33-66%
          if (toRef.current) {
            const toOpacity = Math.max(0, Math.min((progress - 0.33) * 3, 1));
            gsap.set(toRef.current, { 
              opacity: toOpacity,
              textShadow: `0 0 ${toOpacity * 15}px rgba(255, 163, 102, ${toOpacity * 0.4})`
            });
          }
          
          // "Web Architects" lights up 66-100%
          if (webArchitectsRef.current) {
            const waOpacity = Math.max(0, Math.min((progress - 0.66) * 3, 1));
            gsap.set(webArchitectsRef.current, { 
              opacity: waOpacity,
              textShadow: `0 0 ${waOpacity * 30}px rgba(255, 163, 102, ${waOpacity * 0.6})`
            });
          }
        }
      })
      // Hold for a moment when complete
      .to({}, { duration: 0.8 })
      // Fade out the entire screen
      .to(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#263226] text-white overflow-hidden"
    >
      {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#263226] via-[#1a241a] to-[#0f150f]" />
      
      {/* Content container */}
      <div className="relative z-10 text-center">
        {/* Welcome text */}
        {showText && (
          <div 
            ref={textRef}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wider">
              <span 
                ref={welcomeRef}
                className="opacity-0"
              >
                Welcome
              </span>{' '}
              <span 
                ref={toRef}
                className="opacity-0"
              >
                to
              </span>
              <span 
                ref={webArchitectsRef}
                className="block mt-4 text-[#FFA366] font-medium opacity-0"
              >
                Web Architects
              </span>
            </h1>
          </div>
        )}

        {/* Counter container */}
        <div className="relative h-32 flex items-center justify-center">
          <div 
            ref={counterRef}
            className="relative"
          >
            <div className="text-8xl md:text-9xl lg:text-[12rem] font-thin tabular-nums">
              {counter}
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-12 w-64 mx-auto">
          <div className="h-px bg-white/20 relative">
            <div 
              className="h-px bg-[#FFA366] absolute left-0 top-0 transition-all duration-300 ease-out"
              style={{ width: `${counter}%` }}
            />
          </div>
          <div className="mt-4 text-sm font-light tracking-widest opacity-60">
            LOADING
          </div>
        </div>
      </div>

      {/* Ambient particles for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.3; }
        }
        .absolute.w-1.h-1 {
          animation: float infinite linear;
        }
      `}</style>
    </div>
  );
}