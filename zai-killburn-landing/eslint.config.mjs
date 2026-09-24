import astro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  // Ignore build output and generated types
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'backup/**'],
  },
  // Astro recommended (flat) — the parser treats hx-*, data-* and
  // hx-on::* as plain HTML attributes, so HTMX never trips rules here.
  ...astro.configs['flat/recommended'],
  // TypeScript inside Astro frontmatter (virtual *.astro/*.ts blocks)
  {
    files: ['**/*.astro/*.ts', '*.astro/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
  },
  // Client-side vanilla JS runs in the browser, not Bun/Node
  {
    files: ['src/scripts/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
];
