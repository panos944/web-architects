import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { ImageReveal } from '@/components/ui/image-reveal';

const experiences = [
  {
    number: '01',
    title: 'Digital Strategy',
    description: 'We craft comprehensive digital strategies that align with your business objectives and user needs.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=900'
  },
  {
    number: '02', 
    title: 'Interface Design',
    description: 'Creating intuitive, beautiful interfaces that enhance user experience and drive engagement.',
    image: 'https://images.unsplash.com/photo-1511818966892-d612672a6671?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=900'
  },
  {
    number: '03',
    title: 'Development Excellence',  
    description: 'Building robust, scalable solutions using cutting-edge technologies and best practices.',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&h=900'
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

    // Parallax hero image
    gsap.to('.hero-experience-image', {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: '.hero-image-section',
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

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

    // Parallax images with hover effects
    gsap.utils.toArray('.experience-image').forEach((image: any, index) => {
      gsap.to(image, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: image,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Hover zoom effect
      const imageContainer = image.closest('.image-container');
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
    <section id="experience" className="section-padding bg-background" ref={containerRef}>
      <div className="container-fluid">
        
        {/* Hero Image Section */}
        <div className="hero-image-section mb-32">
          <div className="relative rounded-3xl overflow-hidden">
            <ImageReveal
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1000"
              alt="Modern architectural design workspace"
              className="hero-experience-image w-full h-[500px] lg:h-[600px] object-cover"
              containerClassName="image-container cursor-magnetic"
              overlayContent={
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-12 left-12 right-12 text-center">
                    <div className="w-16 h-px bg-accent mb-6 mx-auto hero-accent-line"></div>
                    <h2 className="text-5xl lg:text-7xl font-thin tracking-tight text-white mb-6 hero-title">
                      Our Experience
                    </h2>
                    <p className="text-lg lg:text-xl font-light text-white/90 max-w-2xl mx-auto leading-relaxed hero-subtitle">
                      Crafting digital experiences that inspire, engage, and deliver exceptional results
                    </p>
                  </div>
                </>
              }
            />
          </div>
        </div>

        {/* Experiences */}
        <div className="experiences-container space-y-32">
          {experiences.map((item, index) => (
            <div key={item.number} className="experience-item">
              <div className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                
                {/* Content */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="space-y-4">
                    <div className="text-6xl font-extralight text-primary/30">{item.number}</div>
                    <h3 className="text-4xl md:text-5xl font-light leading-tight">
                      {item.title}
                    </h3>
                    <div className="w-12 h-px bg-accent"></div>
                  </div>
                  
                  <p className="text-xl font-light text-muted-foreground leading-relaxed max-w-lg">
                    {item.description}
                  </p>
                </div>

                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <ImageReveal
                    src={item.image}
                    alt={item.title}
                    className="experience-image w-full h-96 lg:h-[500px] object-cover"
                    containerClassName="image-container cursor-magnetic rounded-2xl"
                    overlayContent={
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 group-hover:from-black/20 transition-all duration-700"></div>
                        
                        {/* Animated overlay on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="w-12 h-px bg-accent mb-4 transform -translate-x-12 group-hover:translate-x-0 transition-transform duration-700 delay-200"></div>
                            <div className="text-white/90 text-sm font-light tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
                              View Details
                            </div>
                          </div>
                        </div>
                      </>
                    }
                  />
                  
                  {/* Floating accent */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full opacity-20 floating-element"></div>
                </div>

              </div>
              
              {/* Section divider */}
              {index < experiences.length - 1 && (
                <div className="section-divider mt-32"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
