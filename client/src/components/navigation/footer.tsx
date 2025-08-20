import { ConnectedDots } from '@/components/ui/connected-dots';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#263226] via-[#1a251a] to-[#263226] overflow-hidden">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      {/* Connected dots with reduced opacity for subtlety */}
      <ConnectedDots className="opacity-20" dotCount={15} connectionDistance={200} />
      
      <div className="relative z-10 container-fluid py-24">
        {/* Main content */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Brand section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <img 
                  src="/wa-mark-rounded.svg" 
                  alt="Web Architects Logo" 
                  className="w-16 h-16 flex-shrink-0"
                />
                <div className="text-4xl font-extralight tracking-[0.15em] text-white">
                  WEB
                  <div className="text-3xl font-light text-brand-orange ml-8 -mt-2">
                    ARCHITECTS
                  </div>
                </div>
              </div>
              <div className="w-16 h-px bg-brand-orange"></div>
              <p className="text-lg font-light text-white/70 max-w-lg leading-relaxed">
                Crafting exceptional digital experiences where precision meets creativity. 
                Every pixel, every interaction, every moment—designed with purpose.
              </p>
            </div>
          </div>

          {/* Contact section */}
          <div className="lg:col-span-4 lg:col-start-8 space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-white/60 tracking-[0.2em] uppercase">
                Let's Create Together
              </h3>
              
              <div className="space-y-6">
                <a 
                  href="mailto:wwwebarchitects@gmail.com" 
                  className="group flex items-center gap-4 text-white/90 hover:text-white transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors duration-300">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-light text-white/60">Email</div>
                    <div className="font-light">wwwebarchitects@gmail.com</div>
                  </div>
                </a>
                
                <div className="group flex items-center gap-4 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors duration-300">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-light text-white/60">Phone</div>
                    <div className="font-light">+30 6986615255</div>
                  </div>
                </div>
                
                <div className="group flex items-center gap-4 text-white/90">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors duration-300">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-light text-white/60">Location</div>
                    <div className="font-light">Athens, Greece</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Elegant divider */}
        <div className="mt-20 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm font-light text-white/50">
              © 2025 Web Architects. All rights reserved.
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-xs font-light text-white/40 tracking-wider uppercase">
                Designed & Developed in Athens
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#263226]/50 to-transparent pointer-events-none"></div>
    </footer>
  );
}
