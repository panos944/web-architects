import { Twitter, Linkedin, Instagram, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-3xl font-bold text-gradient mb-4">Web Architects</div>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              Creating digital experiences that inspire and convert. We're here to help your business stand out in the digital world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-300">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-white/70">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Web Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Branding</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Consulting</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-white/70">
              <li>hello@webarchitects.com</li>
              <li>+1 (555) 123-4567</li>
              <li>San Francisco, CA</li>
              <li>Available Mon-Fri 9AM-6PM</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
          <p>&copy; 2024 Web Architects. All rights reserved. Built with passion for great design.</p>
        </div>
      </div>
    </footer>
  );
}
