import { defineConfig } from 'tsup'

function outExtension() {
  return {
    js: `.js`
  }
}
export default defineConfig([
  {
    entry: ['src/bleed.tsx', 'src/callout.tsx'],
    format: 'esm',
    outExtension,
    dts: true,
    name: 'nextra-theme-docs/components'
  },
  {
    entry: ['src/index.tsx'],
    format: 'esm',
    outExtension,
    dts: true,
    name: 'nextra-theme-docs'
  },
  {
    entry: ['src/components/tabs.tsx'],
    format: 'esm',
    outExtension,
    dts: true,
    name: 'nextra-theme-docs/tabs'
  },
  {
    entry: ['src/components/collapse.tsx'],
    format: 'esm',
    outExtension,
    dts: true,
    name: 'nextra-theme-docs/collapse'
  }
])
