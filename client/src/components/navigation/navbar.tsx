import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { gsap } from '@/lib/gsap';
import { useLanguage } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/ui/language-switcher';

const getNavItems = (t: (key: string) => string) => [
  { href: '#about', label: t('nav.who-we-are') },
  { href: '#partners', label: t('nav.partners') },
  { href: '#services', label: t('nav.our-work') },
  { href: '#technology', label: t('nav.technology') },
];

interface NavbarProps {
  show?: boolean;
}

export function Navbar({ show = true }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();
  
  const navItems = getNavItems(t);

  const scrollToHash = useCallback((hash: string) => {
    if (!hash) return;
    const normalized = hash.startsWith('#') ? hash : `#${hash}`;
    
    const performScroll = () => {
      const target = document.querySelector<HTMLElement>(normalized);
      if (!target) {
        return false;
      }

      // Calculate scroll position accounting for fixed navbar
      const rect = target.getBoundingClientRect();
      const offset = window.scrollY + rect.top - 96;
      window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
      return true;
    };

    // Try to scroll immediately
    if (performScroll()) return;

    // Retry with increasing delays for production environments
    // This handles cases where DOM hydration takes longer
    const retries = [100, 300, 500, 1000];
    
    retries.forEach((delay, index) => {
      setTimeout(() => {
        if (performScroll()) return;
        
        // Last retry - log warning if still failed
        if (index === retries.length - 1) {
          console.warn(`Target element not found after retries: ${normalized}`);
        }
      }, delay);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger glass effect when scrolled past hero section (roughly viewport height)
      setIsScrolled(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.to('.navbar', {
      backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(16px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
      duration: 0.4,
    });
  }, [isScrolled]);

  if (!show) return null;

  return (
    <nav className="navbar fixed top-0 w-full transition-all duration-300" style={{ zIndex: 99998 }}>
      <div className="container-fluid py-6">
        <div className="flex justify-between items-center">
          {/* Left side - WA text */}
          <a 
            href="#home"
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 text-white hover:text-accent transition-colors duration-300 drop-shadow-lg"
            onClick={(event) => {
              event.preventDefault();
              setIsOpen(false);
              window.history.replaceState(null, '', '#home');
              requestAnimationFrame(() => {
                scrollToHash('#home');
              });
            }}
          >
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
          </a>
          
          {/* Center - Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12 ml-auto mr-16">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  setIsOpen(false);
                  window.history.replaceState(null, '', item.href);
                  // Small delay to ensure state updates are processed
                  requestAnimationFrame(() => {
                    scrollToHash(item.href);
                  });
                }}
                className="text-sm font-medium tracking-wide text-white/90 hover:text-white transition-colors duration-300 uppercase drop-shadow-md"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right side - Language Switcher & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher variant="ghost" />
            
            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 text-white/90 hover:text-white transition-colors duration-300 drop-shadow-md relative"
              style={{ zIndex: 100000 }}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-xl"
            style={{ 
              zIndex: 99999,
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col justify-center items-center space-y-12 p-8 w-full h-full">
              {/* Menu items - centered content */}
              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="space-y-8 text-center">
                {navItems.map((item, index) => (
                  <div key={item.href} className="overflow-hidden">
                    <a
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault();
                        setIsOpen(false);
                        window.history.replaceState(null, '', item.href);
                        // Wait for mobile menu to close before scrolling
                        setTimeout(() => {
                          scrollToHash(item.href);
                        }, 100);
                      }}
                      className="group block text-4xl font-extralight tracking-[0.1em] text-white/90 hover:text-white transition-all duration-500 uppercase"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'slideUp 0.6s ease-out forwards'
                      }}
                    >
                      <span className="block group-hover:transform group-hover:scale-105 transition-transform duration-300">
                        {item.label}
                      </span>
                      <div className="w-0 h-px bg-brand-orange mt-2 mx-auto group-hover:w-full transition-all duration-500"></div>
                    </a>
                  </div>
                ))}
                </div>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-xs font-light text-white/50 tracking-[0.2em] uppercase">
                  {t('nav.web-architects')}
                </div>
                <div className="w-8 h-px bg-white/30 mx-auto mt-2"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
