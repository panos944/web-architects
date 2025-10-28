import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { useEffect, useRef } from 'react';
import { ConnectedDots } from '@/components/ui/connected-dots';
import { useLanguage } from '@/lib/i18n';

const getValues = (t: (key: string) => string) => [
  {
    number: '01',
    title: t('about.value1.title'),
    description: t('about.value1.description'),
  },
  {
    number: '02',
    title: t('about.value2.title'),
    description: t('about.value2.description'),
  },
  {
    number: '03',
    title: t('about.value3.title'),
    description: t('about.value3.description'),
  },
];

export function About() {
  const projectsRef = useRef<HTMLDivElement>(null);
  const satisfactionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  
  const values = getValues(t);

  const containerRef = useGSAP(() => {
    gsap.from('.about-title', {
      duration: 1,
      y: 100,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.about-title',
        start: "top 80%"
      }
    });

    gsap.from('.about-content', {
      duration: 1,
      x: -100,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.about-content',
        start: "top 80%"
      }
    });

    gsap.from('.about-visual', {
      duration: 1,
      x: 100,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.about-visual',
        start: "top 80%"
      }
    });

    gsap.from('.value-card', {
      duration: 0.8,
      y: 80,
      opacity: 0,
      ease: "power3.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.values-grid',
        start: "top 80%"
      }
    });
  });

  // Counter animations
  useEffect(() => {
    const animateCounter = (element: HTMLElement | null, target: number) => {
      if (!element) return;
      
      gsap.to(element, {
        duration: 2,
        textContent: target,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: element,
          start: "top 80%"
        }
      });
    };

    animateCounter(projectsRef.current, 50);
    animateCounter(satisfactionRef.current, 98);
  }, []);

  return (
    <>
    <section id="about" className="py-24 bg-card relative z-10" ref={containerRef}>
      {/* Connected dots background */}
      <ConnectedDots className="opacity-40" dotCount={25} connectionDistance={160} />
      <div className="container-fluid">
        
        {/* Section Header */}
        <div className="about-header mb-24">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t('about.number')}</div>
                <div className="space-y-2">
                  <h2 className="text-[clamp(2rem,4vw,4rem)] font-extralight leading-[0.9] tracking-tight text-foreground">
                    {t('about.who')}
                  </h2>
                  <div className="text-[clamp(2rem,4vw,4rem)] font-light leading-[0.9] tracking-tight text-gradient ml-8">
                    {t('about.we-are')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <div className="max-w-2xl space-y-6">
                <div className="space-y-6">
                  <p className="text-lg font-light text-foreground/70 leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: t('about.intro') }} />
                  </p>
                  <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
                    <div className="flex-1 max-w-[60px] h-px bg-brand-orange"></div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 opacity-80">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 256 256" 
                        className="w-full h-full"
                        role="img" 
                        aria-label={t('footer.logo-alt')}
                      >
                        <circle cx="128" cy="128" r="120" fill="#263226"/>
                        <g fill="none" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M36 70 L64 186 L92 70 L120 186 L148 70"/>
                          <path d="M172 186 L200 70 L228 186"/>
                        </g>
                        <path d="M176 138 L220 138" fill="none" stroke="#F68238" strokeWidth="20" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="flex-1 max-w-[60px] h-px bg-brand-orange"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-32">
          <div className="about-content space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-light text-foreground leading-tight">
                {t('about.building-purpose')}
              </h3>
              <p className="text-base font-light text-foreground/60 leading-relaxed">
                {t('about.description1')}
              </p>
              <p className="text-base font-light text-foreground/60 leading-relaxed">
                  {t('about.description2')}
              </p>
            </div>
          </div>
          
          <div className="about-visual">
            <div className="aspect-[4/3] bg-background rounded-2xl overflow-hidden group">
              <picture className="block h-full w-full">
                <source srcSet="/optimized/1e4d8658-af33-4fa4-a8ca-12ad4c7027d0.avif" type="image/avif" />
                <source srcSet="/optimized/1e4d8658-af33-4fa4-a8ca-12ad4c7027d0.webp" type="image/webp" />
                <img 
                  src="/optimized/1e4d8658-af33-4fa4-a8ca-12ad4c7027d0.png" 
                  alt="Modern workspace showcasing design process" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  loading="lazy"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-dark-forest/20 via-transparent to-vibrant-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>

        {/* Section divider */}
        <div className="w-full h-px accent-line-orange mb-16"></div>

        {/* Values Section */}
        <div className="values-grid space-y-8">
          {values.map((value, index) => (
            <div key={value.number} className="value-card">
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Number & Title */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{value.number}</div>
                  <h3 className="text-2xl font-light leading-tight text-foreground">
                    {value.title}
                  </h3>
                  <div className="w-16 h-px bg-brand-orange"></div>
                </div>

                {/* Description */}
                <div className="lg:col-span-5 lg:col-start-5">
                  <p className="text-base font-light text-foreground/60 leading-relaxed">
                    {value.description}
                  </p>
                </div>

              </div>
              
              {/* Divider between values */}
              {index < values.length - 1 && (
                <div className="w-full h-px bg-border/30 mt-16"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
    </section>
    
    {/* Prominent section separator between 01 and 02 */}
    <div className="relative py-24" style={{backgroundColor: 'hsl(210 10% 12%)'}}>
      {/* Gradient overlay for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--card))] via-[hsl(210_10%_12%)] to-[hsl(var(--card))]"></div>
      
      {/* Central divider element */}
      <div className="relative z-10 container-fluid">
        <div className="text-center space-y-8">
          {/* Section transition indicator */}
          <div className="flex items-center justify-center space-x-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange-500/60"></div>
            <div className="flex space-x-3">
              <div className="w-2 h-2 rounded-full bg-orange-500/60"></div>
              <div className="w-2 h-2 rounded-full bg-orange-500/40"></div>
              <div className="w-2 h-2 rounded-full bg-orange-500/20"></div>
            </div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange-500/60"></div>
          </div>
          
          {/* Section number transition */}
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.3em] text-orange-500/80 font-light">
              {t('about.nav-next')}
            </div>
            <div className="text-sm text-white/60 font-light tracking-wide">
              {t('about.nav-text')}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="flex justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-orange-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-500/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-orange-500/40 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
    </>
  );
}
