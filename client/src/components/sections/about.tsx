import { CheckCircle, Zap, Users } from 'lucide-react';
import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';
import { useEffect, useRef } from 'react';

const values = [
  {
    icon: CheckCircle,
    title: 'Quality First',
    description: 'We never compromise on quality. Every pixel, every line of code, every interaction is crafted with precision and care.',
    gradient: 'from-primary to-primary/80',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We stay ahead of the curve, constantly exploring new technologies and design trends to bring fresh ideas to every project.',
    gradient: 'from-accent to-accent/80',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Great results come from great partnerships. We work closely with our clients to understand their vision and bring it to life.',
    gradient: 'from-purple-500 to-purple-600',
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
    <section id="about" className="py-24 bg-white" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="about-title text-4xl lg:text-6xl font-bold text-gradient mb-6">
            Who We Are
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're a team of passionate designers and developers who believe great design has the power to transform businesses
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="about-content">
            <h3 className="text-3xl font-bold mb-6 text-dark">Building the Future of Web</h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Web Architects was founded with a simple mission: to create digital experiences that don't just look beautiful, 
              but also drive real business results. We combine creative design with technical excellence to deliver websites 
              that stand out in today's competitive digital landscape.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Our approach is collaborative, data-driven, and always focused on the end user. We believe that great design 
              should be accessible, performant, and purposeful.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div ref={projectsRef} className="text-4xl font-bold text-primary mb-2">0</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div ref={satisfactionRef} className="text-4xl font-bold text-primary mb-2">0</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
            </div>
          </div>
          
          <div className="about-visual relative">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Elegant office space" 
              className="rounded-2xl shadow-2xl w-full h-auto" 
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="values-grid grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="value-card text-center group">
                <div className={`w-20 h-20 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-dark">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
