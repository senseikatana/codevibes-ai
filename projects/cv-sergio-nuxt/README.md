# CV Sergio Nuxt

Portfolio, CV, Blog y Tienda de **Sergio Esteban** — construido con Nuxt 4, Nuxt UI v4, Nuxt Content, Pinia y Stripe.

**Live**: [senseikatana.com](https://senseikatana.com)

## Características

- **CV/Resume**: Páginas dinámicas multi-idioma (ES/EN) con perfiles flat
- **Blog**: CMS basado en archivos con Nuxt Content v3 (Markdown)
- **Tienda**: Catálogo de productos con carrito (Pinia) y checkout con Stripe
- **UI**: Nuxt UI v4, dark mode, paleta brand OKLCH
- **Testing**: Tests unitarios con Vitest
- **Slugs**: Generados con `useSlugify()` de KatanaKit (`katanakit-js`)

## Stack Tecnológico

- Nuxt 4 (compatibility version 4)
- Nuxt UI v4
- Nuxt Content v3
- Pinia
- Stripe
- KatanaKit (`katanakit-js`)
- Prisma (ORM — conexión a InsForge Postgres)
- Vitest
- TypeScript

## Brand Palette

| Color | Hex | Role |
|---|---|---|
| rose | #F43F5E | primary / error |
| teal | #38686B | secondary |
| emerald | #10B981 | success |
| yellow | #F6DC8E | warning |
| sky | #25ABE4 | info |
| dark | #11151C | neutral |
| white | #E4E4E7 | contrast |
| lavender | #8C86AA | accent |

See [DESIGN.md](./DESIGN.md) for full design system documentation.

## Configuración

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   bun install
   ```
3. Copiar `.env.example` a `.env` y configurar las variables de entorno
4. Ejecutar en modo desarrollo:
   ```bash
   bun run dev
   ```

## Scripts

| Script | Descripción |
|---|---|
| `bun run dev` | Servidor de desarrollo |
| `bun run build` | Build de producción |
| `bun run preview` | Preview del build |
| `bun run test` | Ejecutar tests |
| `bun run lint` | Lint con ESLint |

## Estructura

```
├── app/
│   ├── assets/css/     # Tokens y tema (main.css)
│   ├── components/     # Componentes Vue
│   ├── layouts/        # Layouts de la aplicación
│   ├── pages/          # Páginas (file-based routing)
│   └── stores/         # Stores de Pinia
├── content/
│   └── blog/           # Posts del blog en Markdown
├── data/
│   ├── products.ts     # Datos de productos (con useSlugify)
│   └── profiles.ts     # Datos del CV (flat array, multi-lang)
├── server/
│   └── api/            # API routes (Stripe webhooks, etc.)
├── prisma/
│   └── schema.prisma   # Prisma schema (InsForge Postgres)
└── tests/              # Tests con Vitest
```

## Deployment

```bash
bun run build
bun run preview
```

## Licencia

MIT
