import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { ConnectedDots } from '@/components/ui/connected-dots';
import { useLanguage } from '@/lib/i18n';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
  const { t } = useLanguage();

  const containerRef = useGSAP(() => {
    gsap.from('.contact-title', {
      duration: 1.5,
      y: 60,
      opacity: 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.contact-title',
        start: "top 85%"
      }
    });

    gsap.from('.contact-info', {
      duration: 1.2,
      y: 40,
      opacity: 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.contact-info',
        start: "top 75%"
      }
    });

    // Parallax effect for background image
    gsap.to('.contact-bg-image', {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  return (
    <section id="contact" className="py-24 bg-card relative overflow-hidden z-10" ref={containerRef}>
      {/* Connected dots background */}
      <ConnectedDots className="opacity-40" dotCount={25} connectionDistance={160} />
      {/* Minimal background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-gradient-to-l from-primary/10 to-transparent"></div>
      </div>
      <div className="container-fluid relative z-10">
        
        {/* Title with experimental layout */}
        <div className="contact-title mb-24">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-6">
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t('contact.number')}</div>
                <div className="space-y-2">
                  <h2 className="text-[clamp(2.5rem,5vw,6rem)] font-extralight leading-[0.9] tracking-tight text-foreground">
                    {t('contact.lets')}
                  </h2>
                  <div className="text-[clamp(2.5rem,5vw,6rem)] font-light leading-[0.9] tracking-tight text-gradient ml-12 -mt-4">
                    {t('contact.connect')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-6">
              <div className="max-w-lg space-y-6">
                <p className="text-base font-light text-foreground/70 leading-relaxed">
                  {t('contact.description')}
                </p>
                <div className="w-24 h-px bg-primary/40"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Direct contact information */}
        <div className="contact-info max-w-5xl">
          <div className="bg-white/95 backdrop-blur-sm border border-border/20 shadow-lg rounded-2xl p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-[1.4fr,1fr,1fr]">
              <a
                href="mailto:hello@web-architects.gr"
                className="group flex flex-col gap-4 border border-border/30 rounded-xl p-6 hover:border-brand-orange/50 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
                    {t('contact.email-label')}
                  </div>
                  <div className="text-lg font-medium text-foreground">hello@web-architects.gr</div>
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {t('contact.email-description')}
                </span>
              </a>

              <a
                href="tel:+306986615255"
                className="group flex flex-col gap-4 border border-border/30 rounded-xl p-6 hover:border-brand-orange/50 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
                    {t('contact.phone-label')}
                  </div>
                  <div className="text-lg font-medium text-foreground">+30 6986615255</div>
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {t('contact.phone-description')}
                </span>
              </a>

              <div className="flex flex-col gap-4 border border-border/30 rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
                    {t('contact.location-label')}
                  </div>
                  <div className="text-lg font-medium text-foreground">{t('contact.location-city')}</div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {t('contact.location-description')}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
