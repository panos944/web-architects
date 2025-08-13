import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export { gsap, ScrollTrigger };

// Enhanced animation helpers for igloo.inc-style interactions
export const revealUp = (element: string | Element, delay = 0) => {
  return gsap.fromTo(
    element,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.2,
      delay,
      ease: "power4.out",
    }
  );
};

export const staggerReveal = (elements: string, delay = 0.1) => {
  return gsap.fromTo(
    elements,
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.2,
      stagger: delay,
      ease: "power4.out",
    }
  );
};

export const parallaxImage = (element: string | Element, amount = -20) => {
  return gsap.to(element, {
    yPercent: amount,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
};

export const fadeInOnScroll = (element: string | Element, triggerStart = "top 80%") => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: triggerStart
      }
    }
  );
};
