# KILBURN — Landing

Landing editorial de KILBURN: reviews de tech sin filtro sponsor. Astro 7
estático + HTMX para fragmentos + Tailwind v4. Toda la data vive en
`src/content/` — cambiás JSON/Markdown y todo el sitio se actualiza.

## Características

- Astro 7 estático (`output: 'static'`), prerender a `dist/*.html`.
- Data layer en `src/content/`: `site.json`, `author.json`, `videos.json`,
  `products.json`, `services.json` + `blog/*.md` (content layer con loader
  `glob` + schema zod en `src/content.config.ts`).
- SEO/RSS/paths vía `katanakit-js@5.0.1` (`adapters/astro`): `useHeadTags`,
  `useAstroCreateRssEndpoint`, `useAstroPathsFrom` /
  `useAstroPathsFromValues`.
- Cero CDN: fuentes vendored en `public/fonts/`, Font Awesome local (npm),
  HTMX bundlado vía `import` en `src/scripts/main.js`, imágenes en
  `public/img/`.

## Requisitos previos

- [Bun](https://bun.com) v1.4+ (lockfile `bun.lock`).
- Node compatible como fallback (solo Bun está probado).

## Instalación

```bash
bun install
```

## Uso

```bash
bun run dev        # servidor local
bun run build      # build estático a dist/
bun run preview    # previsualizar el build
```

| Script              | Qué hace                                       |
| ------------------- | ---------------------------------------------- |
| `bun run dev`       | `astro dev` — servidor local                   |
| `bun run build`     | `astro build` — build estático                 |
| `bun run preview`   | `astro preview` — sirve `dist/`                |
| `bun run typecheck` | `tsc --noEmit`                                 |
| `bun run lint`      | `eslint .` (`lint:fix` lo arregla)             |
| `bun run format`    | `prettier --write .` (`format:check` verifica) |

## Estructura del proyecto

```text
src/
  content/        # data layer: site.json, author.json, videos.json,
                  # products.json, services.json, blog/*.md
  content.config.ts # colección blog (glob + zod)
  data/seo.ts     # SiteConfig → head tags (useHeadTags)
  layouts/Layout.astro # head + header/nav + footer (desde site.json)
  pages/          # rutas: index, videos/, blog/[slug], reviews/,
                  # picks, studio/, rss.xml.ts, api/
  scripts/main.js # HTMX + UI (acento por sección, menú, filtros)
  styles/         # global.css, main.css, fonts.css (@font-face)
public/
  fonts/          # 3 TTF variables (Bricolage, Space Grotesk, JetBrains Mono)
  img/            # 45 JPG locales
```

## Editar contenido

| Archivo         | Qué cambia                                                    |
| --------------- | ------------------------------------------------------------- |
| `site.json`     | marca, nav, mobileNav, hero, stats, marquee, footer, contacto |
| `author.json`   | retrato, bio, facts, principios (página studio)               |
| `videos.json`   | grilla de videos + páginas `ep-[id]`                          |
| `products.json` | grilla de picks                                               |
| `services.json` | servicios                                                     |
| `blog/*.md`     | posts (frontmatter: título, fecha, tags, minutos)             |

No hay CMS: son archivos planos con import directo (los JSON) o colección
Astro (el blog). Ver `DESIGN.md` para marca, tipografía y paleta.

## Modelo HTMX + Astro

- Astro prerendera el HTML completo de cada ruta en el build.
- HTMX (`hx-get`/`hx-target` en `src/scripts/main.js`) pide fragmentos
  (`/api/videos/[cat]`) y los swapea sin recargar la página.
- Sin hidratación de framework: JS mínimo del lado cliente, CSS/HTML del servidor.

## Política cero-CDN

Ningún `<link>`/`<script>` a CDNs externos. Todo se sirve local. Verificar
tras el build:

```bash
grep -rho 'https://[^"'"'"' >]*' dist/client | sort -u
```

Resultado esperado: vacío.

## Gotcha: SiteConfig completo

`src/data/seo.ts` arma el `SiteConfig` desde `content/*.json`. Tiene que
estar **completo** (`rss` + `seo` + `nav`) o el build revienta en
`siteConfigToOpts` (dereferencia esos campos sin `?.`). Si agregás un campo
al config de katanakit, agregalo también en `seo.ts`.

## Licencia

Privado — © KILBURN MEDIA LTD. Todos los derechos reservados.
