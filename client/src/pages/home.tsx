import { useState } from 'react';
import { Navbar } from '@/components/navigation/navbar';
import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { About } from '@/components/sections/about';
import { Technology } from '@/components/sections/technology';
import { Contact } from '@/components/sections/contact';
import { Footer } from '@/components/navigation/footer';
import { MagneticCursor } from '@/components/effects/magnetic-cursor';
import { useScrollTrigger } from '@/hooks/use-gsap';

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(true);
  useScrollTrigger();

  return (
    <div className="min-h-screen overflow-x-hidden smooth-edges">
      <MagneticCursor />
      <Navbar show={showNavbar} />
      <Hero onAnimationComplete={() => {
        console.log('Hero animation completed, showing navbar');
        setShowNavbar(true);
      }} />
      <About />
      <Services />
      <Technology />
      <Contact />
      <Footer />
    </div>
  );
}
