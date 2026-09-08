<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()

const checkoutLoading = ref(false)

const handleCheckout = async () => {
  checkoutLoading.value = true
  try {
    const { data } = await useFetch('/api/checkout', {
      method: 'POST',
      body: {
        items: cart.items.map(item => ({
          priceId: item.product.stripePriceId,
          quantity: item.quantity,
        })),
      },
    })

    if (data.value?.url) {
      await navigateTo(data.value.url, { external: true })
    }
  } catch (error) {
    console.error('Checkout error:', error)
  } finally {
    checkoutLoading.value = false
  }
}
</script>

<template>
  <USlideover v-model="cart.isOpen">
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 class="text-xl font-bold">Carrito</h2>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark"
          @click="cart.isOpen = false"
        />
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="cart.items.length === 0" class="text-center py-8 text-gray-400">
          Tu carrito está vacío
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.product.id"
            class="flex gap-4 p-4 bg-gray-800/50 rounded-lg"
          >
            <div class="flex-1">
              <h3 class="font-semibold">{{ item.product.name }}</h3>
              <p class="text-sm text-gray-400">
                ${{ item.product.price.toFixed(2) }} x {{ item.quantity }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <UButton
                size="xs"
                color="gray"
                variant="soft"
                icon="i-heroicons-minus"
                @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
              />
              <span class="w-8 text-center">{{ item.quantity }}</span>
              <UButton
                size="xs"
                color="gray"
                variant="soft"
                icon="i-heroicons-plus"
                @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
              />
              <UButton
                size="xs"
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
                @click="cart.removeItem(item.product.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="cart.items.length > 0" class="p-4 border-t border-gray-800">
        <div class="flex justify-between mb-4">
          <span class="text-lg font-semibold">Total</span>
          <span class="text-lg font-bold text-primary-400">
            ${{ cart.totalPrice.toFixed(2) }}
          </span>
        </div>

        <UButton
          block
          size="lg"
          :loading="checkoutLoading"
          @click="handleCheckout"
        >
          Proceder al pago
        </UButton>
      </div>
    </div>
  </USlideover>
</template>
