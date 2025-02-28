import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    testTimeout: 12_000,
    alias: {
      // to make pass `merge-meta-with-page-map.ts` test
      'next-mdx-import-source-file': path.resolve(
        'src/client/mdx-components.ts'
      )
    }
  },
  server: {
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        // Otherwise vitest will infinity re-run in watch mode
        '**/generated-*'
      ]
    }
  }
})
