import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { ChevronDown } from 'lucide-react';
import { CodeToScenery } from '@/components/ui/code-to-scenery';
import { DustParticles } from '@/components/ui/dust-particles';

interface HeroProps {
  onAnimationComplete?: () => void;
}

export function Hero({ onAnimationComplete }: HeroProps) {
  const [hasImageBackground, setHasImageBackground] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Smooth content reveal animation
  useEffect(() => {
    if (showContent) {
      const tl = gsap.timeline();
      
      // First animate the main title
      tl.fromTo('.hero-title', 
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
      )
      // Then the subtitle with slight delay
      .fromTo('.hero-subtitle', 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=1.0"
      )
      // Animate the services panel
      .fromTo('.hero-services', 
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8"
      )
      // Finally the bottom navigation
      .fromTo('.hero-nav', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.5"
      )
      // Mobile 01 and DIGITAL elements
      .fromTo('.hero-mobile-digital', 
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.3"
      );
    }
  }, [showContent]);
  const containerRef = useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.hero-content', { duration: 2, y: 60, opacity: 0, ease: "power4.out", delay: 0.5 })
      .from('.scroll-indicator', { duration: 1.5, y: 20, opacity: 0, ease: "power3.out" }, "-=0.8")
      .from('.floating-elements > *', { 
        duration: 3, 
        y: 80, 
        opacity: 0, 
        stagger: 0.3,
        ease: "power4.out"
      }, "-=1.5");

    // Parallax scroll effect for background image
    gsap.to('.background-image img', {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to('.background-elements', {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  const scrollToNext = () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: window.innerHeight, autoKill: false },
      ease: "power2.inOut"
    });
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden z-50" ref={containerRef}>
      {/* Code to scenery background - NO DOTS */}
      <CodeToScenery 
        className="opacity-90" 
        onImageStateChange={(hasImages) => {
          setHasImageBackground(hasImages);
          if (hasImages) {
            // Show content with a smooth delay after background changes
            setTimeout(() => setShowContent(true), 1200);
          }
        }}
        onAnimationComplete={() => {
          console.log('CodeToScenery animation complete callback received');
          setAnimationComplete(true);
          onAnimationComplete?.();
        }}
      />
      
      {/* Dust particles animation */}
      {hasImageBackground && (
        <DustParticles 
          className="opacity-95" 
          particleCount={350}
          intensity="heavy"
        />
      )}
      
      
      {/* Main content with asymmetric layout */}
      {showContent && (
        <div className="container-fluid relative z-20 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end min-h-[80vh]">
          
          {/* Left side - Experimental typography */}
          <div className="col-span-1 lg:col-span-9 hero-content">
            <div className="space-y-6">
              {/* Fragmented title */}
              <div className="relative hero-title">
                <div className="text-[clamp(2.5rem,6vw,8rem)] font-medium leading-[0.85] tracking-wide">
                  <div className={`${hasImageBackground ? 'text-white/20' : 'text-foreground/20'} select-none absolute -top-2 left-6 font-normal`}>WEB</div>
                  <div className={`${hasImageBackground ? 'text-white' : 'text-foreground'} font-semibold drop-shadow-lg`}>WEB</div>
                </div>
                <div className="text-[clamp(2rem,5vw,6rem)] font-medium leading-[0.9] ml-8 -mt-2 tracking-wider">
                  <span className="text-gradient drop-shadow-lg font-semibold">ARCHITECTS</span>
                </div>
              </div>
              
              {/* Experimental text arrangement */}
              <div className="hidden lg:grid grid-cols-3 gap-8 mt-16 hero-subtitle">
                <div className="col-span-1 space-y-4">
                  <div className={`text-xs uppercase tracking-[0.2em] ${hasImageBackground ? 'text-white/60' : 'text-muted-foreground'}`}></div>
                  <div className={`text-sm font-medium ${hasImageBackground ? 'text-white/90' : 'text-foreground/80'} drop-shadow`}></div>
                </div>
                <div className="col-span-2 space-y-2">
                  <div className={`text-lg font-medium ${hasImageBackground ? 'text-white/95' : 'text-foreground/90'} max-w-md drop-shadow`}>
                    Creating digital experiences that push boundaries
                  </div>
                </div>
              </div>

              {/* Mobile tagline */}
              <div className="lg:hidden mt-8 hero-subtitle">
                <div className={`text-lg font-medium ${hasImageBackground ? 'text-white/95' : 'text-foreground/90'} max-w-md drop-shadow`}>
                  Creating digital experiences that push boundaries
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Minimal info panel */}
          <div className="col-span-1 lg:col-span-3 lg:col-start-11 space-y-8 hero-services">
            <div className="space-y-6">
              <div className="w-16 h-px bg-primary/40"></div>
              <div className="space-y-4">
                <div className={`text-xs uppercase tracking-[0.2em] ${hasImageBackground ? 'text-white/60' : 'text-muted-foreground'}`}>SERVICES</div>
                <div className={`space-y-1 text-sm font-medium ${hasImageBackground ? 'text-white/90' : 'text-foreground/80'} drop-shadow`}>
                  <div>Web & Mobile Applications</div>
                  <div>Digital Design</div>
                  <div>Creative Development</div>
                </div>
              </div>
              
              <div className="pt-8">
                <Button 
                  className={`${hasImageBackground ? 'bg-white text-black hover:bg-white/90' : 'bg-foreground text-background hover:bg-foreground/90'} px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300 shadow-lg`}
                  onClick={scrollToNext}
                >
                  View Work
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile 01 and DIGITAL elements positioned bottom right */}
        <div className="lg:hidden absolute bottom-20 right-8 space-y-2 hero-mobile-digital">
          <div className={`text-xs uppercase tracking-[0.2em] text-right ${hasImageBackground ? 'text-white/60' : 'text-muted-foreground'}`}></div>
          <div className={`text-sm font-medium text-right ${hasImageBackground ? 'text-white/90' : 'text-foreground/80'} drop-shadow`}></div>
        </div>
        
        {/* Bottom navigation hint */}
        <div className="absolute bottom-8 left-8 hero-nav">
          <button 
            onClick={scrollToNext}
            className={`flex items-center space-x-2 ${hasImageBackground ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-foreground'} transition-colors duration-300 group drop-shadow`}
          >
            <span className="text-xs font-medium tracking-wide uppercase">Explore</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
          </button>
        </div>
        </div>
      )}
      
      {/* Subtle section separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </section>
  );
}
