import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { useEffect, useRef } from 'react';
import { ConnectedDots } from '@/components/ui/connected-dots';

const values = [
  {
    number: '01',
    title: 'Strategy & Vision',
    description: 'We start with a deep understanding of your business objectives, translating them into digital strategies that accelerate growth and strengthen brand presence.',
  },
  {
    number: '02',
    title: 'Design Excellence',
    description: 'We design intuitive, visually striking interfaces that connect with your audience and redefine the standards of modern web design.',
  },
  {
    number: '03',
    title: 'Technical Mastery',
    description: 'From responsive frontends to scalable backends, we apply the latest technologies to deliver secure, high-performance digital platforms tailored to your needs.',
  },
];

export function About() {
  const projectsRef = useRef<HTMLDivElement>(null);
  const satisfactionRef = useRef<HTMLDivElement>(null);

  const containerRef = useGSAP(() => {
    gsap.from('.about-title', {
      duration: 1,
      y: 100,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.about-title',
        start: "top 80%"
      }
    });

    gsap.from('.about-content', {
      duration: 1,
      x: -100,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.about-content',
        start: "top 80%"
      }
    });

    gsap.from('.about-visual', {
      duration: 1,
      x: 100,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.about-visual',
        start: "top 80%"
      }
    });

    gsap.from('.value-card', {
      duration: 0.8,
      y: 80,
      opacity: 0,
      ease: "power3.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.values-grid',
        start: "top 80%"
      }
    });
  });

  // Counter animations
  useEffect(() => {
    const animateCounter = (element: HTMLElement | null, target: number) => {
      if (!element) return;
      
      gsap.to(element, {
        duration: 2,
        textContent: target,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: element,
          start: "top 80%"
        }
      });
    };

    animateCounter(projectsRef.current, 50);
    animateCounter(satisfactionRef.current, 98);
  }, []);

  return (
    <section id="about" className="py-24 bg-card relative z-10" ref={containerRef}>
      {/* Connected dots background */}
      <ConnectedDots className="opacity-40" dotCount={25} connectionDistance={160} />
      <div className="container-fluid">
        
        {/* Section Header */}
        <div className="about-header mb-24">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">02</div>
                <div className="space-y-2">
                  <div className="text-[clamp(2rem,4vw,4rem)] font-extralight leading-[0.9] tracking-tight text-foreground">
                    WHO
                  </div>
                  <div className="text-[clamp(2rem,4vw,4rem)] font-light leading-[0.9] tracking-tight text-gradient ml-8">
                    WE ARE
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <div className="max-w-2xl space-y-6">
                <div className="space-y-4">
                  <p className="text-lg font-light text-foreground/70 leading-relaxed">
                    At <strong>Web Architects</strong>, we craft digital products where design precision meets technical excellence.
                  </p>
                  <div className="w-24 h-px bg-brand-orange"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-32">
          <div className="about-content space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-light text-foreground leading-tight">
                Building With Purpose
              </h3>
              <p className="text-base font-light text-foreground/60 leading-relaxed">
                Rooted in the principle that form and function are inseparable, 
                we treat each project as a unique opportunity to solve complex challenges with clarity and innovation.
              </p>
              <p className="text-base font-light text-foreground/60 leading-relaxed">
                  By merging strategic insight with advanced engineering, we ensure every application we create is visually distinctive, 
                  technically robust, and optimized to perform flawlessly across devices and platforms.
              </p>
            </div>
            
            {/* <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <div ref={projectsRef} className="text-3xl font-light text-foreground">0</div>
                <div className="text-sm font-light text-muted-foreground uppercase tracking-wide">Projects Completed</div>
              </div>
              <div className="space-y-2">
                <div ref={satisfactionRef} className="text-3xl font-light text-foreground">0</div>
                <div className="text-sm font-light text-muted-foreground uppercase tracking-wide">Client Satisfaction</div>
              </div>
            </div> */}
          </div>
          
          <div className="about-visual">
            <div className="aspect-[4/3] bg-background rounded-2xl overflow-hidden group cursor-pointer">
              <img 
                src="/1e4d8658-af33-4fa4-a8ca-12ad4c7027d0.png" 
                alt="Modern workspace showcasing design process" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-forest/20 via-transparent to-vibrant-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>

        {/* Section divider */}
        <div className="w-full h-px accent-line-orange mb-16"></div>

        {/* Values Section */}
        <div className="values-grid space-y-16">
          {values.map((value, index) => (
            <div key={value.number} className="value-card">
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Number & Title */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{value.number}</div>
                  <h3 className="text-2xl font-light leading-tight text-foreground">
                    {value.title}
                  </h3>
                  <div className="w-16 h-px bg-brand-orange"></div>
                </div>

                {/* Description */}
                <div className="lg:col-span-5 lg:col-start-5">
                  <p className="text-base font-light text-foreground/60 leading-relaxed">
                    {value.description}
                  </p>
                </div>

              </div>
              
              {/* Divider between values */}
              {index < values.length - 1 && (
                <div className="w-full h-px bg-border/30 mt-16"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Subtle section separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </section>
  );
}
