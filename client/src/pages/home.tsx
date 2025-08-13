import { Navbar } from '@/components/navigation/navbar';
import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { Technology } from '@/components/sections/technology';
import { About } from '@/components/sections/about';
import { Contact } from '@/components/sections/contact';
import { Footer } from '@/components/navigation/footer';
import { useScrollTrigger } from '@/hooks/use-gsap';

export default function Home() {
  useScrollTrigger();

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Services />
      <Technology />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
