import { cookies } from 'next/headers';

import { defaultLocale, isLocale, type Locale } from '@/lib/i18n';

export function getServerLocale(): Locale {
  const cookieLocale = cookies().get('site_locale')?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;
  return defaultLocale;
}
