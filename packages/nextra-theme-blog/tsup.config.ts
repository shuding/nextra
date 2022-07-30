import { defineConfig } from 'tsup'
import tsconfig from './tsconfig.json'
function outExtension() {
  return {
    js: `.js`
  }
}

export default defineConfig({
  entry: ['src/index.tsx'],
  format: 'esm',
  dts: true,
  name: 'nextra-theme-blog',
  outExtension,
  target: tsconfig.compilerOptions.target
})
