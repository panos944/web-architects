import { Navbar } from '@/components/navigation/navbar';
import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { Technology } from '@/components/sections/technology';
import { Contact } from '@/components/sections/contact';
import { Footer } from '@/components/navigation/footer';
import { useScrollTrigger } from '@/hooks/use-gsap';

export default function Home() {
  useScrollTrigger();

  return (
    <div className="min-h-screen overflow-x-hidden smooth-edges">
      <Navbar />
      <Hero />
      <Services />
      <Technology />
      <Contact />
      <Footer />
    </div>
  );
}
