# CV Digital — Sergio Jurado (Nuxt 4 + Nuxt UI)

Portfolio profesional multilingüe con blog, tienda y CV digital. Construido con **Nuxt 4**, **Nuxt UI v4**, **Nuxt Content v3**, **Pinia** y **Stripe**.

## Stack

| Capa | Paquete | Versión |
|------|---------|---------|
| Framework | `nuxt` | ^4.5.0 |
| UI + CSS | `@nuxt/ui` + `tailwindcss` | ^4.11.0 |
| Blog | `@nuxt/content` | ^3.16.0 |
| State | `pinia` + `@pinia/nuxt` | ^3.0.0 |
| Pagos | `stripe` | ^17.0.0 |
| Toolkit | `katanakit-js` | ^2.2.1 |

## Estructura del proyecto

```
cv-sergio-nuxt/
├── app/
│   ├── app.vue                          ← <UApp><NuxtPage /></UApp>
│   ├── assets/css/main.css              ← @import "tailwindcss"; @import "@nuxt/ui";
│   ├── layouts/
│   │   └── default.vue                  ← UHeader + slot + UFooter
│   ├── pages/
│   │   ├── index.vue                    ← Homepage (hero + secciones)
│   │   ├── about.vue                    ← Sobre mí (bio + timeline)
│   │   ├── contact.vue                  ← Contacto (UForm)
│   │   ├── blog/
│   │   │   ├── index.vue                ← Listado posts
│   │   │   └── [slug].vue              ← Post individual
│   │   ├── store/
│   │   │   ├── index.vue                ← Catálogo productos
│   │   │   └── [id].vue                 ← Detalle producto
│   │   └── resume/
│   │       └── [lang]/
│   │           ├── index.vue            ← Home CV
│   │           └── [profile].vue        ← Perfil CV
│   ├── components/
│   │   ├── AppHeader.vue                ← UNavigationMenu + Theme + Cart badge
│   │   ├── AppFooter.vue                ← UFooter
│   │   ├── CartSlideover.vue            ← USlideover (carrito)
│   │   ├── ProductCard.vue              ← UCard (producto)
│   │   └── LangSwitcher.vue             ← USelect (idioma)
│   ├── composables/
│   │   ├── useFormat.ts                 ← useFormatCurrency, useFormatNumber
│   │   └── useSearch.ts                 ← useDebounce para búsqueda
│   ├── stores/
│   │   └── cart.ts                      ← Pinia store (carrito)
│   ├── data/
│   │   ├── resume.ts                    ← Datos CV (migrados del proyecto Astro)
│   │   └── products.ts                  ← Productos tienda
│   └── utils/
│       └── logger.ts                    ← useLog wrapper
├── content/
│   └── blog/
│       ├── hola-mundo.md
│       └── que-es-nuxt.md
├── server/
│   ├── plugins/
│   │   └── api.ts                       ← useInit (registrar APIs)
│   └── api/
│       └── checkout.post.ts             ← Stripe checkout (useUnwrap + useSafeResponse)
├── public/
│   └── images/
│       ├── sergio.jpg
│       └── products/
├── tests/
│   ├── composables/
│   │   └── useFormat.test.ts
│   ├── stores/
│   │   └── cart.test.ts
│   └── server/
│       └── checkout.test.ts
├── nuxt.config.ts
├── app.config.ts
├── package.json
└── README.md
```

## Páginas y rutas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Homepage | Hero con nombre + roles + CTA |
| `/about` | About | Bio, skills (UBadge), timeline (UTimeline) |
| `/resume` | CV home | Redirect a `/resume/es` |
| `/resume/[lang]` | CV por idioma | ES / CA / EN |
| `/resume/[lang]/[profile]` | Perfil CV | logistica / fullstack / generico |
| `/blog` | Blog listado | Posts desde Nuxt Content |
| `/blog/[slug]` | Post individual | Markdown renderizado |
| `/store` | Tienda | Catálogo de productos |
| `/store/[id]` | Detalle producto | Info + agregar al carrito |
| `/store?success=true` | Post-pago | Confirmación de compra |

## Componentes Nuxt UI v4 utilizados

| Componente | Uso |
|------------|-----|
| `UApp` | Root wrapper (obligatorio para Toast, Tooltip) |
| `UNavigationMenu` | Navbar principal |
| `UButton` | CTAs, acciones |
| `UCard` | Productos, posts, perfil CV |
| `UBadge` | Skills, tags, precio |
| `USlideover` | Drawer del carrito |
| `UForm`, `UFormField` | Formulario de contacto |
| `UInput`, `UTextarea` | Inputs del formulario |
| `UInputNumber` | Cantidad de producto |
| `USelect` | Selector de idioma |
| `UPageHero`, `UPageSection` | Secciones homepage |
| `UBlogPost`, `UBlogPosts` | Listado blog |
| `UPageHeader` | Header de páginas internas |
| `UTimeline` | Timeline de experiencia |
| `UTabs` | Selector de perfiles CV |
| `UColorModeButton` | Toggle dark/light |
| `UContainer` | Layout responsive |
| `UFooter` | Footer del sitio |

## KatanaKit: qué se usa y por qué

### Server-side: Safe Result pattern

```ts
// server/api/checkout.post.ts
import { useUnwrap, useSafeResponse } from 'katanakit-js/adapters/nuxt'

export default defineEventHandler(async (event) => {
  const result = await processPayment(items)
  return useSafeResponse(result)  // { data, error, status }
})
```

**Por qué**: Safe Result es testing-friendly. En tests, no necesitas mockear throws — solo asserts `result.ok === true`.

### Storage SSR-safe

```ts
// app/stores/cart.ts
import { useCreateStorageSignal } from 'katanakit-js'

const items = useCreateStorageSignal<CartItem[]>('cart', [])
// Funciona en SSR (in-memory) y en cliente (localStorage)
```

**Por qué**: `useLocalStorage` de vueuse necesita `process.client` checks. KatanaKit lo maneja internamente con Strategy pattern.

### Formateo consistente

```ts
// app/composables/useFormat.ts
import { useFormatCurrency, useFormatNumber } from 'katanakit-js'

export function useFormat() {
  const formatPrice = (n: number) => useFormatCurrency(n, { currency: 'EUR', locale: 'es-ES' })
  const formatQty = (n: number) => useFormatNumber(n, { locale: 'es-ES' })
  return { formatPrice, formatQty }
}
```

**Por qué**: Consistencia garantizada. En tests, puedes hacer `expect(formatPrice(120)).toBe('120,00 €')`.

### Debounce sin dependencias

```ts
// app/composables/useSearch.ts
import { useDebounce } from 'katanakit-js'

export function useSearch() {
  const query = ref('')
  const debouncedQuery = useDebounce(query, 300)
  return { query, debouncedQuery }
}
```

**Por qué**: Zero-dependency. En tests, puedes controlar el timer con `vi.useFakeTimers()`.

## KatanaKit vs Nuxt: tabla comparativa completa

| Funcionalidad | KatanaKit | Nuxt/Nuxt UI | Mejor para SDD/TDD |
|---|---|---|---|
| HTTP server | `useGet/usePost` → Safe Result | `ofetch` → throws | **KatanaKit** (assertions con `.ok`) |
| HTTP client | `useKatanaFetch` | `useFetch/useAsyncData` | **Nuxt** (más integrado) |
| API URLs | `useBuildUrl` | Manual | **KatanaKit** (previene SSRF) |
| Storage | `useCreateStorageSignal` | `useLocalStorage` | **KatanaKit** (SSR-safe sin config) |
| Formateo moneda | `useFormatCurrency` | `Intl.NumberFormat` manual | **KatanaKit** (wrapper consistente) |
| UUID | `useUuid` | `crypto.randomUUID()` | **Nuxt** (menos abstracción) |
| Debounce | `useDebounce` | No hay built-in | **KatanaKit** (zero-dep) |
| Logging | `useLog` (Strategy) | `console.*` | **KatanaKit** (pluggable, testeable) |
| Errores | Error factory | `createError` (H3) | **Nuxt** (estándar Nitro) |
| API responses | `useUnwrap/useSafeResponse` | Return directo | **KatanaKit** (patrón consistente) |
| SEO | `useHeadTags` | `useHead/useSeoMeta` | **Nuxt** (integración nativa) |
| Theme | `useInitTheme` | `useColorMode` + Nuxt UI | **Nuxt** (ya resuelto) |
| Dates | `useFormat` (Temporal) | `useDateFormat` (vueuse) | **KatanaKit** (Temporal API) |
| Slugs | `useSlugify` | Manual | **KatanaKit** (consistente) |
| Workers | `useRun/useCreatePool` | No hay | **KatanaKit** (no hay alternativa) |

## Desarrollo

```bash
bun install
bun run dev       # http://localhost:3000
bun run build     # Build para producción
bun run preview   # Preview del build
bun run test      # Vitest
bun run lint      # ESLint
```

## Testing (TDD)

El proyecto usa **Vitest** para tests unitarios:

- `tests/composables/useFormat.test.ts` — Tests de formateo
- `tests/stores/cart.test.ts` — Tests del carrito (Pinia)
- `tests/server/checkout.test.ts` — Tests de la API route

### Patrón de testing con Safe Result

```ts
// tests/server/checkout.test.ts
import { describe, it, expect, vi } from 'vitest'

describe('checkout API', () => {
  it('returns payment URL on success', async () => {
    // Arrange
    vi.mock('stripe', () => ({
      default: vi.fn().mockImplementation(() => ({
        checkout: { sessions: { create: vi.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/...' }) } }
      }))
    }))

    // Act
    const result = await processPayment([{ name: 'Test', price: 100, qty: 1 }])

    // Assert — Safe Result pattern
    expect(result.ok).toBe(true)
    expect(result.data.url).toContain('checkout.stripe.com')
  })

  it('returns error on payment failure', async () => {
    // Arrange
    vi.mock('stripe', () => ({
      default: vi.fn().mockImplementation(() => ({
        checkout: { sessions: { create: vi.fn().mockRejectedValue(new Error('Card declined')) } }
      }))
    }))

    // Act
    const result = await processPayment([{ name: 'Test', price: 100, qty: 1 }])

    // Assert — no throw, solo check .ok
    expect(result.ok).toBe(false)
    expect(result.error.message).toBe('Card declined')
  })
})
```

## Arquitectura y patrones

- **SDD (Spec-Driven Development)**: Cada feature empieza por el contrato de tipos en `app/data/*.ts`
- **TDD**: Tests antes de implementar (Vitest)
- **Safe Result**: Toda operación asíncrona retorna `{ data, error, ok, status }` — no throws
- **Strategy Pattern**: Storage, logging y formateo son intercambiables via KatanaKit
- **Hexagonal**: Lógica de negocio separada de framework (KatanaKit core) y UI (Nuxt)

## Créditos

- [Nuxt 4](https://nuxt.com)
- [Nuxt UI v4](https://ui.nuxt.com)
- [Nuxt Content v3](https://content.nuxtjs.org)
- [KatanaKit](https://www.npmjs.com/package/katanakit-js)
- [Stripe](https://stripe.com)
