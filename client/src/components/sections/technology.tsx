import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';

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

    // Large image parallax
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
            <div className="relative overflow-hidden rounded-3xl">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=900"
                alt="Modern design workspace" 
                className="approach-image w-full h-[600px] lg:h-[700px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent"></div>
            </div>
            
            {/* Floating accent elements */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full floating-element"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full floating-element" style={{ animationDelay: '2s' }}></div>
          </div>

        </div>
      </div>
    </section>
  );
}
