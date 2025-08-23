import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { ConnectedDots } from '@/components/ui/connected-dots';

const experiences = [
  {
    number: '1',
    title: 'Digital\nStrategy',
    description: 'We develop tailored strategies that act as a clear blueprint for success, ensuring every decision moves you closer to your goals. \n\nFrom in-depth market research to precise performance benchmarks, every phase is designed to maximise clarity, accelerate growth, and adapt to evolving opportunities. \n\nOur approach blends analytical insight with creative foresight, giving you a path that is both strategic and adaptable.',
    image: '/Neon_Strategy_Sign_Flashes_On_Off.mp4'
  },
  {
    number: '2', 
    title: 'Interface\nDesign',
    description: 'We design interfaces that go beyond aesthetics. Every element is purposeful, every transition smooth, and every detail aligned with your brand’s personality.\n\nFrom the first click to the final interaction, our goal is to create intuitive pathways that guide users naturally. \n\nEvery decision is made to reinforce your identity, streamline navigation, and deliver a sense of ease that keeps people engaged and connected.',
    image: '/pear.mp4'
  },
  {
    number: '3',
    title: 'Development\nExcellence',  
    description: 'We engineer platforms with the future in mind, solutions that are not only fast and reliable today but also flexible enough to evolve with your business.\n\nBy combining modern frameworks with time-tested development practices, we create architectures that can handle growth without compromising performance.\n\nEvery build is fortified with robust security measures, optimized for efficiency, and designed to adapt to new technologies, ensuring your product remains relevant and resilient for years to come.',
    image: '/fields.mp4'
  }
];

export function Services() {
  const containerRef = useGSAP(() => {
    // Animate hero image elements
    gsap.from('.hero-accent-line', {
      duration: 1.2,
      scaleX: 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.hero-image-section',
        start: "top 75%"
      }
    });

    gsap.from('.hero-title', {
      duration: 1.5,
      y: 40,
      opacity: 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.hero-image-section',
        start: "top 75%"
      }
    });

    gsap.from('.hero-subtitle', {
      duration: 1.2,
      y: 20,
      opacity: 0,
      ease: "power4.out",
      delay: 0.2,
      scrollTrigger: {
        trigger: '.hero-image-section',
        start: "top 75%"
      }
    });

    // Removed parallax hero image to prevent movement out of container

    // Experience cards stagger
    gsap.from('.experience-item', {
      duration: 1.2,
      y: 100,
      opacity: 0,
      stagger: 0.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.experiences-container',
        start: "top 70%"
      }
    });

    // Hover effects only (removed parallax to prevent images moving out of containers)
    gsap.utils.toArray('.experience-image').forEach((image: any) => {
      // Hover zoom effect
      const imageContainer = image.closest('.image-container') || image.parentElement;
      if (imageContainer) {
        imageContainer.addEventListener('mouseenter', () => {
          gsap.to(image, { scale: 1.05, duration: 0.8, ease: "power2.out" });
        });
        
        imageContainer.addEventListener('mouseleave', () => {
          gsap.to(image, { scale: 1, duration: 0.8, ease: "power2.out" });
        });
      }
    });
  });

  return (
    <>
    <section id="experience" className="py-24 relative z-10" ref={containerRef} style={{backgroundColor: '#FFA366'}}>
      {/* Connected dots background */}
      <ConnectedDots className="opacity-40" dotCount={25} connectionDistance={160} />
      <div className="container-fluid">
        
        {/* Section Header with experimental layout */}
        <div className="hero-image-section mb-24">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-[0.2em]" style={{color: '#263226'}}>02</div>
                <div className="space-y-2">
                  <div className="text-[clamp(2rem,4vw,4rem)] font-extralight leading-[0.9] tracking-tight" style={{color: '#263226'}}>
                    OUR
                  </div>
                  <div className="text-[clamp(2rem,4vw,4rem)] font-light leading-[0.9] tracking-tight ml-8" style={{color: '#263226'}}>
                    WORK
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <div className="max-w-2xl space-y-6">
                <p className="text-lg font-light leading-relaxed" style={{color: '#263226'}}>
                  We believe in creating digital products that are both functionally excellent and emotionally resonant. 
                  Our process combines strategic thinking with creative exploration.
                </p>
                <div className="w-24 h-px" style={{backgroundColor: '#263226'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section divider between header and service items */}
        <div className="w-full h-px accent-line-orange mb-16"></div>

        {/* Service Items */}
        <div className="experiences-container space-y-16">
          {experiences.map((item, index) => (
            <div key={item.number} className="experience-item relative">
              {/* Add extra ConnectedDots for Interface Design and Development Excellence */}
              {(item.title === 'Interface Design' || item.title === 'Development Excellence') && (
                <ConnectedDots className="opacity-30" dotCount={15} connectionDistance={120} />
              )}
              <div className={`grid lg:grid-cols-2 items-start ${index % 2 === 1 ? 'gap-32 lg:grid-flow-col-dense' : 'gap-16'}`}>
                
                {/* Content */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="space-y-6">
                    <div className="text-xs uppercase tracking-[0.3em] font-medium" style={{color: '#263226'}}>{item.number}</div>
                    <h3 className="text-4xl md:text-5xl font-light leading-[0.9]" style={{color: '#263226'}}>
                      {item.title.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </h3>
                    <div className="w-16 h-px" style={{backgroundColor: '#263226'}}></div>
                  </div>
                  
                  <div className="text-base font-light leading-relaxed max-w-lg space-y-4" style={{color: '#263226'}}>
                    {item.description.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Large Image/Video */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="aspect-[4/5] lg:aspect-[4/5] bg-card rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
                    {item.image.endsWith('.mp4') ? (
                      <video
                        key={item.image}
                        src={item.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        webkit-playsinline="true"
                        preload="auto"
                        className="experience-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                        onLoadedData={(e) => {
                          const video = e.target as HTMLVideoElement;
                          video.play().catch(() => {
                            const playOnInteraction = () => {
                              video.play();
                              document.removeEventListener('touchstart', playOnInteraction);
                              document.removeEventListener('click', playOnInteraction);
                            };
                            document.addEventListener('touchstart', playOnInteraction, { once: true });
                            document.addEventListener('click', playOnInteraction, { once: true });
                          });
                        }}
                      />
                    ) : (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="experience-image w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-forest/30 via-transparent to-vibrant-orange/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  </div>
                  
                  {/* Floating accent element */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-vibrant-orange/20 to-dark-forest/20 rounded-full blur-xl"></div>
                </div>

              </div>
              
              {/* Section divider */}
              {index < experiences.length - 1 && (
                <div className="w-full h-px accent-line-orange mt-16"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
    </section>
    
    {/* Prominent section separator between 02 and 03 */}
    <div className="relative py-24" style={{backgroundColor: 'hsl(210 10% 12%)'}}>
      {/* Gradient overlay for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--card))] via-[hsl(210_10%_12%)] to-[hsl(var(--background))]"></div>
      
      {/* Central divider element */}
      <div className="relative z-10 container-fluid">
        <div className="text-center space-y-8">
          {/* Section transition indicator */}
          <div className="flex items-center justify-center space-x-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange-500/60"></div>
            <div className="flex space-x-3">
              <div className="w-2 h-2 rounded-full bg-orange-500/60"></div>
              <div className="w-2 h-2 rounded-full bg-orange-500/40"></div>
              <div className="w-2 h-2 rounded-full bg-orange-500/20"></div>
            </div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange-500/60"></div>
          </div>
          
          {/* Section number transition */}
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.3em] text-orange-500/80 font-light">
              02 → 03
            </div>
            <div className="text-sm text-white/60 font-light tracking-wide">
              Services → Technology
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="flex justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>
      </div>
      
      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-orange-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-500/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-orange-500/40 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
    </>
  );
}
