import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { gsap } from '@/lib/gsap';

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'Who We Are' },
  { href: '#services', label: 'Our Work' },
  { href: '#technology', label: 'Technology' },
  { href: '#partners', label: 'Partners' },
  { href: '#contact', label: 'Contact' },
];

interface NavbarProps {
  show?: boolean;
}

export function Navbar({ show = true }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const targetId = href.slice(1); // Remove the # to get the ID
    const element = document.getElementById(targetId);
    
    if (element) {
      // Calculate position with offset for navbar
      const elementTop = element.offsetTop - 80;
      
      // Smooth scroll to the element
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  };

  if (!show) return null;

  return (
    <nav className="navbar fixed top-0 w-full transition-all duration-300" style={{ zIndex: 99998 }}>
      <div className="container-fluid py-6">
        <div className="flex justify-between items-center">
          {/* Left side - WA text */}
          <button 
            onClick={() => handleNavClick('#home')}
            className="text-xl font-medium tracking-wider text-white hover:text-accent transition-colors duration-300 drop-shadow-lg"
          >
            WA
          </button>
          
          {/* Center - Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium tracking-wide text-white/90 hover:text-white transition-colors duration-300 uppercase drop-shadow-md"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side - Mobile Menu */}
          <button
            className="md:hidden p-2 text-white/90 hover:text-white transition-colors duration-300 drop-shadow-md relative"
            style={{ zIndex: 100000 }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
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
                    <button
                      onClick={() => handleNavClick(item.href)}
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
                    </button>
                  </div>
                ))}
                </div>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-xs font-light text-white/50 tracking-[0.2em] uppercase">
                  Web Architects
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
