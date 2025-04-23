import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    globals: true,
    testTimeout: 6000,
  }
})
