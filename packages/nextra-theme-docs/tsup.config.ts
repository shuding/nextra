import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'nextra-theme-docs/css',
    entry: ['src/style.css']
  },
  {
    name: 'nextra-theme-docs',
    entry: ['src/**/*.{ts,tsx}'],
    external: ['nextra'],
    format: 'esm',
    dts: true,
    outExtension: () => ({ js: '.js' }),
    bundle: false
  }
])
