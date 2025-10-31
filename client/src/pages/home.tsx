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
      const target = document.querySelector(hash);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const offset = window.scrollY + rect.top - 96;
      window.scrollTo({ top: offset, behavior: 'smooth' });
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
