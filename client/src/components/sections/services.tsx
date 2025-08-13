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
    // Title animation
    gsap.from('.section-title', {
      duration: 1.5,
      y: 60,
      opacity: 0,
      ease: "power4.out",
      scrollTrigger: {
        trigger: '.section-title',
        start: "top 85%"
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
        {/* Section Title */}
        <div className="section-title text-center mb-32">
          <div className="space-y-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
            <h2 className="text-5xl md:text-7xl font-extralight tracking-tight">
              <span className="text-muted-foreground">Our</span>
              <br />
              <span className="text-gradient">Experience</span>
            </h2>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-primary/10 group-hover:from-primary/20 transition-all duration-700"></div>
                        
                        {/* Animated overlay on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="w-12 h-px bg-accent mb-4 transform -translate-x-12 group-hover:translate-x-0 transition-transform duration-700 delay-200"></div>
                            <div className="text-accent text-sm font-light tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
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
