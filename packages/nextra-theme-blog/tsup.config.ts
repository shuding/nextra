import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.tsx', 'src/cusdis.tsx', 'src/tags.tsx'],
  format: 'esm',
  dts: true,
  name: 'nextra-theme-blog',
  outExtension: () => ({ js: '.js' }),
  external: ['nextra']
})
