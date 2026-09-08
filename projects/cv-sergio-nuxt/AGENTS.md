# AGENTS.md — Development Guidelines

## Project Overview

Portfolio, CV, Blog y Tienda for senseikatana.com (Sergio Esteban).

**Stack**: Nuxt 4, Nuxt UI v4, Nuxt Content v3, Pinia, Stripe, KatanaKit, Prisma

## Key Conventions

### Routing

- Default language: **Spanish** (ES)
- Routes use `/[lang]/resume/[slug]` structure
- Use `useSlugify()` from `katanakit-js` for all slugs
- Product pages: `/store/[slug]` (NOT `/store/[id]`)
- CV pages: `/[lang]/resume/[slug]`

### Data Layer

- Products: `data/products.ts` — keep `id` for Stripe, use `slug` for routes
- Profiles: `data/profiles.ts` — flat array with `slug` + `lang` fields
- Cart: `app/stores/cart.ts` — Pinia store, uses `slug` for all operations
- Blog: `@nuxt/content` — Markdown files in `content/blog/`

### CSS / Design Tokens

- All colors in OKLCH format (HSL fallback if OKLCH diverges too much)
- Never use RGB or `#hex` in CSS variables
- Palette defined in `app/assets/css/main.css` (`:root` + `@theme static`)
- Nuxt UI role mapping in `app/app.config.ts`
- Available palettes in `nuxt.config.ts` → `ui.theme.colors`

### Brand Palette (v3.0.0)

| Color | Hex | Nuxt UI Role |
|---|---|---|
| `rose` | #F43F5E | primary + error |
| `teal` | #38686B | secondary |
| `emerald` | #10B981 | success |
| `yellow` | #F6DC8E | warning |
| `sky` | #25ABE4 | info |
| `dark` | #11151C | neutral |
| `white` | #E4E4E7 | (available) |
| `lavender` | #8C86AA | (available) |

Usage: `bg-rose-400`, `text-sky-200`, `border-teal-600`, etc.

### Nuxt UI v4

- Root wrapper: `<UApp>` in `app.vue`
- Layout structure: see `app/layouts/default.vue`
- Icons: `i-lucide-*` (Lucide), `i-simple-icons-*` (Simple Icons)
- `@iconify-json/lucide` and `@iconify-json/simple-icons` installed
- `icon.clientBundle.scan: true` in `nuxt.config.ts`

### Imports (Nuxt 4)

- `~/` resolves to `app/` directory
- Use `~~/` for project root imports (e.g., `~~/data/products`)
- `~~/data/*` for data files, NOT `~/data/*`

### Prisma

- ORM for InsForge Postgres connection
- Schema: `prisma/schema.prisma`
- Generate client: `npx prisma generate`

### Testing

- Framework: Vitest
- Run: `bun run test`
- Tests in `tests/` directory

### Content

- Blog posts in `content/blog/` as Markdown
- Highlight theme: `github-dark`

## Anti-Patterns

- ❌ Don't copy content from gndx.dev (layout/style inspiration only)
- ❌ Don't use `~/data/*` — use `~~/data/*` (Nuxt 4 alias issue)
- ❌ Don't use `sensei-*` prefix for colors — use clean names (`rose`, `teal`, etc.)
- ❌ Don't use `id` for routes — use `slug`
- ❌ Don't add AI attribution or "Co-Authored-By" to commits

## Commit Style

Conventional commits only (feat, fix, chore, docs, refactor, test, perf, ci).
