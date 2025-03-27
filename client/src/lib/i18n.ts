import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "../locales/en.json";
import frTranslation from "../locales/fr.json";
import esTranslation from "../locales/es.json";

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      fr: {
        translation: frTranslation
      },
      es: {
        translation: esTranslation
      }
    },
    lng: "fr", // Default language
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
