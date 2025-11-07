import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n';

export function useSectionTitle() {
  const [currentSection, setCurrentSection] = useState('home');
  const { t } = useLanguage();

  useEffect(() => {
    const sections = ['home', 'about', 'partners', 'services', 'technology', 'contact'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const sectionId = entry.target.id;
            if (sections.includes(sectionId)) {
              setCurrentSection(sectionId);
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.3
      }
    );

    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const baseTitleKey = 'Web Architects';
    let title = baseTitleKey;

    switch (currentSection) {
      case 'about':
        title = `${t('about.who')} ${t('about.we-are')} | ${baseTitleKey}`;
        break;
      case 'services':
        title = `${t('services.our')} ${t('services.work')} | ${baseTitleKey}`;
        break;
      case 'technology':
        title = `${t('technology.our')} ${t('technology.approach')} | ${baseTitleKey}`;
        break;
      case 'partners':
        title = `${t('partners.our')} ${t('partners.projects')} | ${baseTitleKey}`;
        break;
      case 'contact':
        title = `${t('contact.lets')} ${t('contact.connect')} | ${baseTitleKey}`;
        break;
      default:
        title = `${baseTitleKey} - Digital Experience Design`;
    }

    document.title = title;
  }, [currentSection, t]);

  return currentSection;
}