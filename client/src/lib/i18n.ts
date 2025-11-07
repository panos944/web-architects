import { createContext, useContext } from 'react';

export type Language = 'en' | 'gr';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionaries
export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.who-we-are': 'Who We Are',
    'nav.our-work': 'Our Work',
    'nav.technology': 'Technology',
    'nav.partners': 'Projects',
    'nav.contact': 'Contact',
    'nav.web-architects': 'Web Architects',
    
    // Hero Section
    'hero.web': 'WEB',
    'hero.architects': 'ARCHITECTS',
    'hero.tagline': 'Every pixel counts.',
    'hero.services': 'SERVICES',
    'hero.web-apps': 'Web & Mobile Application Development',
    'hero.eshops': 'E-Commerce Solutions',
    'hero.web-design': 'Web Design',
    'hero.view-work': 'View Our Work',
    'hero.explore': 'Explore',
    
    // About Section
    'about.number': '01',
    'about.who': 'WHO',
    'about.we-are': 'WE ARE',
    'about.intro': 'At <strong>Web Architects</strong>, we craft digital products where design precision meets technical excellence.',
    'about.building-purpose': 'Building With Purpose',
    'about.description1': 'Rooted in the principle that form and function are inseparable, we treat each project as a unique opportunity to solve complex challenges with clarity and innovation.',
    'about.description2': 'By merging strategic insight with advanced engineering, we ensure every application we create is visually distinctive, technically robust, and optimized to perform flawlessly across devices and platforms.',
    'about.nav-next': '01 → 02',
    'about.nav-text': 'About → Projects',
    'about.alt-workspace': 'Modern workspace showcasing design process',
    
    // About Values
    'about.value1.title': 'Strategy & Vision',
    'about.value1.description': 'We start with a deep understanding of your business objectives, translating them into digital strategies that accelerate growth and strengthen brand presence.',
    'about.value2.title': 'Design Excellence',
    'about.value2.description': 'We design intuitive, visually striking interfaces that connect with your audience and redefine the standards of modern web design.',
    'about.value3.title': 'Technical Mastery',
    'about.value3.description': 'From responsive frontends to scalable backends, we apply the latest technologies to deliver secure, high-performance digital platforms tailored to your needs.',
    
    // Services Section
    'services.number': '03',
    'services.our': 'OUR',
    'services.work': 'WORK',
    'services.description': 'We believe in creating digital products that are both functionally excellent and emotionally resonant. Our process combines strategic thinking with creative exploration.',
    'services.nav-next': '03 → 04',
    'services.nav-text': 'Services → Technology',
    
    // Services Array
    'services.strategy.title': 'Digital\nStrategy',
    'services.strategy.description': 'We develop tailored strategies that act as a clear blueprint for success, ensuring every decision moves you closer to your goals. \n\nFrom in-depth market research to precise performance benchmarks, every phase is designed to maximise clarity, accelerate growth, and adapt to evolving opportunities. \n\nOur approach blends analytical insight with creative foresight, giving you a path that is both strategic and adaptable.',
    'services.design.title': 'Interface\nDesign',
    'services.design.description': 'We design interfaces that go beyond aesthetics. Every element is purposeful, every transition smooth, and every detail aligned with your brand\'s personality.\n\nFrom the first click to the final interaction, our goal is to create intuitive pathways that guide users naturally. \n\nEvery decision is made to reinforce your identity, streamline navigation, and deliver a sense of ease that keeps people engaged and connected.',
    'services.development.title': 'Development\nExcellence',
    'services.development.description': 'We engineer platforms with the future in mind, solutions that are not only fast and reliable today but also flexible enough to evolve with your business.\n\nBy combining modern frameworks with time-tested development practices, we create architectures that can handle growth without compromising performance.\n\nEvery build is fortified with robust security measures, optimized for efficiency, and designed to adapt to new technologies, ensuring your product remains relevant and resilient for years to come.',
    
    // Technology Section
    'technology.number': '04',
    'technology.our': 'OUR',
    'technology.approach': 'APPROACH',
    'technology.description': 'Exceptional results are born from the intersection of strategic thinking, creative vision, and technical precision.',
    'technology.every-pixel': '<strong>Every pixel counts.',
    'technology.excellence': 'Thoughtful design meets technical excellence',
    'technology.process1': 'Every project begins with understanding—your goals, your users, and your challenges. From this foundation, we create work that is purposeful, refined, and built to last.',
    'technology.process2': 'As in everything we do, our approach reflects the same precision, clarity, and commitment that define who we are. We stay involved beyond launch, ensuring your platform continues to evolve, adapt, and perform in a changing digital landscape.',
    'technology.research': 'Research & Discovery',
    'technology.design': 'Design & Prototype',
    'technology.develop': 'Develop & Deploy',
    'technology.nav-prev': '03 → 04',
    'technology.nav-text-prev': 'Services → Technology',
    
    // Partners Section
    'partners.nav-prev': '01 → 02',
    'partners.nav-text-prev': 'About → Projects',
    'partners.number': '02',
    'partners.our': 'Our',
    'partners.projects': 'Projects',
    'partners.description': 'We collaborate with industry leaders and innovative companies to deliver exceptional results. Our partnerships drive mutual growth and technological excellence.',
    'partners.nav-next': '02 → 03',
    'partners.nav-text': 'Projects → Services',
    
    // Partners Array
    'partners.socialsyn.description': 'A modern & elegant website for a digital agency.',
    'partners.rolco.description': 'A contest website for one of the largest cleaning brands in Greece.',
    'partners.oloygeia.description': 'Premium lifestyle and fashion news coverage website.',
    'partners.thecars.description': 'Automotive coverage on all issues and areas.',
    'partners.realfm.description': 'Advanced media player for Real FM 97.8.',
    'partners.wellness.description': 'Digital wellness platform and news for modern living.',
    'partners.news.description': 'Leading Greek news website offering coverage on a variety of topics',
    'partners.alt-logo': 'logo',
    
    // Contact Section
    'contact.number': '05',
    'contact.lets': 'LET\'S',
    'contact.connect': 'CONNECT',
    'contact.description': 'Ready to explore new possibilities? We\'d love to hear about your project and discuss how we can bring your vision to life.',
    'contact.email-label': 'Email',
    'contact.phone-label': 'Phone',
    'contact.location-label': 'Location',
    'contact.location-city': 'Athens, Greece',
    'contact.forward': 'Let\'s talk about your project',
    'contact.email-description': 'Share your project details and we\'ll answer within 24 hours.',
    'contact.phone-description': 'Prefer to speak? Call us and let\'s build something together.',
    'contact.location-description': 'We collaborate remotely with clients across the globe.',
    
    // Footer
    'footer.logo-alt': 'Web Architects Logo',
    'footer.web': 'WEB',
    'footer.architects': 'ARCHITECTS',
    'footer.description': 'Crafting exceptional digital experiences where precision meets creativity. Every pixel, every interaction, every moment - designed with purpose.',
    'footer.services': 'Services',
    'footer.service-web-apps': 'Web & Mobile Applications',
    'footer.service-development': 'Development',
    'footer.service-eshops': 'E-commerce Platforms',
    'footer.service-web-design': 'Web Design',
    'footer.copyright': '© 2025 Web Architects. All rights reserved.',
    'footer.designed': 'Designed & Developed in Athens',
    
    // UI Components
    'ui.breadcrumb': 'breadcrumb',
    'ui.toggle-sidebar': 'Toggle Sidebar',
    'ui.pagination': 'pagination',
    'ui.prev-page': 'Go to previous page',
    'ui.next-page': 'Go to next page',
  },
  
  gr: {
    // Navigation
    'nav.home': 'Αρχική',
    'nav.who-we-are': 'Ποιοι Είμαστε',
    'nav.our-work': 'Η Δουλειά Μας',
    'nav.technology': 'Τεχνολογία',
    'nav.partners': 'Έργα',
    'nav.contact': 'Επικοινωνία',
    'nav.web-architects': 'Web Architects',
    
    // Hero Section
    'hero.web': 'WEB',
    'hero.architects': 'ARCHITECTS',
    'hero.tagline': 'Κάθε πίξελ μετράει. ',
    'hero.services': 'Υπηρεσίες',
    'hero.web-apps': 'Ανάπτυξη Web & Mobile Εφαρμογών',
    'hero.eshops': 'Ηλεκτρονικά Καταστήματα',
    'hero.web-design': 'Σχεδιασμός Ιστοσελίδων',
    'hero.view-work': 'Ποιοί είμαστε',
    'hero.explore': 'Εξερεύνησε',
    
    // About Section
    'about.number': '01',
    'about.who': 'ΠΟΙΟΙ',
    'about.we-are': 'ΕΙΜΑΣΤΕ',
    'about.intro': 'Στη <strong>Web Architects</strong>, δημιουργούμε καινοτόμες, εύχρηστες και μοναδικές εφαρμογές.',
    'about.building-purpose': 'Δημιουργούμε με Σκοπό',
    'about.description1': 'Βασισμένοι στην αρχή ότι η ομορφιά και η λειτουργικότητα συμβαδίζουν, αντιμετωπίζουμε κάθε έργο ως μια μοναδική ευκαιρία να αντιμετωπίσουμε πολύπλοκες προκλήσεις με σαφήνεια και καινοτομία.',
    'about.description2': 'Συνδυάζοντας διορατικότητα με προηγμένες τεχνολογίες, διασφαλίζουμε ότι κάθε εφαρμογή που δημιουργούμε είναι μοναδική, τεχνικά άρτια και βελτιστοποιημένη για άψογη απόδοση σε όλες τις συσκευές και πλατφόρμες.',
    'about.nav-next': '01 → 02',
    'about.nav-text': 'Για Εμάς → Έργα',
    'about.alt-workspace': 'Σύγχρονος χώρος εργασίας που παρουσιάζει τη διαδικασία σχεδιασμού',
    
    // About Values
    'about.value1.title': 'Στρατηγική & Όραμα',
    'about.value1.description': 'Ξεκινάμε με βαθιά κατανόηση των επιχειρηματικών σας στόχων, μετατρέποντάς τους σε ψηφιακές στρατηγικές που επιταχύνουν την ανάπτυξη και ενισχύουν την παρουσία της εταιρείας σας.',
    'about.value2.title': 'Ψηφιακός Σχεδιασμός',
    'about.value2.description': 'Σχεδιάζουμε οπτικά εντυπωσιακές εφαρμογές που συνδέονται με το κοινό σας και επαναπροσδιορίζουν τα πρότυπα του σύγχρονου web design.',
    'about.value3.title': 'Τεχνική Καινοτομία',
    'about.value3.description': 'Από responsive frontends έως επεκτάσιμα backends, εφαρμόζουμε τις πιο σύγχρονες τεχνολογίες για να παραδώσουμε ασφαλείς, υψηλής απόδοσης ψηφιακές πλατφόρμες προσαρμοσμένες στις ανάγκες σας.',
    
    // Services Section
    'services.number': '03',
    'services.our': 'TI',
    'services.work': 'ΚΑΝΟΥΜΕ',
    'services.description': 'Δημιουργούμε ψηφιακά προϊόντα που συνδυάζουν άρτια λειτουργικότητα με συναισθηματική σύνδεση με τους χρήστες. Η δουλειά μας συνδυάζει στρατηγική σκέψη και δημιουργικότητα.',
    'services.nav-next': '03 → 04',
    'services.nav-text': 'Υπηρεσίες → Τεχνολογία',
    
    // Services Array
    'services.strategy.title': 'Ψηφιακή\nΣτρατηγική',
    'services.strategy.description': 'Αναπτύσσουμε προσαρμοσμένες στρατηγικές που λειτουργούν ως σαφές σχεδιάγραμμα επιτυχίας, διασφαλίζοντας ότι κάθε απόφαση σας φέρνει πιο κοντά στους στόχους σας.\n\nΑπό εις βάθος έρευνα αγοράς έως ακριβή benchmarks απόδοσης, κάθε φάση έχει σχεδιαστεί για να μεγιστοποιήσει τη σαφήνεια, να επιταχύνει την ανάπτυξη και να προσαρμοστεί στις εξελισσόμενες ευκαιρίες της αγοράς.\n\nΗ προσέγγισή μας συνδυάζει διορατικότητα και δημιουργία, χαράζωντας μια διαδρομή που προσαρμόζεται ανάλογα με τις ανάγκες σας.',
    'services.design.title': 'Σχεδιασμός\nInterface',
    'services.design.description': 'Σχεδιάζουμε interfaces που ξεπερνούν την αισθητική. Κάθε στοιχείο είναι σκόπιμο, κάθε μετάβαση ομαλή και κάθε λεπτομέρεια ευθυγραμμισμένη με την προσωπικότητα της εταιρείας σας.\n\nΑπό το πρώτο κλικ έως την τελευταία αλληλεπίδραση, στόχος μας είναι να δημιουργήσουμε διαισθητικές διαδρομές που καθοδηγούν τους χρήστες φυσικά.\n\nΚάθε απόφαση λαμβάνεται για να ενισχύσει την ταυτότητά σας, να βελτιστοποιήσει την πλοήγηση και να προσφέρει μια αίσθηση ευκολίας που διατηρεί τους χρήστες συνδεδεμένους.',
    'services.development.title': 'Ανάπτυξη\nΕφαρμογών',
    'services.development.description': 'Δημιουργούμε εφαρμογές έτοιμες για το μέλλον, λύσεις που δεν είναι μόνο γρήγορες και αξιόπιστες σήμερα αλλά αρκετά ευέλικτες για να εξελιχθούν με την επιχείρησή σας.\n\nΣυνδυάζοντας σύγχρονα frameworks με δοκιμασμένες πρακτικές ανάπτυξης, δημιουργούμε αρχιτεκτονικές που μπορούν να χειριστούν την ανάπτυξη χωρίς να συμβιβάζουν την απόδοση.\n\nΚάθε build ενισχύεται με ισχυρά μέτρα ασφαλείας, βελτιστοποιείται για αποδοτικότητα και σχεδιάζεται να προσαρμόζεται σε νέες τεχνολογίες, διασφαλίζοντας ότι το προϊόν σας παραμένει ανθεκτικό για χρόνια.',
    
    // Technology Section
    'technology.number': '04',
    'technology.our': 'Η ΣΤΡΑΤΗΓΙΚΗ',
    'technology.approach': ' ΜΑΣ',
    'technology.description': 'Τα πιο ουσιαστικά αποτελέσματα γεννιούνται όταν η στρατηγική σκέψη συναντά το δημιουργικό όραμα και την τεχνική ακρίβεια.',
    'technology.every-pixel': '<strong>Κάθε pixel μετράει.</strong>',
    'technology.excellence': 'Σχεδιασμός με τεχνική ακρίβεια',
    'technology.process1': 'Κάθε έργο ξεκινά με κατανόηση των στόχων σας, των χρηστών σας και των προκλήσεών σας. Από αυτό το θεμέλιο, δημιουργούμε εφαρμογές που είναι σκόπιμες, εκλεπτυσμένες και χτισμένες για να διαρκούν.',
    'technology.process2': 'Στεκόμαστε δίπλα σας και μετά την κυκλοφορία της εφαρμογής, εξασφαλίζοντας ότι η πλατφόρμα σας εξελίσσεται, προσαρμόζεται και αποδίδει σε ένα συνεχώς μεταβαλλόμενο ψηφιακό περιβάλλον.',
    'technology.research': 'Έρευνα & Δημιουργία',
    'technology.design': 'Σχεδιασμός & Πρωτότυπο',
    'technology.develop': 'Ανάπτυξη & Παράδοση',
    'technology.nav-prev': '03 → 04',
    'technology.nav-text-prev': 'Υπηρεσίες → Τεχνολογία',
    
    // Partners Section
    'partners.nav-prev': '01 → 02',
    'partners.nav-text-prev': 'Για Εμάς → Έργα',
    'partners.number': '02',
    'partners.our': 'Η Δουλειά',
    'partners.projects': 'Μας ',
    'partners.description': 'Συνεργαζόμαστε με πρωτοπόρες εταιρείες και μετατρέπουμε τις ιδέες σε επιτυχία.',
    'partners.nav-next': '02 → 03',
    'partners.nav-text': 'Έργα → Υπηρεσίες',
    
    // Partners Array
    'partners.socialsyn.description': 'Μια σύγχρονη και κομψή ιστοσελίδα για το digital agency Socialsyn.',
    'partners.rolco.description': 'Ιστότοπος διαγωνισμού για μία από τις μεγαλύτερες μάρκες καθαριστικών στην Ελλάδα.',
    'partners.oloygeia.description': 'Premium ιστότοπος κάλυψης lifestyle και μόδας.',
    'partners.thecars.description': 'Αυτοκινητιστική κάλυψη σε όλα τα θέματα και τομείς.',
    'partners.realfm.description': 'Media player για τον Real FM 97.8.',
    'partners.wellness.description': 'Ψηφιακή πλατφόρμα wellness και ειδήσεις για τη σύγχρονη ζωή.',
    'partners.news.description': 'Κορυφαίος ελληνικός ιστότοπος ειδήσεων που προσφέρει κάλυψη σε ποικιλία θέματων',
    'partners.alt-logo': 'λογότυπο',
    
    // Contact Section
    'contact.number': '05',
    'contact.lets': 'ΕΠΙΚΟΙΝΩΝΗΣΤΕ',
    'contact.connect': 'ΜΑΖΙ ΜΑΣ',
    'contact.description': 'Έτοιμοι να εξερευνήσετε νέες δυνατότητες; Θα θέλαμε να ακούσουμε για το έργο σας και να συζητήσουμε πώς μπορούμε να δώσουμε ζωή στο όραμά σας.',
    'contact.email-label': 'Email',
    'contact.phone-label': 'Τηλέφωνο',
    'contact.location-label': 'Τοποθεσία',
    'contact.location-city': 'Αθήνα, Ελλάδα',
    'contact.forward': 'Ας μιλήσουμε για το έργο σας',
    'contact.email-description': 'Στείλτε μας τις λεπτομέρειες του έργου σας και θα σας απαντήσουμε εντός 24 ωρών.',
    'contact.phone-description': 'Προτιμάτε να μιλήσουμε; Καλέστε μας και ας δημιουργήσουμε μαζί.',
    'contact.location-description': 'Συνεργαζόμαστε με πελάτες σε όλο τον κόσμο.',
    
    // Footer
    'footer.logo-alt': 'Λογότυπο Web Architects',
    'footer.web': 'WEB',
    'footer.architects': 'ARCHITECTS',
    'footer.description': 'Δημιουργούμε ψηφιακές εμπειρίες όπου η ακρίβεια συναντά τη δημιουργικότητα. Κάθε pixel, κάθε αλληλεπίδραση, κάθε στιγμή - σχεδιασμένα με σκοπό.',
    'footer.services': 'Υπηρεσίες',
    'footer.service-web-apps': 'Ανάπτυξη Web & Mobile Εφαρμογών',
    'footer.service-development': 'Development',
    'footer.service-eshops': 'Ηλεκτρονικά Καταστήματα',
    'footer.service-web-design': 'Σχεδιασμός Ιστοσελίδων',
    'footer.copyright': '© 2025 Web Architects. Όλα τα δικαιώματα διατηρούνται.',
    'footer.designed': 'Σχεδιασμένο & Αναπτυγμένο στην Αθήνα',
    
    // UI Components
    'ui.breadcrumb': 'πλοήγηση',
    'ui.toggle-sidebar': 'Εναλλαγή Πλευρικής Μπάρας',
    'ui.pagination': 'σελιδοποίηση',
    'ui.prev-page': 'Μετάβαση στην προηγούμενη σελίδα',
    'ui.next-page': 'Μετάβαση στην επόμενη σελίδα',
  },
};

export const getTranslation = (key: string, language: Language): string => {
  return (translations[language] as Record<string, string>)[key] || key;
};