import { defineConfig } from 'tsup'

export default defineConfig([
  {
    name: 'nextra',
    entry: ['src/__temp__.cjs'],
    format: 'cjs',
    dts: false
  },
  {
    name: 'nextra-esm',
    entry: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/types.ts'],
    // import.meta is available only from es2020
    target: 'es2020',
    format: 'esm',
    dts: true,
    splitting: false,
    external: ['shiki', './__temp__', 'webpack']
  }
])
