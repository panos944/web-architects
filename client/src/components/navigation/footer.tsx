export function Footer() {
  return (
    <footer className="section-padding bg-card border-t border-border/30">
      <div className="container-fluid">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
          
          {/* Logo and tagline */}
          <div className="space-y-4">
            <div className="text-2xl font-light tracking-wider">WA</div>
            <p className="text-sm font-light text-muted-foreground max-w-md leading-relaxed">
              Creating digital experiences that transcend the ordinary.
            </p>
          </div>

          {/* Contact info */}
          <div className="space-y-4 text-right">
            <div className="text-sm font-light text-muted-foreground tracking-wide uppercase">
              Ready to start?
            </div>
            <div className="space-y-2">
              <a 
                href="mailto:hello@webarchitects.com" 
                className="text-lg font-light hover:text-primary transition-colors duration-300 block"
              >
                hello@webarchitects.com
              </a>
              <div className="text-sm font-light text-muted-foreground">
                San Francisco, California
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="section-divider my-12"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm font-light text-muted-foreground space-y-4 md:space-y-0">
          <div>
            &copy; 2024 Web Architects. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-foreground transition-colors duration-300">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors duration-300">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
