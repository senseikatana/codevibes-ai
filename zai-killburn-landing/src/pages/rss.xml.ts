import { useAstroCreateRssEndpoint } from 'katanakit-js/adapters/astro';
import { getCollection } from 'astro:content';
import site from '../content/site.json';
import author from '../content/author.json';
import { videos } from '../data/library';

// Demo anchor: ep.247 matches the Mar 2025 deep-dive; older eps step back
// ~9 days each so the feed sorts like the archive. Replace with real
// published dates when the content is real.
const anchor = new Date('2025-03-14T21:00:00Z');
const videoDate = (i: number): Date => new Date(anchor.valueOf() - i * 9 * 86400000);

export const GET = useAstroCreateRssEndpoint({
  title: site.brand.name,
  description: site.brand.description,
  site: site.brand.url,
  items: async () => {
    const posts = await getCollection('blog', ({ data }) => !data.draft);
    return [
      ...posts.map((p) => ({
        title: p.data.title,
        description: p.data.description,
        pubDate: p.data.date,
        link: `/blog/${p.id.replace(/\.md$/, '')}/`,
        author: author.name,
      })),
      ...videos.map((v, i) => ({
        title: `Ep. ${v.id} — ${v.title}`,
        description: `${v.views} views · ${v.runtime}`,
        pubDate: videoDate(i),
        link: `/videos/ep-${v.id}/`,
        author: author.name,
      })),
    ];
  },
});
