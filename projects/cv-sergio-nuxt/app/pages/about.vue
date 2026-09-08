<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold mb-8">About Me</h1>

    <div class="grid md:grid-cols-2 gap-8">
      <div class="space-y-6">
        <p class="text-lg text-gray-300">
          Hi! I'm Sergio Esteban, a Full Stack Developer passionate about creating
          exceptional digital experiences.
        </p>

        <p class="text-gray-400">
          With 5+ years of experience in web development, I specialize in building
          modern applications using technologies like Vue.js, Nuxt, Node.js and
          industry best practices.
        </p>

        <p class="text-gray-400">
          My approach focuses on clean architecture, maintainable code, and user
          experience. I strongly believe that good code is code that others can
          easily understand and extend.
        </p>

        <div class="flex gap-4">
          <UButton to="/es/resume/fullstack">
            View Full Resume
          </UButton>
          <UButton to="/contact" variant="outline">
            Contact Me
          </UButton>
        </div>
      </div>

      <div class="space-y-6">
        <UCard>
          <h3 class="font-semibold mb-4">Core Technologies</h3>
          <div class="flex flex-wrap gap-2">
            <UBadge v-for="tech in ['Vue.js', 'Nuxt', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']" :key="tech" color="primary">
              {{ tech }}
            </UBadge>
          </div>
        </UCard>

        <UCard>
          <h3 class="font-semibold mb-4">Interests</h3>
          <ul class="space-y-2 text-gray-400">
            <li>• Software Architecture</li>
            <li>• Open Source</li>
            <li>• DevOps & CI/CD</li>
            <li>• UI/UX Design</li>
          </ul>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
