import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';

export function Hero() {
  const containerRef = useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.hero-title', { duration: 1, y: 100, opacity: 0, ease: "power3.out" })
      .from('.hero-subtitle', { duration: 0.8, y: 50, opacity: 0, ease: "power3.out" }, "-=0.5")
      .from('.hero-buttons', { duration: 0.8, y: 30, opacity: 0, ease: "power3.out" }, "-=0.3")
      .from('.hero-visual', { duration: 1, x: 100, opacity: 0, ease: "power3.out" }, "-=0.8");
  });

  return (
    <section id="home" className="min-h-screen gradient-bg relative overflow-hidden" ref={containerRef}>
      {/* Floating shapes for background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cream/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-cream/15 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <h1 className="hero-title text-5xl lg:text-7xl font-bold leading-tight">
                Crafting Digital 
                <span className="text-cream"> Experiences</span>
                That Inspire
              </h1>
              <p className="hero-subtitle text-xl lg:text-2xl text-white/80 leading-relaxed">
                We're Web Architects - a new generation design agency creating modern, 
                interactive websites that captivate and convert.
              </p>
              <div className="hero-buttons flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg font-semibold custom-shadow transform hover:scale-105 transition-all duration-300"
                >
                  Start Your Project
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="glass-effect bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-4 text-lg font-semibold"
                >
                  View Our Process
                </Button>
              </div>
            </div>
            <div className="hero-visual relative">
              {/* Modern workspace showcase image */}
              <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Modern web design workspace" 
                  className="rounded-2xl shadow-2xl w-full h-auto custom-shadow" 
                />
                
                {/* Floating UI elements overlay */}
                <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Live Site</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-cream rounded-xl p-4 shadow-lg animate-float" style={{ animationDelay: '3s' }}>
                  <div className="text-dark">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm">Performance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
