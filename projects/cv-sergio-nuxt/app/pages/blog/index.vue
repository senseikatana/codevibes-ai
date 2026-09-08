<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog')
    .where('published', '=', true)
    .order('date', 'DESC')
    .all()
)
</script>

<template>
  <UContainer class="py-12">
    <h1 class="text-3xl font-bold mb-8">Blog</h1>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <UCard
        v-for="post in posts"
        :key="post.id"
        class="hover:shadow-lg transition-shadow"
      >
        <template #header>
          <h2 class="text-xl font-semibold">
            <NuxtLink :to="`/blog/${post.stem}`" class="hover:text-primary-400">
              {{ post.title }}
            </NuxtLink>
          </h2>
        </template>

        <p class="text-gray-400 mb-4">{{ post.description }}</p>

        <div class="flex flex-wrap gap-2">
          <UBadge v-for="tag in post.tags" :key="tag" color="primary" variant="soft">
            {{ tag }}
          </UBadge>
        </div>

        <template #footer>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>{{ post.author }}</span>
            <time>{{ new Date(post.date).toLocaleDateString('es-AR') }}</time>
          </div>
        </template>
      </UCard>
    </div>

    <div v-if="!posts?.length" class="text-center py-12 text-gray-400">
      No hay posts publicados aún.
    </div>
  </UContainer>
</template>
