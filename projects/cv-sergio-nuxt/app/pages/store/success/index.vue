<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()

onMounted(() => {
  cart.clearCart()
})
</script>

<template>
  <UContainer class="py-20 text-center">
    <UIcon name="i-lucide-check-circle" class="text-6xl text-green-400 mb-6" />

    <h1 class="text-3xl font-bold mb-4">Payment Successful!</h1>

    <p class="text-gray-400 mb-8">
      Thank you for your purchase. You'll receive an email with the details shortly.
    </p>

    <UButton to="/store" size="lg">
      Back to Store
    </UButton>
  </UContainer>
</template>
