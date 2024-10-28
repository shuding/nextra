import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    testTimeout: 10_000
  },
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/dist/**', '**/generated-*']
    }
  }
})
