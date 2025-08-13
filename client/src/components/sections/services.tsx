import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';

const experiences = [
  {
    number: '01',
    title: 'Digital Strategy',
    description: 'We craft comprehensive digital strategies that align with your business objectives and user needs.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800'
  },
  {
    number: '02', 
    title: 'Interface Design',
    description: 'Creating intuitive, beautiful interfaces that enhance user experience and drive engagement.',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800'
  },
  {
    number: '03',
    title: 'Development Excellence',  
    description: 'Building robust, scalable solutions using cutting-edge technologies and best practices.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800'
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

    // Parallax images
    gsap.utils.toArray('.experience-image').forEach((image: any) => {
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
                  <div className="relative overflow-hidden rounded-2xl">
                    <img 
                      src={item.image}
                      alt={item.title}
                      className="experience-image w-full h-96 lg:h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
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
