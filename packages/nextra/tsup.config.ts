import { defineConfig } from 'tsup'
export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: 'cjs',
    name: 'nextra',
    dts: false
  },
  {
    entry: ['src/ssg.ts', 'src/locales.ts', 'src/context.ts'],
    format: 'cjs',
    name: 'nextra-utils',
    external: ['next/server'],
    dts: true
  },
  {
    entry: ['src/loader.ts'],
    format: 'esm',
    name: 'nextra-loader',
    dts: true
  },
  {
    entry: ['src/compile.ts'],
    format: 'esm',
    name: 'nextra-mdx-compiler',
    dts: true
  },
  {
    entry: ['src/icons.ts'],
    name: 'nextra-icons',
    format: 'esm',
    dts: true
  },
  {
    entry: ['src/types.ts'],
    name: 'nextra-types',
    dts: {
      only: true
    }
  }
])
