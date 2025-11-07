import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navigation/navbar';
import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { About } from '@/components/sections/about';
import { Technology } from '@/components/sections/technology';
import { Partners } from '@/components/sections/partners';
import { Contact } from '@/components/sections/contact';
import { Footer } from '@/components/navigation/footer';
import { useScrollTrigger } from '@/hooks/use-gsap';
import { useSectionTitle } from '@/hooks/use-section-title';

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(true);
  useScrollTrigger();
  useSectionTitle();

  useEffect(() => {
    const scrollToHash = () => {
      const { hash } = window.location;
      if (!hash) return;
      
      const performScroll = () => {
        const target = document.querySelector<HTMLElement>(hash);
        if (!target) {
          return false;
        }

        // Calculate scroll position accounting for fixed navbar
        const rect = target.getBoundingClientRect();
        const offset = window.scrollY + rect.top - 96;
        window.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
        return true;
      };

      // Try to scroll immediately
      if (performScroll()) return;

      // Retry with increasing delays for production environments
      // This handles cases where DOM hydration takes longer
      const retries = [100, 300, 500, 1000, 1500];
      
      retries.forEach((delay, index) => {
        setTimeout(() => {
          if (performScroll()) return;
          
          // Last retry - log warning if still failed
          if (index === retries.length - 1) {
            console.warn(`Target element not found after retries: ${hash}`);
          }
        }, delay);
      });
    };

    if (window.location.hash) {
      // Delay to ensure hydration complete, especially in production
      setTimeout(scrollToHash, 200);
    }

    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden smooth-edges">
      <Navbar show={showNavbar} />
      <main>
        <Hero onAnimationComplete={() => {
          console.log('Hero animation completed, showing navbar');
          setShowNavbar(true);
        }} />
        <About />
        <Partners />
        <Services />
        <Technology />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
