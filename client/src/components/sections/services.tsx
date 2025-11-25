import { useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { ConnectedDots } from '@/components/ui/connected-dots';
import { useLanguage } from '@/lib/i18n';

type VideoSources = {
  mp4: string;
  webm?: string;
  fallback?: string;
};

type ExperienceMediaConfig =
  | { type: 'video'; sources: VideoSources }
  | { type: 'image'; src: string; alt?: string };

interface ExperienceItem {
  number: string;
  title: string;
  description: string;
  media: ExperienceMediaConfig;
}

const getExperiences = (t: (key: string) => string): ExperienceItem[] => [
  {
    number: '1',
    title: t('services.strategy.title'),
    description: t('services.strategy.description'),
    media: {
      type: 'video',
      sources: {
        mp4: '/optimized/videos/Neon_Strategy_Sign_Flashes_On_Off.mp4',
        webm: '/optimized/videos/Neon_Strategy_Sign_Flashes_On_Off.webm'
      }
    }
  },
  {
    number: '2', 
    title: t('services.design.title'),
    description: t('services.design.description'),
    media: {
      type: 'video',
      sources: {
        mp4: '/optimized/videos/pear.mp4',
        webm: '/optimized/videos/pear.webm'
      }
    }
  },
  {
    number: '3',
    title: t('services.development.title'),
    description: t('services.development.description'),
    media: {
      type: 'video',
      sources: {
        mp4: '/optimized/videos/fields.mp4',
        webm: '/optimized/videos/fields.webm'
      }
    }
  }
];

function ExperienceMedia({ media, title }: { media: ExperienceMediaConfig; title: string }) {
  const isVideo = media.type === 'video';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(!isVideo);

  useEffect(() => {
    setShouldLoad(!isVideo);
  }, [isVideo]);

  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    if (!video) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: '600px 0px', threshold: 0.2 });

    observer.observe(video);

    return () => observer.disconnect();
  }, [isVideo]);

  useEffect(() => {
    if (!isVideo || !shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;

    const sourceElements = Array.from(
      video.querySelectorAll<HTMLSourceElement>('source[data-src]')
    );

    let hasUpdatedSources = false;
    for (const source of sourceElements) {
      if (!source.src) {
        const dataSrc = source.dataset.src;
        if (dataSrc) {
          source.src = dataSrc;
          hasUpdatedSources = true;
        }
      }
    }

    if (hasUpdatedSources) {
      video.load();
    }

    let interactionHandler: EventListener | null = null;

    const detachInteractionHandler = () => {
      if (!interactionHandler) return;
      document.removeEventListener('touchstart', interactionHandler);
      document.removeEventListener('click', interactionHandler);
      interactionHandler = null;
    };

    const attachInteractionHandler = () => {
      if (interactionHandler) return;
      interactionHandler = () => {
        video.play().catch(() => undefined);
        detachInteractionHandler();
      };

      document.addEventListener('touchstart', interactionHandler, { once: true });
      document.addEventListener('click', interactionHandler, { once: true });
    };

    const attemptPlay = () => {
      video.play().catch(() => {
        attachInteractionHandler();
      });
    };

    const handleLoadedData = () => attemptPlay();
    const handleCanPlay = () => attemptPlay();

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);

    if (video.readyState >= 3) {
      attemptPlay();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      detachInteractionHandler();
    };
  }, [isVideo, shouldLoad, media]);

  if (isVideo) {
    const sources = media.sources;
    return (
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        autoPlay={shouldLoad}
        className="experience-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
      >
        {sources.webm && (
          <source data-src={sources.webm} type="video/webm" />
        )}
        <source data-src={sources.mp4} type="video/mp4" />
        {sources.fallback && sources.fallback !== sources.mp4 && (
          <source data-src={sources.fallback} />
        )}
      </video>
    );
  }

  return (
    <img
      src={media.src}
      alt={media.alt ?? title.replace(/\n/g, ' ')}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      className="experience-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
    />
  );
}

export function Services() {
  const { t } = useLanguage();
  const experiences = useMemo(() => getExperiences(t), [t]);
  const containerRef = useGSAP(() => {
    // Animate hero image elements
    gsap.from('.hero-accent-line', {
      duration: 1.2,
      scaleX: 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.hero-image-section',
        start: "top 75%"
      }
    });

    gsap.from('.hero-title', {
      duration: 1.5,
      y: 40,
      opacity: 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.hero-image-section',
        start: "top 75%"
      }
    });

    gsap.from('.hero-subtitle', {
      duration: 1.2,
      y: 20,
      opacity: 0,
      ease: "power4.out",
      delay: 0.2,
      scrollTrigger: {
        trigger: '.hero-image-section',
        start: "top 75%"
      }
    });

    // Removed parallax hero image to prevent movement out of container

    // Experience cards stagger
    gsap.from('.experience-item', {
      duration: 1.2,
      y: 100,
      opacity: 0,
      stagger: 0.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.experiences-container',
        start: "top 70%"
      }
    });

    // Hover effects only (removed parallax to prevent images moving out of containers)
    gsap.utils.toArray<HTMLElement>('.experience-image').forEach((image) => {
      // Hover zoom effect
      const imageContainer = image.closest('.image-container') || image.parentElement;
      if (imageContainer) {
        imageContainer.addEventListener('mouseenter', () => {
          gsap.to(image, { scale: 1.05, duration: 0.8, ease: "power2.out" });
        });
        
        imageContainer.addEventListener('mouseleave', () => {
          gsap.to(image, { scale: 1, duration: 0.8, ease: "power2.out" });
        });
      }
    });
  });

  return (
    <>
    {/* Prominent section separator between 02 and 03 */}
    <div className="relative py-24" style={{backgroundColor: 'hsl(210 10% 12%)'}}>
      {/* Gradient overlay for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(0_0%_98%)] via-[hsl(210_10%_12%)] to-[hsl(var(--card))]"></div>
      
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
              {t('partners.nav-next')}
            </div>
            <div className="text-sm text-white/60 font-light tracking-wide">
              {t('partners.nav-text')}
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
    
    <section id="services" className="py-24 relative z-10" ref={containerRef} style={{backgroundColor: '#FFA366'}}>
      {/* Connected dots background */}
      <ConnectedDots className="opacity-40" dotCount={25} connectionDistance={160} />
      <div className="container-fluid">
        
        {/* Section Header with experimental layout */}
        <div className="hero-image-section mb-24">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-[0.2em]" style={{color: '#263226'}}>{t('services.number')}</div>
                <div className="space-y-2">
                  <div className="text-[clamp(2rem,4vw,4rem)] font-extralight leading-[0.9] tracking-tight" style={{color: '#263226'}}>
                    {t('services.our')}
                  </div>
                  <div className="text-[clamp(2rem,4vw,4rem)] font-light leading-[0.9] tracking-tight ml-8" style={{color: '#263226'}}>
                    {t('services.work')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <div className="max-w-2xl space-y-6">
                <p className="text-lg font-light leading-relaxed" style={{color: '#263226'}}>
                  {t('services.description')}
                </p>
                <div className="w-24 h-px" style={{backgroundColor: '#263226'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section divider between header and service items */}
        <div className="w-full h-px accent-line-orange mb-16"></div>

        {/* Service Items */}
        <div className="experiences-container space-y-16">
          {experiences.map((item, index) => (
            <div key={item.number} className="experience-item relative">
              {/* Add extra ConnectedDots for Interface Design and Development Excellence */}
              {(item.title === 'Interface Design' || item.title === 'Development Excellence') && (
                <ConnectedDots className="opacity-30" dotCount={15} connectionDistance={120} />
              )}
              <div className={`grid lg:grid-cols-2 items-start ${index % 2 === 1 ? 'gap-32 lg:grid-flow-col-dense' : 'gap-16'}`}>
                
                {/* Content */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="space-y-6">
                    <div className="text-xs uppercase tracking-[0.3em] font-medium" style={{color: '#263226'}}>{item.number}</div>
                    <h3 className="text-4xl md:text-5xl font-light leading-[0.9]" style={{color: '#263226'}}>
                      {item.title.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </h3>
                    <div className="w-16 h-px" style={{backgroundColor: '#263226'}}></div>
                  </div>
                  
                  <div className="text-base font-light leading-relaxed max-w-lg space-y-4" style={{color: '#263226'}}>
                    {item.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Large Image/Video */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="aspect-[4/5] lg:aspect-[4/5] bg-card rounded-2xl overflow-hidden group shadow-lg">
                    <ExperienceMedia media={item.media} title={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-forest/30 via-transparent to-vibrant-orange/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  </div>
                  
                  {/* Floating accent element */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-vibrant-orange/20 to-dark-forest/20 rounded-full blur-xl"></div>
                </div>

              </div>
              
              {/* Section divider */}
              {index < experiences.length - 1 && (
                <div className="w-full h-px accent-line-orange mt-16"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
    </section>
    
    {/* Prominent section separator between 02 and 03 */}
    <div className="relative py-24" style={{backgroundColor: 'hsl(210 10% 12%)'}}>
      {/* Gradient overlay for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--card))] via-[hsl(210_10%_12%)] to-[hsl(var(--background))]"></div>
      
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
              {t('services.nav-next')}
            </div>
            <div className="text-sm text-white/60 font-light tracking-wide">
              {t('services.nav-text')}
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
