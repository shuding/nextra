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
    name: 'nextra-esm',
    entry: [
      'src/hooks/index.ts',
      'src/loader.ts',
      'src/compile.ts',
      'src/icons/index.ts',
      'src/components/index.ts',
      'src/ssg.ts',
      'src/locales.ts',
      'src/context.ts'
    ],
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
