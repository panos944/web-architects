import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { gsap } from '@/lib/gsap';
import { DustParticles } from '@/components/ui/dust-particles';
import { useLanguage } from '@/lib/i18n';

export function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useLanguage();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  return (
    <section
      id="home"
      className="hero-section min-h-screen relative overflow-hidden"
      style={{ zIndex: 50 }}
    >
      {/* Background - Static image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(/desert.png)',
            backgroundPosition: '75% center'
          }}
        />
        {/* Subtle overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Floating dust particles */}
      <DustParticles
        className="opacity-60"
        particleCount={isMobile ? 80 : 150}
        intensity="light"
      />

      {/* Main content with asymmetric layout */}
      <div className="container-fluid relative z-30 pt-24 pb-16">
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

              {/* Tagline (Desktop) */}
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

      {/* Subtle section separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent z-50"></div>
    </section>
  );
}
