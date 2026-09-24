import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  // Static-first (Astro 7: `hybrid` was merged into `static`): pages prerender
  // to HTML; routes with `export const prerender = false`
  // (POST /api/subscribe, POST /api/checkout) run on the server entry —
  // needs a Node runtime + STRIPE_SECRET_KEY for checkout.
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Permitir hosts de túneles (cloudflared, ngrok, etc.) en desarrollo.
      // true = permitir todos; en producción esto no aplica (dev server).
      allowedHosts: true,
    },
  },
});
