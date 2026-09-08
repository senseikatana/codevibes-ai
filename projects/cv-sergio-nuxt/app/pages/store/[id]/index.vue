<script setup lang="ts">
import { products } from '~/data/products'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const cart = useCartStore()

const product = computed(() => products.find(p => p.id === route.params.id))

if (!product.value) {
  throw createError({ statusCode: 404, message: 'Producto no encontrado' })
}

useSeoMeta({
  title: product.value.name,
  description: product.value.description,
})

const addToCart = () => {
  if (product.value) {
    cart.addItem(product.value)
  }
}
</script>

<template>
  <UContainer v-if="product" class="py-12">
    <div class="grid md:grid-cols-2 gap-8">
      <div class="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
        <UIcon name="i-heroicons-shopping-bag" class="text-6xl text-gray-600" />
      </div>

      <div>
        <UBadge color="primary" variant="soft" class="mb-4">
          {{ product.category }}
        </UBadge>

        <h1 class="text-3xl font-bold mb-4">{{ product.name }}</h1>

        <p class="text-gray-300 mb-6">{{ product.description }}</p>

        <div class="text-4xl font-bold text-primary-400 mb-8">
          ${{ product.price.toFixed(2) }}
        </div>

        <div class="flex gap-4">
          <UButton size="lg" @click="addToCart">
            <UIcon name="i-heroicons-shopping-cart" class="mr-2" />
            Agregar al carrito
          </UButton>

          <UButton size="lg" variant="outline" to="/store">
            Volver a la tienda
          </UButton>
        </div>
      </div>
    </div>
  </UContainer>
</template>
