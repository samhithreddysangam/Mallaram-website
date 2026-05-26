import { MetadataRoute } from 'next';
import { siteConfig, publicRoutes } from '@/lib/seo';
import { locales } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of publicRoutes) {
      entries.push({
        url: `${siteConfig.url}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changefreq as 'daily' | 'weekly' | 'monthly' | 'yearly' | 'always' | 'hourly' | 'never',
        priority: route.priority,
        alternates: {
          languages: {
            en: `${siteConfig.url}/en${route.path}`,
            te: `${siteConfig.url}/te${route.path}`,
          },
        },
      });
    }
  }

  return entries;
}
