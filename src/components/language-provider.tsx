'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dictionary: ReturnType<typeof getDictionary>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLocale
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    document.cookie = `site_locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    localStorage.setItem('site_locale', nextLocale);
    setLocaleState(nextLocale);
    router.refresh();
  };

  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}
