import { defineConfig } from 'tsup'
import fs from 'node:fs/promises'

export default defineConfig([
  {
    name: 'nextra-theme-blog/css',
    entry: ['src/style.css']
  },
  {
    name: 'nextra-theme-blog',
    entry: ['src/**/*.{ts,tsx}'],
    external: ['nextra'],
    format: 'esm',
    dts: true,
    outExtension: () => ({ js: '.js' }),
    bundle: false,
    async onSuccess() {
      const layoutPath = './dist/index.js'
      const layoutContent = await fs.readFile(layoutPath, 'utf8')
      await fs.writeFile(layoutPath, "'use client';\nimport './style.css'\n" + layoutContent)
    }
  }
])
