'use client';

import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/language-provider';

const locales: Locale[] = ['pl', 'en'];

export function LanguageToggle() {
  const { locale, setLocale, dictionary } = useLanguage();

  return (
    <div className="inline-flex rounded-md border bg-card p-1" role="group" aria-label="Language switcher">
      {locales.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          className={cn(
            'rounded px-2 py-1 text-xs font-medium transition-colors',
            locale === value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          {dictionary.language[value]}
        </button>
      ))}
    </div>
  );
}
