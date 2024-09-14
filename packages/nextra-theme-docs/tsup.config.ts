import { defineConfig } from 'tsup'

export const defaultEntry = [
  'src/**/*.{ts,tsx}',
  '!**/*.d.ts',
  '!**/__tests__',
  '!**/*.{test,spec}.{ts,tsx}'
] as const

export default defineConfig({
  name: 'nextra-theme-docs',
  entry: [...defaultEntry, 'src/style.css'],
  external: ['nextra'],
  format: 'esm',
  dts: true,
  outExtension: () => ({ js: '.js' }),
  bundle: false
})
