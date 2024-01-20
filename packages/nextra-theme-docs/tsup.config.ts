import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'nextra-theme-docs',
  entry: {
    index: 'src/index.tsx',
    style: 'css/styles.css'
  },
  dts: {
    entry: ['src/index.tsx']
  },
  outDir: 'dist',
  format: 'esm',
  external: ['nextra'],
  outExtension: () => ({ js: '.js' })
})
