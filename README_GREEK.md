# Greek Language Implementation for Web Architects

This project now includes full Greek language support through a robust internationalization (i18n) system.

## Features Added

### 1. Complete Translation System
- **85+ text items** translated from English to Greek
- Professional translations maintaining the sophisticated tone
- Covers all sections: Navigation, Hero, About, Services, Technology, Partners, Contact, Footer

### 2. Language Switching
- **Language Switcher Button** in the navigation bar
- Toggles between English (EN) and Greek (ΕΛ)
- **Persistent language selection** - saves preference to localStorage
- Automatic document language attribute updates (`lang="el"` for Greek)

### 3. Implementation Details

#### Files Created:
- `client/src/lib/i18n.ts` - Translation system and utilities
- `client/src/components/providers/language-provider.tsx` - Context provider
- `client/src/components/ui/language-switcher.tsx` - Switch component

#### Files Updated:
- All major components now use the translation system
- `client/src/main.tsx` - Wrapped with LanguageProvider
- Navigation, Hero, About, Contact, Footer components fully translated

### 4. Usage Examples

#### In Components:
```typescript
import { useLanguage } from '@/lib/i18n';

function MyComponent() {
  const { t } = useLanguage();
  
  return <h1>{t('hero.web')}</h1>; // "WEB" in EN, "WEB" in GR
}
```

#### Translation Keys:
```typescript
// Navigation
t('nav.home') // "Home" / "Αρχική"
t('nav.contact') // "Contact" / "Επικοινωνία"

// Hero Section  
t('hero.tagline') // "Creating digital experiences..." / "Δημιουργούμε ψηφιακές εμπειρίες..."

// Contact Form
t('contact.name') // "Name" / "Όνομα"
t('contact.send') // "Send Message" / "Στείλε Μήνυμα"
```

## How to Use

1. **Language Switcher**: Click the EN/ΕΛ button in the top navigation
2. **Persistent**: Your language choice is saved automatically
3. **Complete Coverage**: All user-facing text supports both languages

## Technical Notes

- Uses React Context for state management
- LocalStorage persistence for user preferences
- Type-safe translation keys with TypeScript
- Fallback to key if translation missing
- Document language attribute synchronization

The website now provides a complete bilingual experience for both English and Greek users while maintaining the sophisticated design and smooth animations.