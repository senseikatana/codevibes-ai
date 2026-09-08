<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold mb-8">Sobre Mí</h1>

    <div class="grid md:grid-cols-2 gap-8">
      <div class="space-y-6">
        <p class="text-lg text-gray-300">
          ¡Hola! Soy Sergio Esteban, un desarrollador Full Stack apasionado por crear
          experiencias digitales excepcionales.
        </p>

        <p class="text-gray-400">
          Con más de 5 años de experiencia en desarrollo web, me especializo en construir
          aplicaciones modernas utilizando tecnologías como Vue.js, Nuxt, Node.js y las
          mejores prácticas de la industria.
        </p>

        <p class="text-gray-400">
          Mi enfoque se centra en la arquitectura limpia, el código mantenible y la
          experiencia del usuario. Creo firmemente que el buen código es aquel que
          otros pueden entender y extender fácilmente.
        </p>

        <div class="flex gap-4">
          <UButton to="/resume/es/fullstack">
            Ver CV completo
          </UButton>
          <UButton to="/contact" variant="outline">
            Contactar
          </UButton>
        </div>
      </div>

      <div class="space-y-6">
        <UCard>
          <h3 class="font-semibold mb-4">Tecnologías principales</h3>
          <div class="flex flex-wrap gap-2">
            <UBadge v-for="tech in ['Vue.js', 'Nuxt', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']" :key="tech" color="primary">
              {{ tech }}
            </UBadge>
          </div>
        </UCard>

        <UCard>
          <h3 class="font-semibold mb-4">Intereses</h3>
          <ul class="space-y-2 text-gray-400">
            <li>• Arquitectura de software</li>
            <li>• Open source</li>
            <li>• DevOps y CI/CD</li>
            <li>• UI/UX Design</li>
          </ul>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
