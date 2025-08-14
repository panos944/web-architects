import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { gsap } from '@/lib/gsap';

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#experience', label: 'Experience' },
  { href: '#approach', label: 'Approach' },
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
    const element = document.querySelector(href);
    if (element) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: element,
        ease: "power2.inOut"
      });
    }
  };

  if (!show) return null;

  return (
    <nav className="navbar fixed top-0 w-full z-[100] transition-all duration-300">
      <div className="container-fluid py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('#home')}
            className="text-xl font-medium tracking-wider text-white hover:text-accent transition-colors duration-300 drop-shadow-lg"
          >
            WA
          </button>
          
          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white/90 hover:text-white transition-colors duration-300 drop-shadow-md"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-8 pb-6 bg-black/20 backdrop-blur-md rounded-lg border border-white/10">
            <div className="flex flex-col space-y-6 p-6">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-left text-sm font-medium tracking-wide text-white/90 hover:text-white transition-colors duration-300 uppercase drop-shadow-md"
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
