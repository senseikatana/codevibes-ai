<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: post } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection('blog')
    .where('stem', '=', slug)
    .first()
)

if (!post.value) {
  throw createError({ statusCode: 404, message: 'Post no encontrado' })
}

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
})
</script>

<template>
  <UContainer v-if="post" class="py-12">
    <article class="max-w-3xl mx-auto">
      <header class="mb-8">
        <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
        <div class="flex items-center gap-4 text-gray-400">
          <span>{{ post.author }}</span>
          <time>{{ new Date(post.date).toLocaleDateString('es-AR') }}</time>
        </div>
        <div class="flex flex-wrap gap-2 mt-4">
          <UBadge v-for="tag in post.tags" :key="tag" color="primary" variant="soft">
            {{ tag }}
          </UBadge>
        </div>
      </header>

      <div class="prose prose-invert max-w-none">
        <ContentRenderer :value="post" />
      </div>

      <UButton to="/blog" variant="ghost" class="mt-8" icon="i-heroicons-arrow-left">
        Volver al Blog
      </UButton>
    </article>
  </UContainer>
</template>
