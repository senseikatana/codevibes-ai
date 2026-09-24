import type { APIRoute } from 'astro';

// The demo dataset holds 12 videos — this static fragment tells HTMX
// there's nothing more to append (no fake data, no 404).
export const GET: APIRoute = () =>
  new Response(
    `<p class="col-span-full text-center text-xs font-mono text-[var(--fg-dim)] uppercase tracking-widest py-8">End of the demo set — the full 412 live in the <a class="underline" href="/archive">archive</a>.</p>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
