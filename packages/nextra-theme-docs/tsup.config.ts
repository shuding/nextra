import fs from 'node:fs/promises'
import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'nextra-theme-docs/css',
    entry: ['css/style.css']
  },
  {
    name: 'nextra-theme-docs',
    entry: ['src/**/*.{ts,tsx}'],
    external: ['nextra'],
    format: 'esm',
    dts: true,
    outExtension: () => ({ js: '.js' }),
    bundle: false,
    async onSuccess() {
      const layoutPath = './dist/layout.server.js'
      const layoutContent = await fs.readFile(layoutPath, 'utf8')
      await fs.writeFile(layoutPath, "import './style.css'\n" + layoutContent)
    }
  }
])
