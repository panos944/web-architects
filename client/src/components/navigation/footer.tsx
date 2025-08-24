import { ConnectedDots } from '@/components/ui/connected-dots';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="relative bg-gradient-to-br from-[#263226] via-[#1a251a] to-[#263226] overflow-hidden">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      {/* Connected dots with reduced opacity for subtlety */}
      <ConnectedDots className="opacity-20" dotCount={15} connectionDistance={200} />
      
      <div className="relative z-10 container-fluid py-24">
        {/* Main content */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Brand section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
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
                <div className="text-4xl font-extralight tracking-[0.15em] text-white">
                  {t('footer.web')}
                  <div className="text-3xl font-light text-brand-orange ml-8 -mt-2">
                    {t('footer.architects')}
                  </div>
                </div>
              </div>
              <div className="w-16 h-px bg-brand-orange"></div>
              <p className="text-lg font-light text-white/70 max-w-lg leading-relaxed">
                {t('footer.description')}
              </p>
            </div>
          </div>

          {/* Contact section */}
          <div className="lg:col-span-4 lg:col-start-8 space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-white/60 tracking-[0.2em] uppercase">
                {t('footer.lets-create')}
              </h3>
              
              <div className="space-y-6">
                <a 
                  href="mailto:wwwebarchitects@gmail.com" 
                  className="group flex items-center gap-4 text-white/90 hover:text-white transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors duration-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-light text-white/60">{t('footer.email')}</div>
                    <div className="font-light">wwwebarchitects@gmail.com</div>
                  </div>
                </a>
                
                <div className="group flex items-center gap-4 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors duration-300">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-light text-white/60">{t('footer.phone')}</div>
                    <div className="font-light">+30 6986615255</div>
                  </div>
                </div>
                
                <div className="group flex items-center gap-4 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors duration-300">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-light text-white/60">{t('footer.location')}</div>
                    <div className="font-light">{t('footer.location-city')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elegant divider */}
        <div className="mt-20 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm font-light text-white/50">
              {t('footer.copyright')}
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-xs font-light text-white/40 tracking-wider uppercase">
                {t('footer.designed')}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#263226]/50 to-transparent pointer-events-none"></div>
    </footer>
  );
}
