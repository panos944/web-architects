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
          console.warn(`Target element not found: ${hash}`);
          return false;
        }

        const rect = target.getBoundingClientRect();
        const offset = window.scrollY + rect.top - 96;
        window.scrollTo({ top: offset, behavior: 'smooth' });
        return true;
      };

      // Try to scroll immediately
      if (performScroll()) return;

      // If the element wasn't found, retry after a short delay
      setTimeout(() => {
        if (performScroll()) return;
        // Final retry after a longer delay
        setTimeout(performScroll, 200);
      }, 50);
    };

    if (window.location.hash) {
      // Delay to ensure hydration complete
      setTimeout(scrollToHash, 100);
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
        <Services />
        <Technology />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
