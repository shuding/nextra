import { defineConfig } from 'tsup'
import tsconfig from './tsconfig.json'

function outExtension() {
  return {
    js: `.js`
  }
}

const sharedConfig = defineConfig({
  format: 'esm',
  dts: true,
  outExtension,
  target: tsconfig.compilerOptions.target
})

export default defineConfig([
  {
    entry: [
      'src/components/bleed.tsx',
      'src/components/callout.tsx',
      'src/components/collapse.tsx',
      'src/components/tabs.tsx',
    ],
    name: 'nextra-theme-docs/components',
    ...sharedConfig
  },
  {
    name: 'nextra-theme-docs',
    entry: ['src/index.tsx'],
    ...sharedConfig
  }
])
