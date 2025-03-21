import { defineProject } from 'vitest/config';

export default defineProject({
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
});
