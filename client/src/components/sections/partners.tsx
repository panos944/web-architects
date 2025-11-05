import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { ConnectedDots } from '@/components/ui/connected-dots';
import { useLanguage } from '@/lib/i18n';

const getPartners = (t: (key: string) => string) => [
  {
    name: "Socialsyn",
    url: "https://www.socialsyn.gr",
    imageUrl: "/Screenshot%202025-10-28%20at%2011.46.33.png",
    description: t('partners.socialsyn.description')
  },
  {
    name: "Rolco",
    url: "https://www.essexactivation.gr",
    imageUrl: "/LOGO_ROLCO_RED.png",
    description: t('partners.rolco.description')
  },
  {
    name: "Instyle",
    url: "https://www.instyle.gr",
    imageUrl: "https://www.instyle.gr/wp-content/uploads/2022/05/Logo_InStyle-1.png",
    description: t('partners.oloygeia.description')
  },
  {
    name: "The Cars",
    url: "https://www.thecars.gr",
    imageUrl: "/optimized/thecars logo.png",
    webp: "/optimized/thecars logo.webp",
    avif: "/optimized/thecars logo.avif",
    description: t('partners.thecars.description')
  },
  {
    name: 'Real Player',
    url: 'https://player.real.gr',
    imageUrl: 'https://player.real.gr/wp-content/uploads/2024/06/Logo-e1718700920635.png',
    description: t('partners.realfm.description')
  },
  {
    name: "Oloygeia.gr",
    url: "https://oloygeia.gr",
    imageUrl: "/optimized/oloygeia.logo.png",
    webp: "/optimized/oloygeia.logo.webp",
    avif: "/optimized/oloygeia.logo.avif",
    description: t('partners.wellness.description')
  }
];

export function Partners() {
  const { t } = useLanguage();
  const partners = getPartners(t);

  const containerRef = useGSAP(() => {
    // Animate section header
    gsap.from('.partners-header', {
      duration: 1.5,
      y: 40,
      opacity: 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.partners-section',
        start: "top 75%"
      }
    });

    gsap.from('.partners-subtitle', {
      duration: 1.2,
      y: 20,
      opacity: 0,
      ease: "power4.out",
      delay: 0.2,
      scrollTrigger: {
        trigger: '.partners-section',
        start: "top 75%"
      }
    });

    // Partner cards stagger animation
    gsap.fromTo('.partner-card', 
      {
        y: 60,
        opacity: 0
      },
      {
        duration: 1.2,
        y: 0,
        opacity: 1,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: '.partners-grid',
          start: "top 80%",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Hover effects for partner cards
    gsap.utils.toArray('.partner-card').forEach((card: any) => {
      const logo = card.querySelector('.partner-logo');
      
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -8, scale: 1.02, duration: 0.4, ease: "power2.out" });
        gsap.to(logo, { scale: 1.1, duration: 0.4, ease: "power2.out" });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
        gsap.to(logo, { scale: 1, duration: 0.4, ease: "power2.out" });
      });
    });
  });

  return (
    <>
      {/* Prominent section separator between 03 and 04 */}
      <div className="relative py-24" style={{backgroundColor: 'hsl(210 10% 12%)'}}>
        {/* Gradient overlay for smooth transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))] via-[hsl(210_10%_12%)] to-[hsl(0_0%_98%)]"></div>
        
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
                {t('partners.nav-prev')}
              </div>
              <div className="text-sm text-white/60 font-light tracking-wide">
                {t('partners.nav-text-prev')}
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
      
      <section id="partners" className="partners-section py-24 relative z-10" ref={containerRef} style={{backgroundColor: 'hsl(0 0% 98%)'}}>
        {/* Connected dots background */}
        <ConnectedDots className="opacity-30" dotCount={20} connectionDistance={140} />
      
      <div className="container-fluid">
        {/* Section Header */}
        <div className="partners-header mb-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="text-xs uppercase tracking-[0.2em] font-medium" style={{color: '#F68238'}}>
              {t('partners.number')}
            </div>
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[0.9] tracking-tight" style={{color: '#263226'}}>
              {t('partners.our')}
              <br/>
              <span className="ml-8">{t('partners.projects')}</span>
            </h2>
            <div className="w-24 h-px mx-auto" style={{backgroundColor: '#F68238'}}></div>
            <p className="partners-subtitle text-lg font-light leading-relaxed max-w-2xl mx-auto" style={{color: '#263226'}}>
              {t('partners.description')}
            </p>
          </div>
        </div>

        {/* Section divider */}
        <div className="w-full h-px accent-line-orange mb-16"></div>

        {/* Partners Grid */}
        <div className="partners-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target={partner.url.startsWith('http') ? "_blank" : "_self"}
              rel={partner.url.startsWith('http') ? "noopener noreferrer" : undefined}
              className="partner-card group relative p-8 transition-all duration-500 cursor-pointer block bg-white/40 backdrop-blur-sm rounded-xl border border-orange-500/20 hover:border-orange-500/40 hover:bg-white/60 hover:shadow-lg hover:shadow-orange-500/5"
            >
              {/* Partner Logo */}
              <div className="flex items-center justify-center h-20 mb-6">
                <div className="partner-logo w-full h-full flex items-center justify-center">
                  <div className={`flex items-center justify-center ${
                    partner.name === 'Real Player' ? 'bg-blue-900 rounded-lg p-3' : ''
                  }`}>
                    <picture className="block max-w-full max-h-full">
                      {partner.avif && <source srcSet={partner.avif} type="image/avif" />}
                      {partner.webp && <source srcSet={partner.webp} type="image/webp" />}
                      <img 
                        src={partner.imageUrl} 
                        alt={`${partner.name} logo`}
                        className={`max-w-full max-h-full object-contain transition-all duration-300 opacity-100 ${
                          partner.name === 'Oloygeia.gr' ? 'mix-blend-multiply' : ''
                        }`}
                        style={{ 
                          maxWidth: partner.name === 'Real Player' ? '120px' : '140px',
                          maxHeight: partner.name === 'Real Player' ? '45px' : '60px',
                          opacity: 1
                        }}
                        loading="lazy"
                        onLoad={() => {
                          console.log(`${partner.name} logo loaded successfully from:`, partner.imageUrl);
                        }}
                        onError={(e) => {
                          console.error(`${partner.name} logo failed to load from:`, partner.imageUrl);
                          const img = e.target as HTMLImageElement;
                          img.style.display = 'none';
                          // Create fallback
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-12 bg-orange-100 rounded flex items-center justify-center text-sm font-medium';
                          fallback.style.color = '#263226';
                          fallback.textContent = partner.name;
                          if (img.parentNode) {
                            img.parentNode.appendChild(fallback);
                          }
                        }}
                      />
                    </picture>
                  </div>
                </div>
              </div>
              
              {/* Partner Name */}
              <h3 className="text-xl font-medium text-center mb-4" style={{color: '#263226'}}>
                {partner.name}
              </h3>
              
              {/* Partner Description */}
              <p className="text-sm font-light leading-relaxed text-center opacity-80" style={{color: '#263226'}}>
                {partner.description}
              </p>
              
              {/* Orange accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-xl"></div>
            </a>
          ))}
        </div>

      </div>
      </section>
      
      {/* Prominent section separator between 04 and 05 */}
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
    </>
  );
}