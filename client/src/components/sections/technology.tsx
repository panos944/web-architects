import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { ImageReveal } from '@/components/ui/image-reveal';
import { ConnectedDots } from '@/components/ui/connected-dots';

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
    const imageContainer = containerRef.current?.querySelector('.approach-video') as HTMLElement;
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

        const mediaElement = imageContainer.querySelector('video') || imageContainer.querySelector('img');
        if (mediaElement) {
          gsap.to(mediaElement, {
            duration: 0.3,
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            ease: "power2.out"
          });
        }
      };

      const handleMouseLeave = () => {
        const mediaElement = imageContainer.querySelector('video') || imageContainer.querySelector('img');
        if (mediaElement) {
          gsap.to(mediaElement, {
            duration: 0.5,
            rotationX: 0,
            rotationY: 0,
            ease: "power2.out"
          });
        }
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
    <section id="approach" className="py-24 bg-background relative z-10" ref={containerRef}>
      {/* Connected dots background */}
      <ConnectedDots className="opacity-50" dotCount={30} connectionDistance={170} />
      <div className="container-fluid">
        
        {/* Section Header */}
        <div className="approach-title mb-24">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">04</div>
                <div className="space-y-2">
                  <div className="text-[clamp(2rem,4vw,4rem)] font-extralight leading-[0.9] tracking-tight text-foreground">
                    OUR
                  </div>
                  <div className="text-[clamp(2rem,4vw,4rem)] font-light leading-[0.9] tracking-tight text-gradient ml-8">
                    APPROACH
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <div className="max-w-2xl space-y-6">
                <div className="space-y-4">
                  <p className="text-lg font-light text-foreground/70 leading-relaxed">
                    Exceptional results are born from the intersection of 
                    strategic thinking, creative vision, and technical precision.
                  </p>
                  <div className="w-24 h-px bg-brand-orange"></div>
                  <p className="text-lg font-light text-foreground/70 leading-relaxed">
                    <strong>Every pixel counts.</strong>
                  </p>
                </div>
              </div>
            </div>
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
                 Every project begins with understanding—your goals, your users, and your challenges. 
                 From this foundation, we create work that is purposeful, refined, and built to last.
                </p>
                <p>
                  As in everything we do, our approach reflects the same precision, clarity, and commitment that define who we are. 
                  We stay involved beyond launch, ensuring your platform continues to evolve, adapt, and perform in a changing digital landscape.
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

          {/* Large video */}
          <div className="lg:col-span-3 relative">
            <div className="approach-video w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden group cursor-magnetic relative">
              <video
                src="/corals.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent group-hover:from-background/20 transition-all duration-700"></div>
              
              {/* Interactive overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"></div>
              </div>
            </div>
            
            {/* Floating accent elements */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full floating-element"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full floating-element" style={{ animationDelay: '2s' }}></div>
          </div>

        </div>
      </div>
      
      {/* Subtle section separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </section>
  );
}
