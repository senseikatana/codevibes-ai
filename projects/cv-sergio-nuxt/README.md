# CV Sergio Nuxt

Portfolio, CV, Blog y Tienda construido con Nuxt 4, Nuxt UI, Nuxt Content, Pinia y Stripe.

## Características

- **CV/Resume**: Páginas dinámicas multi-idioma (ES/EN)
- **Blog**: CMS basado en archivos con Nuxt Content v3
- **Tienda**: Catálogo de productos con carrito y checkout con Stripe
- **UI**: Diseño moderno con Nuxt UI v4
- **Testing**: Tests unitarios con Vitest

## Stack Tecnológico

- Nuxt 4
- Nuxt UI v4
- Nuxt Content v3
- Pinia
- Stripe
- Vitest
- TypeScript

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

- `bun run dev` - Servidor de desarrollo
- `bun run build` - Build de producción
- `bun run preview` - Preview del build
- `bun run test` - Ejecutar tests
- `bun run lint` - Lint con ESLint

## Estructura

```
├── app/
│   ├── components/    # Componentes Vue
│   ├── layouts/       # Layouts de la aplicación
│   ├── pages/         # Páginas (file-based routing)
│   └── stores/        # Stores de Pinia
├── content/
│   └── blog/          # Posts del blog en Markdown
├── data/
│   ├── products.ts    # Datos de productos
│   └── profiles.ts    # Datos del CV
├── server/
│   └── api/           # API routes
└── tests/             # Tests
```

## Deployment

```bash
bun run build
bun run preview
```

## Licencia

MIT
