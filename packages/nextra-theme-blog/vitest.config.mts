import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom'
  },
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**', '**/generated-*']
    }
  }
})
