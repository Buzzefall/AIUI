import enTranslations from '../locale/en.json';
import ruTranslations from '../locale/ru.json';
import { Locale } from '../state/localeSlice';

const locales = {
  en: enTranslations,
  ru: ruTranslations,
};

// Helper to get a nested value from an object using a dot-separated key
const getNestedValue = (obj: any, key: string): string | undefined => {
  return key.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const getTranslation = (locale: Locale, key: string, options?: { [key: string]: string | number }): string => {
  const translations = locales[locale] || locales.en;
  let translation = getNestedValue(translations, key);

  if (translation === undefined) {
    console.warn(`Translation key "${key}" not found for locale "${locale}".`);
    // Fallback to English
    const fallbackTranslations = locales.en;
    translation = getNestedValue(fallbackTranslations, key);
    if (translation === undefined) {
      console.warn(`Translation key "${key}" not found in fallback locale "en".`);
      return key;
    }
  }

  if (options) {
    Object.keys(options).forEach((optionKey) => {
      const regex = new RegExp(`{${optionKey}}`, 'g');
      translation = (translation as string).replace(regex, String(options[optionKey]));
    });
  }

  return translation;
};