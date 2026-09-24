import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  // Static-first: every page prerenders to dist/*.html. Only routes with
  // `export const prerender = false` (POST /api/subscribe) use the server
  // entry — plain `Bun.serve` static hosting keeps working for everything else.
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [tailwindcss()],
  },
});
