import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const containerRef = useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.hero-content', { duration: 2, y: 60, opacity: 0, ease: "power4.out", delay: 0.5 })
      .from('.scroll-indicator', { duration: 1.5, y: 20, opacity: 0, ease: "power3.out" }, "-=0.8")
      .from('.floating-elements > *', { 
        duration: 3, 
        y: 80, 
        opacity: 0, 
        stagger: 0.3,
        ease: "power4.out"
      }, "-=1.5");

    // Parallax scroll effect for background image
    gsap.to('.background-image img', {
      yPercent: -30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to('.background-elements', {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  const scrollToNext = () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: window.innerHeight, autoKill: false },
      ease: "power2.inOut"
    });
  };

  return (
    <section id="home" className="h-screen relative overflow-hidden flex items-center justify-center" ref={containerRef}>
      {/* Background image with parallax */}
      <div className="background-image absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1333"
          alt="Modern architectural structure"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/80"></div>
      </div>
      
      {/* Subtle background elements */}
      <div className="background-elements absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl floating-element"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl floating-element" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Main content */}
      <div className="container-fluid relative z-10">
        <div className="flex flex-col items-center text-center max-w-6xl mx-auto">
          <div className="hero-content space-y-8">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extralight leading-[0.9] tracking-tight">
              <span className="block">Web</span>
              <span className="block text-gradient font-light">Architects</span>
            </h1>
            
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent mx-auto"></div>
            
            <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-2xl leading-relaxed">
              Creating digital experiences that transcend the ordinary
            </p>
            
            <div className="pt-8">
              <Button 
                className="glass-effect hover:bg-white/10 text-foreground border-0 px-12 py-6 text-lg font-light tracking-wide transition-all duration-500 hover:scale-105"
                onClick={scrollToNext}
              >
                Explore Our Work
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={scrollToNext}
            className="flex flex-col items-center space-y-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <span className="text-sm font-light tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </div>

      {/* Floating minimal elements */}
      <div className="floating-elements absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/60 rounded-full floating-element"></div>
        <div className="absolute top-1/3 right-32 w-1 h-16 bg-accent/40 floating-element" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full floating-element" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-20 bg-foreground/20 floating-element" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
}
