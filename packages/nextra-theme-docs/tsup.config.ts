import type { Options } from 'tsup'
import { defineConfig } from 'tsup'

const config: Options = {
  external: ['nextra'],
  format: 'esm',
  dts: true,
  outExtension: () => ({ js: '.js' })
}

export default defineConfig([
  {
    name: 'nextra-theme-docs',
    entry: ['src/index.tsx'],
    ...config
  },
  {
    name: 'nextra-theme-docs/css',
    entry: ['css/style.css']
  },
  {
    name: 'nextra-theme-docs/mdx-components',
    entry: ['src/mdx-components/**/*.{ts,tsx}'],
    outDir: 'dist/mdx-components',
    ...config,
    bundle: false
  },
  {
    name: 'nextra-theme-docs/components',
    entry: ['src/components/collapse.tsx'],
    outDir: 'dist/components',
    ...config,
    bundle: false
  }
])
