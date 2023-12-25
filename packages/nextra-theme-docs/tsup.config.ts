import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'nextra-theme-docs',
  entry: ['src/index.tsx', 'css/styles.css'],
  dts: {
    entry: ['src/index.tsx']
  },
  outDir:"dist",
  format: 'esm',
  external: ['nextra'],
  outExtension: () => ({ js: '.js' })
})
