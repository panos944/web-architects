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
      "$ npx create-app web-architects",
      "✓ Installing packages...",
      "✓ Project created successfully",
      "$ npm start..."
    ];


    let lineIndex = 0;
    let charIndex = 0;
    let nextTick = performance.now();
    let terminalFadeStart = 0;
    const terminalFadeDuration = 1200; // Duration of terminal fade-out in ms
    const totalChars = lines.join('').length + lines.length; // Total characters + line breaks
    const cps = totalChars / 2.0; // Characters per second to finish typing in 3.0s
    const linePause = 300; // Slightly longer pause between lines
    const cursorBlink = 500;
    // Blink 3 times: 3 on + 3 off = 6 intervals
    const preTypingDuration = cursorBlink * 6; // 3000ms for 3 blinks
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

      // Terminal window dimensions
      const termWidth = Math.max(340, w * 0.7);
      const termHeight = 140;
      const padX = Math.max(20, w * 0.05);
      const padY = h * 0.4;

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

      // Draw terminal text with fade-out effect
      if (terminalOpacity > 0) {
        ctx.fillStyle = '#263226';
        ctx.globalAlpha = terminalOpacity;
        ctx.font = '16px Monaco, Consolas, monospace';
        ctx.textBaseline = 'top';

        const lineHeight = 24;
        const padX = Math.max(20, w * 0.05);
        const padY = h * 0.4;

        // Pre-typing cursor blink
        if (lineIndex === 0 && charIndex === 0 && now - preTypingStart < preTypingDuration) {
          if (Math.floor(now / cursorBlink) % 2 === 0) {
            ctx.fillRect(padX, padY + 2, 10, 20);
          }
          animationFrame = requestAnimationFrame(draw);
          return;
        }

        // Advance typing
        if (terminalFadeStart === 0 && now >= nextTick && lineIndex < lines.length) {
          if (charIndex < lines[lineIndex].length) {
            charIndex++;
            nextTick = now + 1000 / cps;
          } else {
            if (lineIndex < lines.length - 1) {
              lineIndex++;
              charIndex = 0;
              nextTick = now + linePause;
            }
          }
        }

        // Draw completed lines
        for (let i = 0; i < lineIndex; i++) {
          ctx.fillText(lines[i], padX, padY + i * lineHeight);
        }

        // Draw current line being typed
        if (lineIndex < lines.length) {
          const currentText = lines[lineIndex].slice(0, charIndex);
          ctx.fillText(currentText, padX, padY + lineIndex * lineHeight);

          // Draw cursor
          if (terminalFadeStart === 0 && Math.floor(now / cursorBlink) % 2 === 0) {
            const metrics = ctx.measureText(currentText);
            ctx.fillRect(
              padX + metrics.width,
              padY + lineIndex * lineHeight + 2,
              10,
              20
            );
          }
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