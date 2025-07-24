import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const isDevelopment = import.meta.env.DEV;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: isDevelopment,
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
    
    react: {
      useSuspense: true,
    },
    
    // Performance optimizations
    load: 'languageOnly',
    preload: ['en', 'es', 'fr', 'de'],
    
    // Namespace configuration
    defaultNS: 'common',
    ns: ['common'],
  });

export default i18n;