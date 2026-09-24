import type { APIRoute, GetStaticPaths } from 'astro';
import { videos, videoCardHTML } from '../../../data/library';

// Prerendered per category so HTMX swaps work on plain static hosts
// (query strings don't resolve to files on a static server).
export const getStaticPaths = (() =>
  ['all', 'review', 'comparison', 'news', 'deep', 'setup', 'bts'].map((cat) => ({
    params: { cat },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const cat = params.cat ?? 'all';
  const filtered = cat === 'all' ? videos : videos.filter((v) => v.cat === cat);

  const html =
    filtered.length > 0
      ? filtered.map(videoCardHTML).join('\n')
      : `<p class="col-span-full text-center text-xs font-mono text-[var(--fg-dim)] uppercase tracking-widest py-8">No videos in this category yet.</p>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
