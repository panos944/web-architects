import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power2.out"
      });

      gsap.to(follower, {
        x: mouseX,
        y: mouseY,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseEnterInteractive = () => {
      isHovering = true;
      gsap.to(cursor, {
        scale: 0.5,
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(follower, {
        scale: 2,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeaveInteractive = () => {
      isHovering = false;
      gsap.to([cursor, follower], {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .cursor-magnetic, .image-container');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnterInteractive);
      el.addEventListener('mouseleave', handleMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnterInteractive);
        el.removeEventListener('mouseleave', handleMouseLeaveInteractive);
      });
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 hidden lg:block">
      <div
        ref={cursorRef}
        className="absolute w-3 h-3 bg-accent rounded-full transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      <div
        ref={followerRef}
        className="absolute w-8 h-8 border border-accent/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}