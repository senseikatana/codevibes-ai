<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()

const navigation = [
  { label: 'Inicio', to: '/' },
  { label: 'CV', to: '/resume/es/fullstack' },
  { label: 'Blog', to: '/blog' },
  { label: 'Tienda', to: '/store' },
  { label: 'Contacto', to: '/contact' },
]
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <UHeader :links="navigation">
      <template #logo>
        <span class="text-xl font-bold">SE</span>
      </template>

      <template #right>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-shopping-cart"
          @click="cart.isOpen = true"
        >
          <UBadge v-if="cart.totalItems > 0" :label="cart.totalItems" color="primary" size="xs" class="ml-1" />
        </UButton>
        <UColorModeButton />
      </template>
    </UHeader>

    <CartSlideover />

    <main class="flex-1">
      <slot />
    </main>

    <UFooter>
      <template #left>
        <span class="text-sm text-gray-500">
          &copy; {{ new Date().getFullYear() }} Sergio Esteban
        </span>
      </template>

      <template #right>
        <UButton
          icon="i-simple-icons-github"
          color="gray"
          variant="ghost"
          to="https://github.com/senseikatana"
          target="_blank"
        />
        <UButton
          icon="i-simple-icons-linkedin"
          color="gray"
          variant="ghost"
          to="https://linkedin.com/in/sergioesteban"
          target="_blank"
        />
      </template>
    </UFooter>
  </div>
</template>
