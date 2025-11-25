import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function useGSAP(callback: (context: { selector: (sel: string) => Element | null }) => void, deps: React.DependencyList = []) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const context = gsap.context(() => {
      callback({
        selector: (sel: string) => ref.current?.querySelector(sel) || null,
      });
    }, ref);

    return () => context.revert();
  }, deps);

  return ref;
}

export function useScrollTrigger() {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
}
