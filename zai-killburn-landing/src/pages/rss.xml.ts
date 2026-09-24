import type { APIRoute } from 'astro';
import { videos } from '../data/library';

export const GET: APIRoute = () => {
  const items = videos
    .map(
      (v) => `    <item>
      <title>Ep. ${v.id} — ${v.title}</title>
      <link>https://kilburn.tv/videos/ep-${v.id}</link>
      <guid>https://kilburn.tv/videos/ep-${v.id}</guid>
      <description>${v.views} views · ${v.runtime}</description>
    </item>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>KILBURN — Tech Reviews Without the Marketing Filter</title>
    <link>https://kilburn.tv/</link>
    <description>One human, one opinion, 412 videos and counting.</description>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
