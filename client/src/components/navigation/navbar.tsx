import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { gsap } from '@/lib/gsap';

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#experience', label: 'Experience' },
  { href: '#approach', label: 'Approach' },
  { href: '#contact', label: 'Contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.to('.navbar', {
      backgroundColor: isScrolled ? 'rgba(12, 12, 12, 0.95)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(20px)' : 'none',
      duration: 0.4,
    });
  }, [isScrolled]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: element,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <nav className="navbar fixed top-0 w-full z-50 transition-all duration-300">
      <div className="container-fluid py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('#home')}
            className="text-xl font-light tracking-wider hover:text-accent transition-colors duration-300"
          >
            WA
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-light tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300 uppercase"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-8 pb-6 glass-effect rounded-lg border">
            <div className="flex flex-col space-y-6 p-6">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-left text-sm font-light tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300 uppercase"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
