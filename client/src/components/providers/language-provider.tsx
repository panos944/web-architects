import { ReactNode, useState, useEffect } from 'react';
import { Language, LanguageContext, getTranslation } from '@/lib/i18n';

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    // Check for saved language preference
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const t = (key: string): string => {
    return getTranslation(key, language);
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // Update document lang attribute
    document.documentElement.lang = lang === 'gr' ? 'el' : 'en';
  };

  useEffect(() => {
    // Set initial document lang
    document.documentElement.lang = language === 'gr' ? 'el' : 'en';
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}