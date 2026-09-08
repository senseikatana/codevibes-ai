<script setup lang="ts">
const features = [
  {
    title: 'Desarrollo Full Stack',
    description: 'Aplicaciones web modernas con Nuxt, Vue, Node.js y las últimas tecnologías.',
    icon: 'i-heroicons-code-bracket',
  },
  {
    title: 'Arquitectura Limpia',
    description: 'Código mantenible, escalable y siguiendo las mejores prácticas de la industria.',
    icon: 'i-heroicons-cube-transparent',
  },
  {
    title: 'UI/UX Excellence',
    description: 'Interfaces intuitivas y experiencias de usuario que enamoran.',
    icon: 'i-heroicons-paint-brush',
  },
]
</script>

<template>
  <div>
    <UHero
      title="Sergio Esteban"
      description="Full Stack Developer apasionado por crear experiencias digitales excepcionales."
    >
      <template #links>
        <UButton to="/resume/es/fullstack" size="lg">
          Ver CV
        </UButton>
        <UButton to="/contact" variant="outline" size="lg">
          Contactar
        </UButton>
      </template>
    </UHero>

    <UContainer class="py-16">
      <UPageGrid>
        <UPageCard
          v-for="feature in features"
          :key="feature.title"
          :title="feature.title"
          :description="feature.description"
          :icon="feature.icon"
        />
      </UPageGrid>
    </UContainer>
  </div>
</template>
