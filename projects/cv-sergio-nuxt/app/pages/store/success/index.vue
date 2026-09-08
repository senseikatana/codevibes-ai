<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()

onMounted(() => {
  cart.clearCart()
})
</script>

<template>
  <UContainer class="py-20 text-center">
    <UIcon name="i-heroicons-check-circle" class="text-6xl text-green-400 mb-6" />

    <h1 class="text-3xl font-bold mb-4">¡Pago exitoso!</h1>

    <p class="text-gray-400 mb-8">
      Gracias por tu compra. Recibirás un email con los detalles.
    </p>

    <UButton to="/store" size="lg">
      Volver a la tienda
    </UButton>
  </UContainer>
</template>
