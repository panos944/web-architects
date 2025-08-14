import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'dust-particle absolute opacity-0';
      
      // Random sizes for variety - larger particles
      const size = Math.random() * 8 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = `rgba(250, 223, 202, ${Math.random() * 0.8 + 0.3})`;
      particle.style.borderRadius = '50%';
      particle.style.filter = 'blur(0.8px)';
      particle.style.boxShadow = '0 0 4px rgba(250, 223, 202, 0.5)';
      
      // Random starting positions
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      container.appendChild(particle);
      particles.push(particle);
    }

    // Animate particles
    particles.forEach((particle) => {
      const delay = Math.random() * 4;
      const duration = 8 + Math.random() * 6;
      const startX = -100;
      const endX = window.innerWidth + 100;
      const verticalDrift = (Math.random() - 0.5) * 200;
      
      // Set initial position off-screen
      gsap.set(particle, {
        x: startX,
        y: Math.random() * window.innerHeight,
        opacity: 0,
        scale: Math.random() * 0.8 + 0.2
      });

      // Create floating animation timeline
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

      // Add subtle floating motion
      gsap.to(particle, {
        duration: 2 + Math.random() * 2,
        y: `+=${(Math.random() - 0.5) * 40}`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: delay + Math.random() * 2
      });

      // Add gentle rotation
      gsap.to(particle, {
        duration: 4 + Math.random() * 4,
        rotation: Math.random() * 360,
        repeat: -1,
        ease: "none",
        delay: delay
      });
    });

    // Cleanup function
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      gsap.killTweensOf(particles);
    };
  }, [particleCount, intensity]);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}