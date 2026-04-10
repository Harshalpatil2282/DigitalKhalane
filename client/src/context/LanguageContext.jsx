/**
 * Language Context — Manages app-wide language switching
 * Supports: English (en), Marathi (mr), Hindi (hi)
 * Created by Harshal Parmeshvar Patil
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../translations/en';
import mr from '../translations/mr';
import hi from '../translations/hi';

const translations = { en, mr, hi };

export const LANGUAGES = [
  { code: 'en', label: 'English',  nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'mr', label: 'Marathi',  nativeLabel: 'मराठी',   flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi',    nativeLabel: 'हिंदी',    flag: '🇮🇳' },
];

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('dk_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('dk_lang', lang);
    // Set HTML lang attribute for accessibility & SEO
    document.documentElement.lang = lang;
  }, [lang]);

  // t() is the translate function — t('home') → 'Home' or 'मुख्यपृष्ठ' etc.
  const t = (key) => translations[lang]?.[key] ?? translations['en']?.[key] ?? key;

  const currentLang = LANGUAGES.find(l => l.code === lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, currentLang, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
