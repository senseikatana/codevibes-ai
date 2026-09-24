import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Markdown blog posts in src/content/blog/*.md — swap with your real posts.
// JSON files (site, author, videos, products, services) are imported directly.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    minutes: z.number().default(5),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { blog };
