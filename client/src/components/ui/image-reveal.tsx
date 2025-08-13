import { useState, useRef } from 'react';
import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  overlayContent?: React.ReactNode;
}

export function ImageReveal({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "",
  overlayContent 
}: ImageRevealProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    if (imageLoaded && containerRef.current) {
      // Reveal animation when image loads
      const tl = gsap.timeline();
      
      tl.from(imageRef.current, {
        scale: 1.2,
        duration: 1.5,
        ease: "power3.out"
      })
      .from(overlayRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8");
    }
  }, [imageLoaded]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden group ${containerClassName}`}>
      {/* Loading state */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-2xl flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Main image */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`transition-all duration-700 ${className} ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleImageLoad}
      />
      
      {/* Overlay content */}
      {overlayContent && (
        <div ref={overlayRef} className="absolute inset-0">
          {overlayContent}
        </div>
      )}
    </div>
  );
}