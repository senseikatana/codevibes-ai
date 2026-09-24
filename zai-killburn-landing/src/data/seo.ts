import { useHeadTags, type SiteConfig } from 'katanakit-js/adapters/astro';
import site from '../content/site.json';
import author from '../content/author.json';

// Single source of truth for SEO/RSS: content/*.json in, head tags out.
// katanakit-js owns serialization (title, meta, OG, RSS link).
const config: SiteConfig = {
  site: site.brand.url,
  title: site.brand.name,
  description: site.brand.description,
  lang: site.brand.lang,
  author: author.name,
  ogImage: '/img/aspectphone-1920x1080.jpg',
  rss: { enabled: true, path: '/rss.xml', limit: 20 },
  seo: {
    noindex: false,
    canonical: true,
    openGraph: true,
    twitterCard: false,
    jsonLd: false,
  },
  nav: site.nav.map(({ label, href }) => ({ label, href })),
};

export function headTags(title: string, description: string, url?: string, image?: string): string {
  return useHeadTags(config, {
    title,
    description,
    url,
    ...(image ? { ogImage: image } : {}),
  });
}

export function siteUrl(path = ''): string {
  return `${site.brand.url}${path}`;
}
