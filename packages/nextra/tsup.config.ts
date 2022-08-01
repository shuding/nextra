import { defineConfig } from 'tsup'
import tsconfig from './tsconfig.json'
const { target } = tsconfig.compilerOptions

export default defineConfig([
  {
    name: 'nextra',
    entry: ['src/index.js'],
    format: 'cjs',
    dts: false,
    target
  },
  {
    name: 'nextra-utils',
    entry: ['src/ssg.ts', 'src/locales.ts', 'src/context.ts'],
    format: 'cjs',
    external: ['next/server'],
    dts: true,
    target
  },
  {
    name: 'nextra-loader',
    entry: ['src/loader.ts'],
    format: 'esm',
    dts: true,
    target
  },
  {
    entry: ['src/compile.ts'],
    format: 'esm',
    name: 'nextra-mdx-compiler',
    dts: true,
    target
  },
  {
    entry: ['src/icons.ts'],
    name: 'nextra-icons',
    format: 'esm',
    dts: true,
    target
  },
  {
    entry: ['src/types.ts'],
    name: 'nextra-types',
    dts: {
      only: true
    }
  }
])
