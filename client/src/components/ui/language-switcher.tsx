import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
}

export function LanguageSwitcher({ className, variant = 'ghost' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'gr' : 'en');
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        'px-3 py-2 transition-all duration-300',
        'hover:scale-105 hover:bg-white/10',
        'border border-white/20 hover:border-white/40 backdrop-blur-sm',
        'text-white/90 hover:text-white font-medium text-sm tracking-wide',
        className
      )}
      title={language === 'en' ? 'Switch to Greek' : 'Switch to English'}
    >
      {language === 'en' ? 'GR' : 'UK'}
    </Button>
  );
}