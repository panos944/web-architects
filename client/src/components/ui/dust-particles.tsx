import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';

interface DustParticlesProps {
  className?: string;
  particleCount?: number;
  intensity?: 'light' | 'medium' | 'heavy';
}

export function DustParticles({
  className = '',
  particleCount = 260,
  intensity = 'heavy'
}: DustParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop: Use GSAP animations
  useEffect(() => {
    if (isMobile || !containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'dust-particle absolute opacity-0';

      const size = Math.random() * 8 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = `rgba(250, 223, 202, ${Math.random() * 0.8 + 0.3})`;
      particle.style.borderRadius = '50%';
      particle.style.filter = 'blur(0.8px)';
      particle.style.boxShadow = '0 0 4px rgba(250, 223, 202, 0.5)';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      container.appendChild(particle);
      particles.push(particle);
    }

    // Animate particles with GSAP
    particles.forEach((particle) => {
      const delay = Math.random() * 4;
      const duration = 8 + Math.random() * 6;
      const startX = -100;
      const endX = window.innerWidth + 100;
      const verticalDrift = (Math.random() - 0.5) * 200;

      gsap.set(particle, {
        x: startX,
        y: Math.random() * window.innerHeight,
        opacity: 0,
        scale: Math.random() * 0.8 + 0.2
      });

      const tl = gsap.timeline({ repeat: -1, delay });

      tl.to(particle, {
        duration: 0.5,
        opacity: Math.random() * 0.9 + 0.4,
        ease: "power2.out"
      })
      .to(particle, {
        duration: duration,
        x: endX,
        y: `+=${verticalDrift}`,
        ease: "none"
      }, 0.3)
      .to(particle, {
        duration: 1,
        opacity: 0,
        ease: "power2.in"
      }, duration - 1);

      gsap.to(particle, {
        duration: 2 + Math.random() * 2,
        y: `+=${(Math.random() - 0.5) * 40}`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: delay + Math.random() * 2
      });

      gsap.to(particle, {
        duration: 4 + Math.random() * 4,
        rotation: Math.random() * 360,
        repeat: -1,
        ease: "none",
        delay: delay
      });
    });

    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      gsap.killTweensOf(particles);
    };
  }, [particleCount, intensity, isMobile]);

  // Mobile: Use lightweight CSS animations instead of GSAP
  if (isMobile) {
    return (
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
        style={{ zIndex: 1 }}
      >
        {/* Lightweight CSS-only particles for mobile */}
        {[...Array(particleCount)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-dust-float"
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              backgroundColor: `rgba(250, 223, 202, ${Math.random() * 0.5 + 0.2})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${12 + Math.random() * 8}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes dust-float {
            0% {
              transform: translate3d(0, 0, 0);
              opacity: 0;
            }
            10% {
              opacity: 0.4;
            }
            90% {
              opacity: 0.4;
            }
            100% {
              transform: translate3d(100vw, ${Math.random() > 0.5 ? '-' : ''}50px, 0);
              opacity: 0;
            }
          }
          .animate-dust-float {
            animation: dust-float linear infinite;
            will-change: transform, opacity;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}
