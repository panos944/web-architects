import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { ImageReveal } from '@/components/ui/image-reveal';

export function Technology() {
  const containerRef = useGSAP(() => {
    // Section title animation  
    gsap.from('.approach-title', {
      duration: 1.5,
      y: 60,
      opacity: 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.approach-title',
        start: "top 85%"
      }
    });

    // Content reveal
    gsap.from('.approach-content', {
      duration: 1.2,
      y: 40,
      opacity: 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.approach-content',
        start: "top 75%"
      }
    });

    // Large image parallax with mouse interaction
    gsap.to('.approach-image', {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Mouse follow effect with cleanup
    const imageContainer = containerRef.current?.querySelector('.image-container') as HTMLElement;
    let mouseHandlers: { move: (e: MouseEvent) => void; leave: () => void } | null = null;
    
    if (imageContainer) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = imageContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = -(x - centerX) / 20;

        gsap.to(imageContainer.querySelector('img'), {
          duration: 0.3,
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(imageContainer.querySelector('img'), {
          duration: 0.5,
          rotationX: 0,
          rotationY: 0,
          ease: "power2.out"
        });
      };

      mouseHandlers = { move: handleMouseMove, leave: handleMouseLeave };
      imageContainer.addEventListener('mousemove', handleMouseMove);
      imageContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    // Cleanup function
    return () => {
      if (imageContainer && mouseHandlers) {
        imageContainer.removeEventListener('mousemove', mouseHandlers.move);
        imageContainer.removeEventListener('mouseleave', mouseHandlers.leave);
      }
    };
  });

  return (
    <section id="approach" className="section-padding bg-card" ref={containerRef}>
      <div className="container-fluid">
        
        {/* Title */}
        <div className="approach-title text-center mb-24">
          <div className="space-y-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto"></div>
            <h2 className="text-5xl md:text-7xl font-extralight tracking-tight">
              <span className="text-muted-foreground">Our</span>
              <br />
              <span className="text-accent">Approach</span>
            </h2>
          </div>
        </div>

        {/* Main content */}
        <div className="approach-content grid lg:grid-cols-5 gap-16 items-start">
          
          {/* Text content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-8">
              <h3 className="text-3xl md:text-4xl font-light leading-tight">
                Thoughtful design meets 
                <span className="text-gradient"> technical excellence</span>
              </h3>
              
              <div className="space-y-6 text-lg font-light text-muted-foreground leading-relaxed">
                <p>
                  We believe exceptional digital experiences are born from the intersection of 
                  strategic thinking, creative vision, and technical precision.
                </p>
                <p>
                  Every project begins with deep understanding—of your goals, your users, 
                  and the challenges you face. From this foundation, we craft solutions 
                  that are both beautiful and purposeful.
                </p>
              </div>
            </div>

            {/* Process highlights */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm font-light tracking-wide text-muted-foreground uppercase">Research & Discovery</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-sm font-light tracking-wide text-muted-foreground uppercase">Design & Prototype</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm font-light tracking-wide text-muted-foreground uppercase">Develop & Deploy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Large image */}
          <div className="lg:col-span-3 relative">
            <ImageReveal
              src="https://images.unsplash.com/photo-1600298881974-6be191ceeda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=900"
              alt="Modern architectural design workspace" 
              className="approach-image w-full h-[600px] lg:h-[700px] object-cover transition-all duration-1000 group-hover:scale-105"
              containerClassName="image-container cursor-magnetic rounded-3xl"
              overlayContent={
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent group-hover:from-background/20 transition-all duration-700"></div>
                  
                  {/* Interactive overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-20 h-20 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="w-0 h-0 border-l-[8px] border-l-white/80 border-y-[6px] border-y-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                </>
              }
            />
            
            {/* Floating accent elements */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full floating-element"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full floating-element" style={{ animationDelay: '2s' }}></div>
          </div>

        </div>
      </div>
    </section>
  );
}
