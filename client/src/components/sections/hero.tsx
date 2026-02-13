import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { gsap } from '@/lib/gsap';
import { DustParticles } from '@/components/ui/dust-particles';
import { useLanguage } from '@/lib/i18n';
import { useDesertScroll, getPhaseProgress } from '@/hooks/use-desert-scroll';
import { ScrollVideo } from '@/components/ui/scroll-video';

interface HeroProps {
  onAnimationComplete?: () => void;
  onVideoReady?: () => void;
  onVideoProgress?: (progress: number) => void;
}

// Service discovery configuration - each service appears from a different position
const serviceDiscoveries = [
  {
    // Web & Mobile App Dev - emerges from the left, behind a dune
    position: { left: '8%', top: '45%' },
    enterFrom: { x: -100, y: 20 },
    exitTo: { x: -150, y: -30 },
    align: 'left' as const,
  },
  {
    // AI Solutions - emerges from the right side
    position: { right: '10%', top: '35%' },
    enterFrom: { x: 100, y: 30 },
    exitTo: { x: 150, y: -20 },
    align: 'right' as const,
  },
  {
    // E-Commerce - rises from below center-left
    position: { left: '15%', bottom: '30%' },
    enterFrom: { x: -50, y: 80 },
    exitTo: { x: -80, y: -40 },
    align: 'left' as const,
  },
  {
    // Web Design - appears at the horizon, center
    position: { left: '50%', top: '40%', transform: 'translateX(-50%)' },
    enterFrom: { x: 0, y: 60 },
    exitTo: { x: 0, y: -50 },
    align: 'center' as const,
  },
];

export function Hero({ onAnimationComplete, onVideoReady, onVideoProgress }: HeroProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useLanguage();

  // Notify parent when video is ready
  const handleVideoReady = () => {
    onVideoReady?.();
  };

  // On mobile with static image, trigger ready immediately
  useEffect(() => {
    if (isMobile) {
      onVideoReady?.();
    }
  }, [isMobile, onVideoReady]);

  // Initialize the desert scroll hook
  // Desktop: full scroll journey with video
  // Mobile: disabled - just static hero section
  const { containerRef, scrollProgress } = useDesertScroll({
    scrollDistance: 4,
    enabled: !isMobile, // Disable on mobile - no scroll animation
    isMobile,
  });

  // Calculate overlay opacity based on scroll progress
  // Text fades out in the first 20% of the scroll journey
  // Mobile: always visible (no fade)
  const overlayOpacity = useMemo(() => {
    if (isMobile) return 1; // Always visible on mobile
    const fadeProgress = getPhaseProgress(scrollProgress, 0, 0.2);
    return 1 - fadeProgress;
  }, [scrollProgress, isMobile]);

  // Calculate each service's appearance with staggered discovery timing
  // Services gather together at the end before fading out
  const gatherStart = 0.62; // When services start gathering
  const gatherEnd = 0.72;   // When services are fully gathered
  const fadeOutStart = 0.78;
  const fadeOutEnd = 0.88;

  // Service states - SKIP on mobile since we don't render individual discoveries
  const serviceStates = useMemo(() => {
    // On mobile, return empty array - we don't use this
    if (isMobile) return [];

    const timings = [
      { start: 0.12, peak: 0.22 },
      { start: 0.25, peak: 0.35 },
      { start: 0.38, peak: 0.48 },
      { start: 0.50, peak: 0.60 },
    ];

    const isGathering = scrollProgress >= gatherStart;
    const fadeProgress = getPhaseProgress(scrollProgress, fadeOutStart, fadeOutEnd);

    return serviceDiscoveries.map((config, index) => {
      const timing = timings[index];
      const { enterFrom } = config;

      let opacity = 0;
      if (scrollProgress < timing.start) {
        opacity = 0;
      } else if (scrollProgress < timing.peak) {
        opacity = getPhaseProgress(scrollProgress, timing.start, timing.peak);
      } else if (scrollProgress < fadeOutStart) {
        opacity = 1;
      } else if (scrollProgress < fadeOutEnd) {
        opacity = 1 - fadeProgress;
      }

      let x = 0, y = 0;
      if (scrollProgress < timing.start) {
        x = enterFrom.x;
        y = enterFrom.y;
      } else if (scrollProgress < timing.peak) {
        const progress = getPhaseProgress(scrollProgress, timing.start, timing.peak);
        x = enterFrom.x * (1 - progress);
        y = enterFrom.y * (1 - progress);
      }

      return { opacity, x, y, gathered: isGathering && opacity > 0 };
    });
  }, [scrollProgress, gatherStart, fadeOutStart, fadeOutEnd, isMobile]);


  // Calculate transition overlay opacity (fade to white at the end)
  // Mobile: no transition overlay
  const transitionOpacity = useMemo(() => {
    if (isMobile) return 0; // No transition on mobile
    return getPhaseProgress(scrollProgress, 0.85, 1);
  }, [scrollProgress, isMobile]);

  // Map scroll progress to video progress with offset (start at ~15% into the video)
  const videoProgress = useMemo(() => {
    const videoStartOffset = 0.12; // Start 12% into the video
    const videoRange = 1 - videoStartOffset; // Remaining video duration to use
    return videoStartOffset + (scrollProgress * videoRange);
  }, [scrollProgress]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Trigger animation complete callback
  useEffect(() => {
    if (onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [onAnimationComplete]);

  // Initial content animation
  useEffect(() => {
    const tl = gsap.timeline();

    tl.from('.hero-content', { duration: 0.8, y: 20, opacity: 0, ease: "power2.out" })
      .from('.hero-services', { duration: 0.8, y: 20, opacity: 0, ease: "power2.out" }, "-=0.4");
  }, []);

  const scrollToPartners = () => {
    const el = document.getElementById('partners');
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Service labels
  const serviceLabels = [
    t('hero.web-apps'),
    'AI Solutions',
    t('hero.eshops'),
    t('hero.web-design'),
  ];

  return (
    <section
      id="home"
      className="hero-section min-h-screen relative overflow-hidden"
      ref={containerRef as React.RefObject<HTMLElement>}
      style={{ zIndex: 50 }}
    >
      {/* Background - Video on desktop, static image on mobile */}
      <div className="absolute inset-0 z-0">
        {isMobile ? (
          /* Mobile: Static image - positioned to show sun on right */
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: 'url(/desert.png)',
              backgroundPosition: '75% center'
            }}
          />
        ) : (
          /* Desktop: Scroll-driven video */
          <ScrollVideo
            src="/desert.mp4"
            scrollProgress={videoProgress}
            onReady={handleVideoReady}
            onLoadProgress={onVideoProgress}
            isMobile={false}
          />
        )}
        {/* Subtle overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Floating dust particles - original GSAP animation */}
      <DustParticles
        className="opacity-60"
        particleCount={isMobile ? 80 : 150}
        intensity="light"
      />

      {/* Main content with asymmetric layout */}
      <div
        className="container-fluid relative z-30 pt-24 pb-16"
        style={{
          opacity: overlayOpacity,
          // Mobile: no transforms (static)
          // Desktop: parallax movement based on scroll
          transform: isMobile ? 'none' : `translate3d(0, ${scrollProgress * -50}px, 0)`,
          willChange: isMobile ? 'auto' : 'transform, opacity',
          pointerEvents: overlayOpacity < 0.1 ? 'none' : 'auto',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end min-h-[80vh]">
          {/* Left side - Experimental typography */}
          <div className="col-span-1 lg:col-span-9 hero-content">
            <div className="space-y-6">
              {/* Main heading with proper SEO structure */}
              <div className="relative hero-title">
                <h1 className="text-[clamp(2.5rem,6vw,8rem)] font-medium leading-[0.85] tracking-wide">
                  <div className="text-white/20 select-none absolute -top-2 left-6 font-normal">
                    {t('hero.web')}
                  </div>
                  <div className="text-white font-semibold drop-shadow-lg">
                    {t('hero.web')}
                  </div>
                </h1>
                <div className="text-[clamp(2rem,5vw,6rem)] font-medium leading-[0.9] ml-8 -mt-2 tracking-wider">
                  <span className="text-gradient drop-shadow-lg font-semibold">
                    {t('hero.architects')}
                  </span>
                </div>
              </div>

              {/* Experimental text arrangement (Desktop) */}
              <div className="hidden lg:grid grid-cols-3 gap-8 mt-16 hero-subtitle">
                <div className="col-span-1 space-y-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/60"></div>
                  <div className="text-sm font-medium text-white/90 drop-shadow"></div>
                </div>
                <div className="col-span-2 space-y-2">
                  <div className="text-2xl font-medium leading-snug text-white max-w-xl drop-shadow-lg tracking-tight">
                    {t('hero.tagline')}
                  </div>
                </div>
              </div>

              {/* Mobile tagline */}
              <div className="lg:hidden mt-8 hero-subtitle">
                <div className="text-xl font-medium leading-snug text-white max-w-md drop-shadow-lg tracking-tight">
                  {t('hero.tagline')}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Minimal info panel */}
          <div className="col-span-1 lg:col-span-3 lg:col-start-11 space-y-8 hero-services">
            <div className="space-y-6">
              <div className="w-16 h-px bg-primary/40"></div>
              <div className="space-y-4">
                <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                  {t('hero.services')}
                </div>
                <div className="space-y-1 text-sm font-medium text-white/90 drop-shadow">
                  <div>{t('hero.web-apps')}</div>
                  <div>AI Solutions</div>
                  <div>{t('hero.eshops')}</div>
                  <div>{t('hero.web-design')}</div>
                </div>
              </div>

              <div className="pt-8">
                <Button
                  className="bg-white text-black hover:bg-white/90 px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300 shadow-lg"
                  onClick={scrollToPartners}
                >
                  {t('hero.view-work')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discovered Services - each appears at different positions as you journey */}
      {/* On mobile, skip the individual discovery animations for performance */}
      {!isMobile && serviceDiscoveries.map((config, index) => {
        const state = serviceStates[index];
        const isVisible = state.opacity > 0 && !state.gathered;

        if (!isVisible) return null;

        return (
          <div
            key={index}
            className="absolute z-30 pointer-events-none"
            style={{
              ...config.position,
              opacity: state.opacity,
              transform: `translate3d(${state.x}px, ${state.y}px, 0)`,
              willChange: 'transform, opacity',
            }}
          >
            <div
              className={`
                ${config.align === 'left' ? 'text-left' : ''}
                ${config.align === 'right' ? 'text-right' : ''}
                ${config.align === 'center' ? 'text-center' : ''}
              `}
            >
              {/* Small label */}
              <div
                className="text-xs uppercase tracking-[0.3em] text-white/40 font-light mb-2"
              >
                {index === 0 && 'Discover'}
                {index === 1 && 'Explore'}
                {index === 2 && 'Build'}
                {index === 3 && 'Create'}
              </div>

              {/* Service name */}
              <div
                className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white tracking-wide"
                style={{
                  textShadow: '0 4px 30px rgba(0,0,0,0.4), 0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                {serviceLabels[index]}
              </div>

              {/* Accent line */}
              <div
                className={`
                  h-px bg-gradient-to-r mt-3
                  ${config.align === 'left' ? 'from-[#F68238]/60 to-transparent w-24' : ''}
                  ${config.align === 'right' ? 'from-transparent to-[#F68238]/60 w-24 ml-auto' : ''}
                  ${config.align === 'center' ? 'from-transparent via-[#F68238]/60 to-transparent w-32 mx-auto' : ''}
                `}
                style={{ opacity: 0.8 }}
              />
            </div>
          </div>
        );
      })}

      {/* Gathered Services - Desktop only */}
      {!isMobile && (() => {
        const effectiveGatherProgress = getPhaseProgress(scrollProgress, gatherStart, gatherEnd);
        const effectiveFadeOut = getPhaseProgress(scrollProgress, fadeOutStart, fadeOutEnd);

        if (effectiveGatherProgress <= 0) return null;

        const containerOpacity = Math.min(effectiveGatherProgress, 1 - effectiveFadeOut);
        if (containerOpacity <= 0) return null;

        return (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
            style={{ opacity: containerOpacity }}
          >
            <div className="text-center space-y-4">
              <div
                className="text-xs uppercase tracking-[0.3em] text-white/50 font-light mb-6"
                style={{ transform: `translateY(${(1 - effectiveGatherProgress) * 20}px)` }}
              >
                What We Do
              </div>

              {serviceLabels.map((label, index) => (
                <div
                  key={index}
                  className="text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-wide"
                  style={{
                    textShadow: '0 4px 30px rgba(0,0,0,0.4), 0 2px 10px rgba(0,0,0,0.3)',
                    transform: `translateY(${(1 - effectiveGatherProgress) * (30 + index * 15)}px)`,
                  }}
                >
                  {label}
                </div>
              ))}

              <div className="pt-4">
                <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#F68238]/60 to-transparent mx-auto"></div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Scroll indicator (only visible when content is visible) - Desktop only */}
      {!isMobile && overlayOpacity > 0.5 && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
          style={{ opacity: overlayOpacity }}
        >
          <span className="text-white/60 text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      )}

      {/* Transition overlay (fade to white at end of journey) - Desktop only */}
      {!isMobile && transitionOpacity > 0 && (
        <div
          className="absolute inset-0 z-40 pointer-events-none"
          style={{
            backgroundColor: 'hsl(0 0% 98%)',
            opacity: transitionOpacity,
            transition: 'opacity 0.1s ease-out',
          }}
        />
      )}

      {/* Subtle section separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent z-50"></div>
    </section>
  );
}
