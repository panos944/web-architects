import { useEffect, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { ChevronDown } from 'lucide-react';
import { DustParticles } from '@/components/ui/dust-particles';
import { useLanguage } from '@/lib/i18n';
import { Canvas } from '@react-three/fiber';
import { DesertScene3D } from '@/components/three/DesertScene3D';

interface HeroProps {
  onAnimationComplete?: () => void;
}

export function Hero({ onAnimationComplete }: HeroProps) {
  const [hasImageBackground, setHasImageBackground] = useState(true); // Always true since we have static background
  const [showContent, setShowContent] = useState(true); // Show content immediately
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t } = useLanguage();

  // Detect mobile for optimized 3D rendering and background positioning
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      console.log('Hero: Checking mobile:', mobile, 'Width:', window.innerWidth);
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simplified content reveal animation - starts immediately
  useEffect(() => {
    // Trigger animation complete callback immediately since we're using the loading screen
    if (onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 500); // Small delay to ensure DOM is ready
      
      return () => clearTimeout(timer);
    }
  }, [onAnimationComplete]);
  const containerRef = useGSAP(() => {
    const tl = gsap.timeline();
    
    // Immediate, subtle animations since loading screen handles the main entrance
    tl.from('.hero-content', { duration: 0.8, y: 20, opacity: 0, ease: "power2.out" })
      .from('.scroll-indicator', { duration: 0.6, y: 10, opacity: 0, ease: "power2.out" }, "-=0.4")
      .from('.floating-elements > *', { 
        duration: 1, 
        y: 30, 
        opacity: 0, 
        stagger: 0.2,
        ease: "power2.out"
      }, "-=0.6");

    // Parallax scroll effect for background image - disabled on mobile for performance
    const checkMobileForParallax = () => window.innerWidth < 768;
    if (!checkMobileForParallax()) {
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
    }
  }, []);

  const scrollToNext = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToPartners = () => {
    const el = document.getElementById('partners');
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden z-50" ref={containerRef}>
      {/* Desert Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          key={`bg-${isMobile}`}
          className="absolute inset-0 bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/desert.png)',
            backgroundSize: 'cover',
            backgroundPosition: isMobile ? '75% 12%' : 'center center'
          }}
        />
        {/* Subtle overlay to enhance the desert mood */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-200/10 via-transparent to-orange-900/20" />
      </div>

      {/* 3D Desert Elements Layer - Optimized for mobile */}
      <div className="absolute inset-0 z-10 opacity-70">
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            dpr={[1, isMobile ? 1 : 2]}
            performance={{ min: 0.5 }}
            gl={{ antialias: !isMobile, alpha: true }}
          >
            <DesertScene3D/>
          </Canvas>
        </Suspense>
      </div>
      
      {/* Enhanced dust particles animation - now enabled for mobile too */}
      <DustParticles 
        className="opacity-80" 
        particleCount={isMobile ? 100 : 200}
        intensity="light"
      />
      
      
      {/* Main content with asymmetric layout */}
      {showContent && (
        <div className="container-fluid relative z-30 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end min-h-[80vh]">
          
          {/* Left side - Experimental typography */}
          <div className="col-span-1 lg:col-span-9 hero-content">
            <div className="space-y-6">
              {/* Main heading with proper SEO structure */}
              <div className="relative hero-title">
                <h1 className="text-[clamp(2.5rem,6vw,8rem)] font-medium leading-[0.85] tracking-wide">
                  <div className={`${hasImageBackground ? 'text-white/20' : 'text-foreground/20'} select-none absolute -top-2 left-6 font-normal`}>{t('hero.web')}</div>
                  <div className={`${hasImageBackground ? 'text-white' : 'text-foreground'} font-semibold drop-shadow-lg`}>{t('hero.web')}</div>
                </h1>
                <div className="text-[clamp(2rem,5vw,6rem)] font-medium leading-[0.9] ml-8 -mt-2 tracking-wider">
                  <span className="text-gradient drop-shadow-lg font-semibold">{t('hero.architects')}</span>
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
                    {t('hero.tagline')}
                  </div>
                </div>
              </div>

              {/* Mobile tagline */}
              <div className="lg:hidden mt-8 hero-subtitle">
                <div className={`text-lg font-medium ${hasImageBackground ? 'text-white/95' : 'text-foreground/90'} max-w-md drop-shadow`}>
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
                <div className={`text-xs uppercase tracking-[0.2em] ${hasImageBackground ? 'text-white/60' : 'text-muted-foreground'}`}>{t('hero.services')}</div>
                <div className={`space-y-1 text-sm font-medium ${hasImageBackground ? 'text-white/90' : 'text-foreground/80'} drop-shadow`}>
                  <div>{t('hero.web-mobile')}</div>
                  <div>{t('hero.digital-design')}</div>
                  <div>{t('hero.creative-dev')}</div>
                </div>
              </div>
              
              <div className="pt-8">
                <Button 
                  className={`${hasImageBackground ? 'bg-white text-black hover:bg-white/90' : 'bg-foreground text-background hover:bg-foreground/90'} px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300 shadow-lg`}
                  onClick={scrollToPartners}
                >
                  {t('hero.view-work')}
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
            <span className="text-xs font-medium tracking-wide uppercase">{t('hero.explore')}</span>
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
