# Empresa Plana — Transport Públic de Catalunya

Dashboard administrativo con mapa Leaflet en tiempo real, CRUD de rutas/buses/paradas y simulación GPS.

## Estructura

```
src/
├── layouts/AppLayout.astro     ← Shell (sidebar + topbar + CSS)
├── pages/index.astro           ← Dashboard con todas las vistas
└── public/scripts/app.js       ← Lógica interactiva (client-side)
```

## Ejecutar

```bash
bun install
bun run dev      # → http://localhost:4321/
bun run build    # → dist/
```

## Vistas

- **Dashboard** — Stats, mini-mapa, notificaciones
- **Mapa en viu** — Leaflet con buses en movimiento
- **Rutes** — CRUD de líneas de autobús
- **Autobusos** — CRUD de flota
- **Parades** — CRUD de paradas
- **Horaris** — Horarios por ruta
- **Conductors** — Gestión de conductores
- **Notificacions** — Alertas del sistema
- **Reportes** — Gráficos de rendimiento

## Stack

- Astro (shell estático)
- Leaflet.js (mapa)
- Font Awesome (iconos)
- JavaScript vanilla (client-side)
