import { defineConfig } from 'tsup'
import tsconfig from './tsconfig.json'

export default defineConfig({
  entry: ['src/index.tsx', 'src/cusdis.tsx', 'src/tags.tsx'],
  format: 'esm',
  dts: true,
  name: 'nextra-theme-blog',
  outExtension: () => ({ js: '.js' }),
  target: tsconfig.compilerOptions.target as 'es2016',
  external: ['nextra']
})
