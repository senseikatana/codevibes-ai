export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  image: string
  category: string
  stripePriceId: string
  featured: boolean
}

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Curso Nuxt 4 desde Cero',
    description: 'Aprende Nuxt 4 con las mejores prácticas, Composition API, y deployment en producción. Incluye 40+ horas de contenido.',
    price: 49.99,
    currency: 'USD',
    image: '/images/products/nuxt-course.jpg',
    category: 'cursos',
    stripePriceId: 'price_nuxt4_course',
    featured: true,
  },
  {
    id: 'prod-002',
    name: 'Template SaaS Nuxt',
    description: 'Starter kit completo para SaaS con autenticación, pagos, dashboard y panel de administración.',
    price: 79.99,
    currency: 'USD',
    image: '/images/products/saas-template.jpg',
    category: 'templates',
    stripePriceId: 'price_saas_template',
    featured: true,
  },
  {
    id: 'prod-003',
    name: 'E-book Arquitectura Limpia',
    description: 'Guía práctica sobre Clean Architecture, Hexagonal Architecture y Domain-Driven Design aplicados a proyectos reales.',
    price: 19.99,
    currency: 'USD',
    image: '/images/products/clean-arch-ebook.jpg',
    category: 'ebooks',
    stripePriceId: 'price_clean_arch_ebook',
    featured: false,
  },
  {
    id: 'prod-004',
    name: 'Componentes UI Premium',
    description: 'Librería de 50+ componentes Nuxt UI premium con dark mode, accesibilidad y documentación completa.',
    price: 39.99,
    currency: 'USD',
    image: '/images/products/ui-components.jpg',
    category: 'componentes',
    stripePriceId: 'price_ui_components',
    featured: true,
  },
  {
    id: 'prod-005',
    name: 'Mentoría 1:1 (1 hora)',
    description: 'Sesión personalizada de mentoría sobre desarrollo web, arquitectura, o resolución de problemas técnicos.',
    price: 59.99,
    currency: 'USD',
    image: '/images/products/mentoring.jpg',
    category: 'servicios',
    stripePriceId: 'price_mentoring_1h',
    featured: false,
  },
  {
    id: 'prod-006',
    name: 'Code Review Profesional',
    description: 'Revisión detallada de tu código con sugerencias de mejora, mejores prácticas y optimización de rendimiento.',
    price: 29.99,
    currency: 'USD',
    image: '/images/products/code-review.jpg',
    category: 'servicios',
    stripePriceId: 'price_code_review',
    featured: false,
  },
]

export const categories = [
  { id: 'all', label: 'Todos' },
  { id: 'cursos', label: 'Cursos' },
  { id: 'templates', label: 'Templates' },
  { id: 'ebooks', label: 'E-books' },
  { id: 'componentes', label: 'Componentes' },
  { id: 'servicios', label: 'Servicios' },
]
