# Changelog

## v3.0.0 — Brand Palette Refactor

### Breaking Changes

- **Renamed all color palettes**: removed `sensei-*` prefix entirely
  - `sensei-pink` → `rose` (#F43F5E)
  - `sensei-teal` → `teal` (#38686B)
  - `sensei-teal-bright` → removed (replaced by `emerald`)
  - `sensei-teal-light` → removed (consolidated into `teal`)
  - `sensei-yellow` → `yellow` (#F6DC8E)
  - `sensei-lavender` → `lavender` (#8C86AA)
  - `sensei-dark` → `dark` (#11151C)
  - `sensei-white` → `white` (#E4E4E7)
- **Added new palettes**: `emerald` (#10B981), `sky` (#25ABE4)
- **Removed palettes**: `sensei-teal-light`, `sensei-teal-bright` (overlapping teals consolidated)

### Updated

- `app/assets/css/main.css` — 8 palettes × 11 shades (50-950) in OKLCH
- `app/app.config.ts` — Nuxt UI semantic role mapping
- `nuxt.config.ts` — `ui.theme.colors` array
- `DESIGN.md` — Complete brand documentation

### Color Role Mapping

| Role | Color | Hex |
|---|---|---|
| primary | rose | #F43F5E |
| secondary | teal | #38686B |
| success | emerald | #10B981 |
| warning | yellow | #F6DC8E |
| error | rose | #F43F5E |
| info | sky | #25ABE4 |
| neutral | dark | #11151C |

---

## v2.0.0 — Initial Brand Palette

- Applied brand palette from PDF (v2.0.0)
- 8 `sensei-*` palettes with OKLCH values
- Dark mode by default

## v1.0.0 — Project Setup

- Nuxt 4 + Nuxt UI v4 + Pinia + Content + Stripe
- CV/Resume multi-language pages
- Blog with Nuxt Content v3
- Store with cart and Stripe checkout
- Unit tests with Vitest
