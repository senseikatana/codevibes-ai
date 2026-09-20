# SINGHA — Nacida del Oro

Landing page con scrollytelling y video ligado al scroll. Construido con Astro.

## Estructura

```
src/
├── layouts/BaseLayout.astro   ← Layout + CSS global
├── pages/index.astro          ← Home (scrollytelling + 3 vistas SPA)
└── public/scripts/app.js      ← Motor de scroll + router
```

## Ejecutar

```bash
bun install
bun run dev      # → http://localhost:4321/
bun run build    # → dist/
```

## Características

- Video de fondo sincronizado con el scroll
- Router SPA por hash (#/nosotros, #/contacto)
- Loader con barra de progreso
- Formulario de contacto con validación
- FAQ acordeón
- Contadores animados
- Burbujas decorativas
- Parallax en números ghost
