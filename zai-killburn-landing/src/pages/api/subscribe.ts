import type { APIRoute } from 'astro';

// Server-rendered: POST bodies don't exist on prerendered static endpoints.
// (On a pure static host this route 404s — the forms carry an
// hx-on::response-error fallback message for that case.)
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let email = '';
  const ct = request.headers.get('content-type') ?? '';
  try {
    const raw = await request.text();
    if (ct.includes('application/json')) {
      email = ((JSON.parse(raw) as { email?: string }).email ?? '').trim();
    } else {
      email = (new URLSearchParams(raw).get('email') ?? '').trim();
    }
  } catch {
    email = '';
  }

  if (!email || !email.includes('@') || email.length < 5) {
    return new Response('> ERROR: Please enter a valid email address.', {
      status: 422,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new Response('> SUBSCRIBED. Check your inbox for confirmation.', {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
