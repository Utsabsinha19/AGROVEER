'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';

export const LanguageFontManager = () => {
  const { currentLanguage } = useLanguageStore();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage;
      document.body.setAttribute('data-lang', currentLanguage);
      document.documentElement.setAttribute('data-lang', currentLanguage);
    }
  }, [currentLanguage]);

  return null;
};

