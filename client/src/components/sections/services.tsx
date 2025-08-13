import { ArrowRight, Monitor, Code, Zap, BarChart3, Smartphone, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGSAP } from '@/hooks/use-gsap';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const services = [
  {
    icon: Monitor,
    title: 'Web Design',
    description: 'Custom, responsive designs that reflect your brand identity and provide exceptional user experiences across all devices.',
    gradient: 'from-primary to-primary/80',
  },
  {
    icon: Code,
    title: 'Development',
    description: 'Modern, performant websites built with cutting-edge technologies and optimized for speed, SEO, and accessibility.',
    gradient: 'from-accent to-accent/80',
  },
  {
    icon: Zap,
    title: 'Interactive Experiences',
    description: 'Engaging animations, 3D elements, and interactive features that captivate users and create memorable experiences.',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Optimization',
    description: 'Data-driven insights and continuous optimization to ensure your website performs at its best and drives conversions.',
    gradient: 'from-green-500 to-green-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Responsive designs that look and perform beautifully on every device, ensuring optimal user experience everywhere.',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Package,
    title: 'Brand Integration',
    description: 'Seamless integration of your brand identity into every aspect of your digital presence for consistent, memorable experiences.',
    gradient: 'from-yellow-500 to-orange-500',
  },
];

export function Services() {
  const containerRef = useGSAP(() => {
    gsap.from('.services-title', {
      duration: 1,
      y: 100,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.services-title',
        start: "top 80%"
      }
    });

    gsap.from('.services-subtitle', {
      duration: 0.8,
      y: 50,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.services-subtitle',
        start: "top 80%"
      }
    });

    gsap.from('.service-card', {
      duration: 0.6,
      y: 80,
      opacity: 0,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.services-grid',
        start: "top 80%"
      }
    });
  });

  return (
    <section id="services" className="py-24 bg-white" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="services-title text-4xl lg:text-6xl font-bold text-gradient mb-6">
            Our Expertise
          </h2>
          <p className="services-subtitle text-xl text-gray-600 max-w-3xl mx-auto">
            From concept to deployment, we create digital experiences that drive results
          </p>
        </div>

        <div className="services-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.title}
                className="service-card group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-primary/20"
              >
                <CardContent className="p-0">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <div className="flex items-center text-primary font-semibold group-hover:text-accent transition-colors duration-300">
                    Learn More 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
