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
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(true);
  const { scrollToHash } = useSmoothScroll();
  useScrollTrigger();
  useSectionTitle();

  useEffect(() => {
    const handleHashScroll = () => {
      const { hash } = window.location;
      if (hash) {
        scrollToHash(hash);
      }
    };

    if (window.location.hash) {
      // Delay to ensure hydration complete, especially in production
      setTimeout(handleHashScroll, 200);
    }

    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, [scrollToHash]);

  return (
    <div className="min-h-screen overflow-x-hidden smooth-edges">
      <Navbar show={showNavbar} />
      <main>
        <Hero onAnimationComplete={() => setShowNavbar(true)} />
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
