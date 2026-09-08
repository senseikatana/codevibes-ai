<script setup lang="ts">
import { profiles } from '~/data/profiles'

const route = useRoute()
const lang = route.params.lang as string
const profile = route.params.profile as string

const data = profiles[lang]?.[profile]

if (!data) {
  throw createError({ statusCode: 404, message: 'Profile not found' })
}

const skillLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    beginner: 'text-gray-400',
    intermediate: 'text-blue-400',
    advanced: 'text-green-400',
    expert: 'text-yellow-400',
  }
  return colors[level] || 'text-gray-400'
}
</script>

<template>
  <UContainer v-if="data" class="py-12">
    <UCard>
      <template #header>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold">{{ data.name }}</h1>
            <p class="text-xl text-primary-400">{{ data.title }}</p>
          </div>
          <div class="flex flex-col gap-1 text-sm text-gray-400">
            <span>{{ data.email }}</span>
            <span>{{ data.location }}</span>
          </div>
        </div>
      </template>

      <div class="space-y-8">
        <section>
          <h2 class="text-xl font-semibold mb-4">{{ lang === 'es' ? 'Resumen' : 'Summary' }}</h2>
          <p class="text-gray-300">{{ data.summary }}</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">{{ lang === 'es' ? 'Experiencia' : 'Experience' }}</h2>
          <div class="space-y-6">
            <div v-for="exp in data.experience" :key="exp.company" class="border-l-2 border-primary-500 pl-4">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <h3 class="font-semibold">{{ exp.role }}</h3>
                <span class="text-sm text-gray-400">{{ exp.period }}</span>
              </div>
              <p class="text-primary-400">{{ exp.company }}</p>
              <p class="text-gray-300 mt-2">{{ exp.description }}</p>
              <div class="flex flex-wrap gap-2 mt-3">
                <UBadge v-for="tech in exp.technologies" :key="tech" color="primary" variant="soft">
                  {{ tech }}
                </UBadge>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">{{ lang === 'es' ? 'Educación' : 'Education' }}</h2>
          <div class="space-y-4">
            <div v-for="edu in data.education" :key="edu.institution">
              <h3 class="font-semibold">{{ edu.degree }}</h3>
              <p class="text-primary-400">{{ edu.institution }}</p>
              <span class="text-sm text-gray-400">{{ edu.period }}</span>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">{{ lang === 'es' ? 'Habilidades' : 'Skills' }}</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="skill in data.skills" :key="skill.name" class="text-center">
              <p class="font-medium">{{ skill.name }}</p>
              <p :class="skillLevelColor(skill.level)" class="text-sm capitalize">
                {{ skill.level }}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">{{ lang === 'es' ? 'Idiomas' : 'Languages' }}</h2>
          <div class="flex flex-wrap gap-4">
            <div v-for="lang in data.languages" :key="lang.name">
              <span class="font-medium">{{ lang.name }}</span>
              <span class="text-gray-400 ml-2">({{ lang.level }})</span>
            </div>
          </div>
        </section>
      </div>
    </UCard>
  </UContainer>
</template>
