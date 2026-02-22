import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  return ['', '/education', '/experience', '/podcast', '/contact'].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date()
  }));
}
