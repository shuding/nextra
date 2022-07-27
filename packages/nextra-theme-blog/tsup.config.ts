import { defineConfig } from 'tsup'

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
  outExtension
})
