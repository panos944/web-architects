import { Star } from 'lucide-react';
import { useGSAP } from '@/hooks/use-gsap';
import { gsap } from '@/lib/gsap';

const techStack = [
  { name: 'React', description: 'React, Next.js, Vue.js, and more' },
  { name: 'GSAP', description: 'GSAP, Framer Motion, Three.js' },
  { name: 'Next.js', description: 'Advanced caching, CDN, and compression' },
];

export function Technology() {
  const containerRef = useGSAP(() => {
    gsap.from('.tech-content', {
      duration: 1,
      x: -100,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.tech-content',
        start: "top 80%"
      }
    });

    gsap.from('.tech-visual', {
      duration: 1,
      x: 100,
      opacity: 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: '.tech-visual',
        start: "top 80%"
      }
    });
  });

  return (
    <section className="py-24 bg-cream/20" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="tech-content">
            <h2 className="text-4xl lg:text-5xl font-bold text-gradient mb-8">
              Cutting-Edge Technology
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We use the latest technologies and frameworks to build websites that are not just beautiful, 
              but also fast, secure, and scalable. From React and Next.js to advanced animation libraries, 
              we're always at the forefront of web development.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark">Modern Frameworks</h3>
                  <p className="text-gray-600">React, Next.js, Vue.js, and more</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark">Animation Libraries</h3>
                  <p className="text-gray-600">GSAP, Framer Motion, Three.js</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark">Performance Optimization</h3>
                  <p className="text-gray-600">Advanced caching, CDN, and compression</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="tech-visual relative">
            <img 
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Modern technology devices" 
              className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500" 
            />
            
            {/* Floating tech badges */}
            <div className="absolute -top-4 left-8 bg-white rounded-xl p-3 shadow-lg animate-pulse-slow">
              <div className="text-sm font-semibold text-primary">React</div>
            </div>
            <div className="absolute top-1/2 -right-4 bg-accent text-white rounded-xl p-3 shadow-lg animate-pulse-slow" style={{ animationDelay: '1s' }}>
              <div className="text-sm font-semibold">GSAP</div>
            </div>
            <div className="absolute -bottom-4 left-1/3 bg-primary text-white rounded-xl p-3 shadow-lg animate-pulse-slow" style={{ animationDelay: '2s' }}>
              <div className="text-sm font-semibold">Next.js</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
