// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // Pass i18n to react-i18next
  .init({
    fallbackLng: 'en', // Default language if the user’s language can’t be found
    lng: 'en', // Initial language
    supportedLngs: ['en', 'es'], // List of supported languages
    debug: true, // Logs info to the console
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
    resources: {
      en: {
        translation: {
          user_type: 'User Type',
        }
      }
    }
    // backend: {
    //   loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    // },
  });

export default i18n;
