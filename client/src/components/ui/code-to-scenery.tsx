import { useEffect, useRef, useState } from 'react';

interface CodeToSceneryProps {
  className?: string;
  onImageStateChange?: (hasImages: boolean) => void;
  onAnimationComplete?: () => void;
}

export function CodeToScenery({ className = "", onImageStateChange, onAnimationComplete }: CodeToSceneryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const finalImageRef = useRef<HTMLImageElement | null>(null);

  // Single beautiful mountain landscape with clouds  
  const finalVideoUrl = '/desert.png'
  const isVideo = finalVideoUrl.endsWith('.mp4')

  // Check for mobile and preload final image
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (!isVideo) {
      const img = new Image();
      img.src = finalVideoUrl;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        console.log('Image loaded successfully');
        setImageLoaded(true);
      };
      img.onerror = () => {
        console.error('Failed to load image:', finalVideoUrl);
      };
      finalImageRef.current = img;
    } else {
      // For videos, still show terminal animation but skip image loading
      setImageLoaded(true);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Skip animation if already completed
    if (animationComplete) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    window.addEventListener('resize', resize);


    const lines = [
      "Welcome to Web Architects"
    ];


    let lineIndex = 0;
    let charIndex = 0;
    let nextTick = performance.now();
    let terminalFadeStart = 0;
    const terminalFadeDuration = 1200; // Duration of terminal fade-out in ms
    const totalChars = lines.join('').length + lines.length; // Total characters + line breaks
    const cps = totalChars / 1.5; // Characters per second to finish typing in 1.5s (faster)
    const linePause = 300; // Slightly longer pause between lines
    const cursorBlink = 400;
    // Blink 2 times: 2 on + 2 off = 4 intervals (shorter intro)
    const preTypingDuration = cursorBlink * 4; // 1600ms for 2 blinks
    let preTypingStart = performance.now();

    const draw = (now: number) => {
      const w = canvas.width;
      const h = canvas.height;

      // Always start with beige background
      ctx.fillStyle = '#f5f5dc';
      ctx.fillRect(0, 0, w, h);

      // Handle terminal completion and fade out
      let terminalOpacity = 1;
      let imageOpacity = 0;

      // Terminal window dimensions - centered on screen
      const termWidth = Math.max(340, w * 0.7);
      const termHeight = 140;
      const padX = (w - termWidth) / 2; // Center horizontally
      const padY = (h - termHeight) / 2; // Center vertically

      // Pre-typing cursor blink (blink 3 times before typing starts)
      if (lineIndex === 0 && charIndex === 0 && now - preTypingStart < preTypingDuration) {
        // Only draw the blinking cursor on beige background
        if (Math.floor((now - preTypingStart) / cursorBlink) % 2 === 0) {
          ctx.fillStyle = '#263226';
          ctx.fillRect(padX, padY + 2, 10, 20);
        }
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      // Check if terminal typing is complete
      if (lineIndex >= lines.length - 1 && charIndex >= lines[lineIndex].length) {
        if (terminalFadeStart === 0) {
          terminalFadeStart = now;
          onImageStateChange?.(true);
        }

        // Calculate fade progress
        const fadeTime = now - terminalFadeStart;
        const fadeProgress = Math.min(fadeTime / terminalFadeDuration, 1);
        
        terminalOpacity = 1 - fadeProgress;
        imageOpacity = fadeProgress;

        // Animation complete - show final mountain image
        if (fadeProgress >= 1) {
          console.log('Terminal animation completed');
          setAnimationComplete(true);
          onAnimationComplete?.();
          cancelAnimationFrame(animationFrame);
          return;
        }
      }

      // Draw final mountain image when fading in
      if (imageOpacity > 0 && !isVideo) {
        const finalImage = finalImageRef.current;
        if (finalImage && finalImage.complete) {
          // Calculate aspect ratio to cover canvas
          const imgAspect = finalImage.width / finalImage.height;
          const canvasAspect = w / h;
          
          let drawWidth, drawHeight, offsetX, offsetY;
          
          if (imgAspect > canvasAspect) {
            drawHeight = h;
            drawWidth = h * imgAspect;
            offsetX = (w - drawWidth) / 2;
            offsetY = 0;
          } else {
            drawWidth = w;
            drawHeight = w / imgAspect;
            offsetX = 0;
            offsetY = (h - drawHeight) / 2;
          }
          
          ctx.globalAlpha = imageOpacity;
          ctx.drawImage(finalImage, offsetX, offsetY, drawWidth, drawHeight);
          ctx.globalAlpha = 1;
          
          // Add subtle overlay for text readability
          ctx.fillStyle = `rgba(0, 0, 0, ${0.25 * imageOpacity})`;
          ctx.fillRect(0, 0, w, h);
        }
      }

      // Set font to match site typography - larger and more elegant
      const isMobileScreen = w < 768;
      const fontSize = isMobileScreen ? 24 : 32; // Much larger font
      ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`; // Match site font
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center'; // Center align for elegance
      
      // Calculate center positions
      const textX = w / 2; // Center horizontally
      const textY = h / 2; // Center vertically
      const lineHeight = 32;

      // Draw simple centered text with fade-out effect
      if (terminalOpacity > 0) {
        ctx.fillStyle = '#263226';
        ctx.globalAlpha = terminalOpacity;

        // Skip pre-typing delay and go straight to showing text
        if (now - preTypingStart > preTypingDuration) {
          // Show complete text immediately (no typing animation)
          ctx.fillText(lines[0], textX, textY);
        }
        
        ctx.globalAlpha = 1;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    animationFrame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, [animationComplete]);

  return (
    <div className={`absolute inset-0 ${className}`} style={{ zIndex: 0 }}>
      {/* Background Image - Always visible when loaded */}
      {imageLoaded && (
        <div
          className="absolute inset-0 w-full h-full"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            // VERY dramatic parallax effect
            const translateX = (x - 0.5) * 120;
            const translateY = (y - 0.5) * 80;
            const scale = 1.05 + (Math.abs(x - 0.5) + Math.abs(y - 0.5)) * 0.15;
            
            e.currentTarget.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            e.currentTarget.style.transition = 'none';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transition = 'transform 1s ease-out';
            e.currentTarget.style.transform = 'scale(1) translate(0px, 0px)';
          }}
        >
          {isVideo ? (
            <video
              key={finalVideoUrl}
              src={finalVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              webkit-playsinline="true"
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: isMobile ? '75% 25%' : 'center center',
                transform: 'scale(1)'
              }}
              onLoadedData={(e) => {
                const video = e.target as HTMLVideoElement;
                video.play().catch(() => {
                  // Auto-play prevented, will play on first user interaction
                  const playOnInteraction = () => {
                    video.play();
                    document.removeEventListener('touchstart', playOnInteraction);
                    document.removeEventListener('click', playOnInteraction);
                  };
                  document.addEventListener('touchstart', playOnInteraction, { once: true });
                  document.addEventListener('click', playOnInteraction, { once: true });
                });
              }}
            />
          ) : (
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
              style={{ 
                backgroundImage: `url("${finalVideoUrl}")`,
                backgroundColor: '#f5f5dc',
                backgroundPosition: isMobile ? '75% 25%' : 'center center'
              }}
            />
          )}
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/25 hover:bg-black/15 transition-colors duration-300"></div>
        </div>
      )}
      
      {/* Canvas Animation Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: animationComplete ? 'transparent' : '#f5f5dc',
          pointerEvents: animationComplete ? 'none' : 'auto',
          opacity: animationComplete ? 0 : 1,
          transition: 'opacity 0.5s ease-out'
        }}
      />
    </div>
  );
}