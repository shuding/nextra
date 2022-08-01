import { defineConfig } from 'tsup'
import tsconfig from './tsconfig.json'

function outExtension() {
  return {
    js: `.js`
  }
}
const { target } = tsconfig.compilerOptions

const sharedConfig = defineConfig({
  format: 'esm',
  dts: true,
  outExtension,
  target
})
export default defineConfig([
  {
    entry: ['src/bleed.tsx', 'src/callout.tsx'],
    name: 'nextra-theme-docs/components',
    ...sharedConfig
  },
  {
    name: 'nextra-theme-docs',
    entry: ['src/index.tsx'],
    ...sharedConfig
  },
  {
    name: 'nextra-theme-docs/tabs',
    entry: ['src/components/tabs.tsx'],
    ...sharedConfig
  },
  {
    name: 'nextra-theme-docs/collapse',
    entry: ['src/components/collapse.tsx'],
    ...sharedConfig
  }
])
