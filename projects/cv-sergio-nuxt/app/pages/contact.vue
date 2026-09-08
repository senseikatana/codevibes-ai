<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  message: '',
})

const loading = ref(false)
const submitted = ref(false)

const handleSubmit = async () => {
  loading.value = true
  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 1000))
  submitted.value = true
  loading.value = false
}
</script>

<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold mb-8">Contacto</h1>

    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <p class="text-gray-300 mb-6">
          ¿Tienes un proyecto en mente o quieres colaborar? ¡Me encantaría saber de ti!
        </p>

        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-envelope" class="text-primary-400" />
            <span>sergio@codevibes.dev</span>
          </div>
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-map-pin" class="text-primary-400" />
            <span>Buenos Aires, Argentina</span>
          </div>
        </div>

        <div class="flex gap-4 mt-8">
          <UButton
            icon="i-simple-icons-github"
            color="gray"
            variant="outline"
            to="https://github.com/senseikatana"
            target="_blank"
          />
          <UButton
            icon="i-simple-icons-linkedin"
            color="gray"
            variant="outline"
            to="https://linkedin.com/in/sergioesteban"
            target="_blank"
          />
        </div>
      </div>

      <UCard v-if="!submitted">
        <UForm :state="form" @submit="handleSubmit">
          <UFormGroup label="Nombre" name="name" class="mb-4">
            <UInput v-model="form.name" placeholder="Tu nombre" />
          </UFormGroup>

          <UFormGroup label="Email" name="email" class="mb-4">
            <UInput v-model="form.email" type="email" placeholder="tu@email.com" />
          </UFormGroup>

          <UFormGroup label="Mensaje" name="message" class="mb-4">
            <UTextarea v-model="form.message" placeholder="Tu mensaje..." :rows="5" />
          </UFormGroup>

          <UButton type="submit" block :loading="loading">
            Enviar mensaje
          </UButton>
        </UForm>
      </UCard>

      <UCard v-else class="text-center">
        <UIcon name="i-heroicons-check-circle" class="text-4xl text-green-400 mb-4" />
        <h3 class="text-xl font-semibold mb-2">¡Mensaje enviado!</h3>
        <p class="text-gray-400">Te responderé lo antes posible.</p>
      </UCard>
    </div>
  </UContainer>
</template>
