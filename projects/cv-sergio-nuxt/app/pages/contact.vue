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
  await new Promise(resolve => setTimeout(resolve, 1000))
  submitted.value = true
  loading.value = false
}
</script>

<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold mb-8">Contact</h1>

    <div class="grid md:grid-cols-2 gap-8">
      <div>
        <p class="text-gray-300 mb-6">
          Have a project in mind or want to collaborate? I'd love to hear from you!
        </p>

        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-mail" class="text-primary-400" />
            <span>sergio@codevibes.dev</span>
          </div>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-map-pin" class="text-primary-400" />
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
          <UFormGroup label="Name" name="name" class="mb-4">
            <UInput v-model="form.name" placeholder="Your name" />
          </UFormGroup>

          <UFormGroup label="Email" name="email" class="mb-4">
            <UInput v-model="form.email" type="email" placeholder="you@email.com" />
          </UFormGroup>

          <UFormGroup label="Message" name="message" class="mb-4">
            <UTextarea v-model="form.message" placeholder="Your message..." :rows="5" />
          </UFormGroup>

          <UButton type="submit" block :loading="loading">
            Send Message
          </UButton>
        </UForm>
      </UCard>

      <UCard v-else class="text-center">
        <UIcon name="i-lucide-check-circle" class="text-4xl text-green-400 mb-4" />
        <h3 class="text-xl font-semibold mb-2">Message Sent!</h3>
        <p class="text-gray-400">I'll get back to you as soon as possible.</p>
      </UCard>
    </div>
  </UContainer>
</template>
