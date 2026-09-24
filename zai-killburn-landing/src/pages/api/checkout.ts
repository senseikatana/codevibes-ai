import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { products } from '../../data/library';
import { siteUrl } from '../../data/seo';

// Server-rendered: creates a Stripe Checkout Session per product on demand,
// so 100+ products need no pre-made Payment Links — price lives in
// src/content/products.json (priceCents + currency).
// Requires STRIPE_SECRET_KEY at runtime. Without it: clean 503, no stacktrace.
export const prerender = false;

const TEXT = { 'Content-Type': 'text/html; charset=utf-8' };

export const POST: APIRoute = async ({ request }) => {
  const key = import.meta.env.STRIPE_SECRET_KEY;
  if (!key) {
    return new Response('> CHECKOUT OFFLINE: store keys not configured on this host.', {
      status: 503,
      headers: TEXT,
    });
  }

  let slug = '';
  try {
    slug = (new URLSearchParams(await request.text()).get('slug') ?? '').trim();
  } catch {
    slug = '';
  }
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    return new Response('> ERROR: unknown product.', { status: 404, headers: TEXT });
  }

  try {
    const stripe = new Stripe(key);
    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: product.currency,
            unit_amount: product.priceCents,
            product_data: {
              name: product.name,
              description: product.why,
              images: [siteUrl(`/img/${product.img}-600x450.jpg`)],
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/picks/${product.slug}?checkout=success`,
      cancel_url: `${origin}/picks/${product.slug}?checkout=cancelled`,
      metadata: { slug: product.slug },
    });
    if (!session.url) {
      return new Response('> ERROR: Stripe returned no redirect URL.', {
        status: 502,
        headers: TEXT,
      });
    }
    // HTMX-native redirect: no JSON, no client JS needed.
    return new Response(null, { status: 200, headers: { 'HX-Redirect': session.url } });
  } catch (err) {
    console.error('[checkout]', err instanceof Error ? err.message : err);
    return new Response('> ERROR: checkout failed, try again in a minute.', {
      status: 502,
      headers: TEXT,
    });
  }
};
