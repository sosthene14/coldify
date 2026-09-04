import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import fr from './locales/fr.json';

// Récupérer la langue sauvegardée ou utiliser la langue du navigateur
const savedLanguage = localStorage.getItem('language');
const browserLanguage = navigator.language.split('-')[0]; // 'fr-FR' -> 'fr'
const defaultLanguage = savedLanguage || (browserLanguage === 'fr' ? 'fr' : 'en');

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Sauvegarder la langue quand elle change
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;