import { defineConfig } from 'tsup'
import tsconfig from './tsconfig.json'

const { target } = tsconfig.compilerOptions

export default defineConfig([
  {
    name: 'nextra',
    entry: ['src/index.js', 'src/__temp__.ts'],
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
      'src/ssg.tsx',
      'src/locales.ts',
      'src/context.ts',
      'src/layout.tsx',
      'src/setup-page.ts',
      'src/remote.ts',
      'src/mdx.ts'
    ],
    format: 'esm',
    dts: true,
    target,
    external: ['shiki', './__temp__']
  },
  {
    entry: ['src/types.ts'],
    name: 'nextra-types',
    dts: {
      only: true
    }
  }
])
