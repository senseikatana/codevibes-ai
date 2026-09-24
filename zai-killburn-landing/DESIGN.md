# KILBURN — Imagen de marca

Tech reviews without the marketing filter. One human, one opinion.
Vibe: high-production, opinionated, charismatic, modern.

## Tipografía (vendored, cero CDN)

Tres familias variables servidas desde `public/fonts/` vía `@font-face`
(`src/styles/fonts.css`, `font-display: swap`):

| Rol                                     | Familia                                   | Archivo                      | Ejes / pesos                                                                                                                                        |
| --------------------------------------- | ----------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display — headings, hero, logo          | **Bricolage Grotesque** (`.font-display`) | `BricolageGrotesque-var.ttf` | `opsz` 12–96, `wdth` 75–100, `wght` 200–800. Uso: weight 800, `font-variation-settings: 'wdth' 92`, `letter-spacing: -0.035em`, `line-height: 0.92` |
| Body — párrafos, nav                    | **Space Grotesk**                         | `SpaceGrotesk-var.ttf`       | `wght` 300–700                                                                                                                                      |
| Mono — metadata, stats, labels, botones | **JetBrains Mono** (`.font-mono`)         | `JetBrainsMono-var.ttf`      | `wght` 100–800 (se usan 400/700), `letter-spacing: 0.02em`; labels en uppercase + `0.2em`                                                           |

No usar otras familias. Los fallbacks son `sans-serif` / `monospace` del sistema.

## Paleta

Fondo negro puro con grain de film animado (`body::before`, SVG turbulence,
`mix-blend-mode: overlay`, respeta `prefers-reduced-motion`).

| Token                           | Valor                          | Uso                                                                                                                                                                                                                      |
| ------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--bg`                          | `#080808`                      | fondo                                                                                                                                                                                                                    |
| `--bg-elevated`                 | `#111111`                      | cards                                                                                                                                                                                                                    |
| `--fg`                          | `#f5f5f5`                      | texto                                                                                                                                                                                                                    |
| `--fg-dim` / `--fg-mute`        | `#888888` / `#555555`          | texto secundario                                                                                                                                                                                                         |
| `--accent` + `--section-accent` | `#ff2a2a` signal red (default) | CTAs, live dots, progress. **Cambia por sección** vía `IntersectionObserver` sobre `[data-accent]`: `red #ff2a2a` → `blue #2b6fff` → `yellow #e5ff00` (transición 0.7s sobre custom property registrada con `@property`) |
| `--yellow`                      | `#e5ff00` neon                 | picks, precios                                                                                                                                                                                                           |
| `--blue`                        | `#2b6fff` electric             | acento sección library/BTS                                                                                                                                                                                               |
| `--border` / `--border-strong`  | `rgba(255,255,255,0.08/0.18)`  | bordes                                                                                                                                                                                                                   |

## Imagen y composición

- Hero cinematográfico 16:9 (`cinematic-frame vignette`): pan lento 14s en
  hover + scan-line + marcadores de esquina. Todo local en `public/img/`.
- Thumbnails 16:9 con preview en hover (`card-pan` 6s + barra `progress-fill` 4s).
- Retratos/BTS en alto contraste; grilla BTS con `grayscale → color` en hover.
- Iconografía: Font Awesome 6.4.0 Free local (play, capítulos, sociales, RSS).

## Voz

Directa, sin filtro sponsor, números sobre adjetivos. Correcciones públicas.
Newsletter dominical: 3 productos, 2 opiniones, 0 relleno.

## Reglas de cascada (no romper)

- `html{font-size:100%}` (16px, en `main.css`) — katanakit trae 62.5% (10px);
  sin el override todo lo rem se encoge ×0.625.
- katanakit se importa con `layer(katanakit)` (capa más débil) — sin esto sus
  utilities sin capa (`.hidden`, `.text-*`) pisan las variantes responsive.

## Contenido (tus datos reales van acá)

Toda la data vive en `src/content/` — cambiá estos archivos y todo el sitio
se actualiza (nav, footer, hero, stats, cards, páginas):

| Archivo         | Qué contiene                                                           |
| --------------- | ---------------------------------------------------------------------- |
| `site.json`     | marca, nav, mobileNav, hero, stats, marquee, footer, socials, contacto |
| `author.json`   | retrato, bio, facts, principios (página studio)                        |
| `videos.json`   | grilla de videos + fragmentos HTMX + páginas ep                        |
| `products.json` | grilla de picks (tu futura store)                                      |
| `services.json` | servicios (semilla estilo corporate, ver abajo)                        |
| `blog/*.md`     | posts en Markdown con frontmatter (título, fecha, tags, minutos)       |

`src/content.config.ts` define la colección `blog` (content layer de Astro 7:
loader `glob` + schema zod). Los JSON se importan directo, sin colección.

## Adaptación a sitio personal (senseikatana.com)

El esqueleto ya mapea 1:1 a un portfolio corporativo estilo Daath:

| KILBURN (demo)               | Tu sitio                            |
| ---------------------------- | ----------------------------------- |
| hero + stats                 | hero de portfolio + métricas        |
| `/videos` (library)          | `/proyectos` (trabajos)             |
| `/reviews` + `/blog`         | casos de estudio + blog             |
| `/picks` (products.json)     | store / servicios (`services.json`) |
| `/newsletter`, `/membership` | contacto + pricing                  |
| `/studio` (author.json)      | sobre mí                            |

Para adaptar sin videos: vaciá `videos.json`, poné tus proyectos en
`services.json` + posts en `blog/`, y reemplazá `site.json`/`author.json`.

## katanakit-js (adapters en uso)

- **SEO** (`adapters/astro` → `useHeadTags`): `src/data/seo.ts` mapea
  `content/site.json` + `author.json` al `SiteConfig` y el Layout inyecta
  title/canonical/OG/RSS. El `SiteConfig` tiene que estar completo
  (`rss` + `seo` + `nav`) o el build revienta en `siteConfigToOpts`
  (dereferencia esos campos sin `?.`).
- **RSS** (`useAstroCreateRssEndpoint`): `src/pages/rss.xml.ts` — posts del
  blog (fechas reales) + videos (fecha ancla demo documentada en el archivo).
- **Paths** (`useAstroPathsFrom` / `useAstroPathsFromValues`): `getStaticPaths`
  de `videos/ep-[id]` y `blog/[slug]`.

## Recursos locales (anti-CDN-bloqueado)

`public/fonts/` (3 TTF variables), `@fortawesome/fontawesome-free` (npm),
`htmx.org` (bundled vía `import` en `src/scripts/main.js`), `public/img/`
(45 JPG). Regla: **cero `<link>`/`<script>` a CDNs** — verificar con
`grep -rho 'https://[^"'\'' >]*' dist/client | sort -u` (vacío esperado).
