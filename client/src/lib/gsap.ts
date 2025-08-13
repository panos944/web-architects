import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

// Animation helpers
export const fadeInUp = (element: string | Element, delay = 0) => {
  return gsap.fromTo(
    element,
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      delay,
      ease: "power3.out",
    }
  );
};

export const fadeInLeft = (element: string | Element, delay = 0) => {
  return gsap.fromTo(
    element,
    { x: -100, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 1,
      delay,
      ease: "power3.out",
    }
  );
};

export const fadeInRight = (element: string | Element, delay = 0) => {
  return gsap.fromTo(
    element,
    { x: 100, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 1,
      delay,
      ease: "power3.out",
    }
  );
};

export const staggerAnimation = (elements: string, delay = 0.1) => {
  return gsap.fromTo(
    elements,
    { y: 80, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: delay,
      ease: "power3.out",
    }
  );
};
