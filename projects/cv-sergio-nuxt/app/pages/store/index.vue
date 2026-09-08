<script setup lang="ts">
import { products, categories } from '~~/data/products'

const selectedCategory = ref('all')

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') return products
  return products.filter(p => p.category === selectedCategory.value)
})
</script>

<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold mb-8">Store</h1>

    <div class="flex flex-wrap gap-2 mb-8">
      <UButton
        v-for="cat in categories"
        :key="cat.id"
        :variant="selectedCategory === cat.id ? 'solid' : 'outline'"
        color="primary"
        @click="selectedCategory = cat.id"
      >
        {{ cat.label }}
      </UButton>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <UCard
        v-for="product in filteredProducts"
        :key="product.slug"
        class="hover:border-primary/50 transition-colors"
      >
        <template #header>
          <div class="aspect-video bg-gray-800 rounded-t-lg flex items-center justify-center">
            <UIcon name="i-lucide-shopping-bag" class="text-4xl text-gray-600" />
          </div>
        </template>

        <h2 class="text-xl font-semibold mb-2">
          <NuxtLink :to="`/store/${product.slug}`" class="hover:text-primary-400">
            {{ product.name }}
          </NuxtLink>
        </h2>

        <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ product.description }}</p>

        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-primary-400">
            ${{ product.price.toFixed(2) }}
          </span>
          <UBadge v-if="product.featured" color="yellow" variant="soft">
            Featured
          </UBadge>
        </div>

        <template #footer>
          <UButton :to="`/store/${product.slug}`" block>
            View Details
          </UButton>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
