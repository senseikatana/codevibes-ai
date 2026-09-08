<script setup lang="ts">
import { products } from '~~/data/products'

const socials = [
  { icon: 'i-simple-icons-github', to: 'https://github.com/senseikatana', label: 'GitHub' },
  { icon: 'i-simple-icons-linkedin', to: 'https://linkedin.com/in/sergioesteban', label: 'LinkedIn' },
]

const tags = ['#VUE', '#NUXT', '#TYPESCRIPT', '#NODEJS', '#CLEAN-ARCHITECTURE']

const featuredProducts = computed(() => products.filter(p => p.featured))
</script>

<template>
  <div>
    <!-- CTA Banner -->
    <div class="bg-primary text-white text-center py-3 text-sm">
      <NuxtLink to="/contact" class="hover:underline">
        Open to freelance work &mdash; Let's build something great together &rarr;
      </NuxtLink>
    </div>

    <!-- Hero Section -->
    <UContainer class="py-20">
      <div class="flex flex-col lg:flex-row items-center gap-12">
        <div class="flex-1">
          <h1 class="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Sergio Esteban
          </h1>
          <p class="text-xl text-gray-400 mb-4">
            Full Stack Developer building modern web experiences with clean code and solid architecture.
          </p>
          <div class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tag in tags"
              :key="tag"
              class="font-mono text-sm text-primary-400 bg-primary/10 px-2 py-1 rounded"
            >
              {{ tag }}
            </span>
          </div>
          <div class="flex gap-3">
            <UButton to="/es/resume/fullstack" size="lg">
              View Resume
            </UButton>
            <UButton to="/contact" variant="outline" size="lg">
              Get in Touch
            </UButton>
          </div>
          <div class="flex gap-3 mt-6">
            <UButton
              v-for="s in socials"
              :key="s.icon"
              :icon="s.icon"
              color="gray"
              variant="outline"
              :to="s.to"
              target="_blank"
              :aria-label="s.label"
            />
          </div>
        </div>

        <div class="flex-shrink-0">
          <div class="w-64 h-64 rounded-full bg-gray-800 border-4 border-primary/30 flex items-center justify-center">
            <UIcon name="i-lucide-user" class="text-6xl text-gray-600" />
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Featured Products -->
    <UContainer class="py-16">
      <h2 class="text-2xl font-bold mb-8">Featured Resources</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <UCard
          v-for="product in featuredProducts"
          :key="product.slug"
          class="hover:border-primary/50 transition-colors"
        >
          <template #header>
            <div class="aspect-video bg-gray-800 rounded-t-lg flex items-center justify-center">
              <UIcon name="i-lucide-shopping-bag" class="text-4xl text-gray-600" />
            </div>
          </template>

          <h3 class="font-semibold mb-2">
            <NuxtLink :to="`/store/${product.slug}`" class="hover:text-primary-400">
              {{ product.name }}
            </NuxtLink>
          </h3>
          <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ product.description }}</p>

          <div class="flex items-center justify-between">
            <span class="text-xl font-bold text-primary-400">
              ${{ product.price.toFixed(2) }}
            </span>
            <UButton :to="`/store/${product.slug}`" size="sm">
              View Details
            </UButton>
          </div>
        </UCard>
      </div>
      <div class="text-center mt-8">
        <UButton to="/store" variant="outline" size="lg">
          View All Resources &rarr;
        </UButton>
      </div>
    </UContainer>

    <!-- Tech Stack -->
    <UContainer class="py-16">
      <h2 class="text-2xl font-bold mb-8">Tech Stack</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="tech in ['Vue.js', 'Nuxt', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Tailwind CSS']"
          :key="tech"
          class="text-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <span class="font-medium">{{ tech }}</span>
        </div>
      </div>
    </UContainer>
  </div>
</template>
