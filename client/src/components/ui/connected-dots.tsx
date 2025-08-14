import { useEffect, useRef, useState } from 'react';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  id: number;
}

interface ConnectedDotsProps {
  className?: string;
  dotCount?: number;
  connectionDistance?: number;
}

export function ConnectedDots({ 
  className = "", 
  dotCount = 55,
  connectionDistance = 150
}: ConnectedDotsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<Dot[]>([]);
  const [connections, setConnections] = useState<Array<[number, number]>>([]);

  // Initialize dots
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    const initialDots: Dot[] = Array.from({ length: dotCount }, (_, i) => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      id: i
    }));

    setDots(initialDots);
  }, [dotCount]);

  // Animate dots and calculate connections
  useEffect(() => {
    if (!containerRef.current || dots.length === 0) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const animateDots = () => {
      setDots(currentDots => {
        const newDots = currentDots.map(dot => {
          let newX = dot.x + dot.vx;
          let newY = dot.y + dot.vy;
          let newVx = dot.vx;
          let newVy = dot.vy;

          // Bounce off edges
          if (newX <= 0 || newX >= rect.width) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(rect.width, newX));
          }
          if (newY <= 0 || newY >= rect.height) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(rect.height, newY));
          }

          return {
            ...dot,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        });

        // Calculate connections between nearby dots
        const newConnections: Array<[number, number]> = [];
        for (let i = 0; i < newDots.length; i++) {
          for (let j = i + 1; j < newDots.length; j++) {
            const distance = Math.sqrt(
              Math.pow(newDots[i].x - newDots[j].x, 2) + 
              Math.pow(newDots[i].y - newDots[j].y, 2)
            );
            
            if (distance < connectionDistance) {
              newConnections.push([i, j]);
            }
          }
        }
        
        setConnections(newConnections);
        return newDots;
      });
    };

    const interval = setInterval(animateDots, 16); // ~60fps
    return () => clearInterval(interval);
  }, [dots.length, connectionDistance]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map(([i, j], index) => {
          if (!dots[i] || !dots[j]) return null;
          
          const dot1 = dots[i];
          const dot2 = dots[j];
          const distance = Math.sqrt(
            Math.pow(dot1.x - dot2.x, 2) + Math.pow(dot1.y - dot2.y, 2)
          );
          const opacity = Math.max(0.1, 1 - distance / connectionDistance);
          
          return (
            <line
              key={`connection-${index}`}
              x1={dot1.x}
              y1={dot1.y}
              x2={dot2.x}
              y2={dot2.y}
              stroke="#F68238"
              strokeWidth="1"
              strokeOpacity={opacity * 0.6}
            />
          );
        })}
      </svg>

      {/* Dots */}
      {dots.map((dot, index) => {
        const connectionCount = connections.filter(([i, j]) => i === index || j === index).length;
        const dotSize = 6 + Math.min(connectionCount * 1, 4); // Larger dots with more connections
        
        return (
          <div
            key={dot.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: dot.x - dotSize / 2,
              top: dot.y - dotSize / 2,
              width: dotSize,
              height: dotSize,
              background: `radial-gradient(circle, #F68238 0%, #F68238 60%, transparent 100%)`,
              boxShadow: `0 0 ${6 + connectionCount * 2}px rgba(246, 130, 56, ${0.4 + connectionCount * 0.1})`,
              zIndex: 10 + connectionCount
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: dotSize * 0.6,
                height: dotSize * 0.6,
                background: '#263226',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 0 ${3 + connectionCount}px rgba(38, 50, 38, 0.6)`
              }}
            />
          </div>
        );
      })}
    </div>
  );
}