import { describe, it, expect } from 'vitest'
import { products, categories } from '~~/data/products'

describe('Products Data', () => {
  it('should have products', () => {
    expect(products.length).toBeGreaterThan(0)
  })

  it('should have categories', () => {
    expect(categories.length).toBeGreaterThan(0)
  })

  it('each product should have required fields', () => {
    products.forEach(product => {
      expect(product.id).toBeDefined()
      expect(product.slug).toBeDefined()
      expect(product.name).toBeDefined()
      expect(product.price).toBeGreaterThan(0)
      expect(product.stripePriceId).toBeDefined()
    })
  })

  it('slugs should be URL-friendly', () => {
    products.forEach(product => {
      expect(product.slug).not.toContain(' ')
      expect(product.slug).toBe(product.slug.toLowerCase())
    })
  })
})
