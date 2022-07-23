import { defineConfig } from 'tsup'
export default defineConfig([{
  entry: [
    'src/index.ts',
    'src/ssg.ts',
    'src/locales.ts',
    'src/context.ts'
  ],
  format: 'cjs',
  name: 'nextra',
  external: ['next/server'],
  dts: true,
},
{
  entry: ['src/loader.ts'],
  format: 'esm',
  name: 'nextra-loader',
  dts: true,
},
{
  entry: ['src/compile.ts'],
  format: 'esm',
  name: 'compile',
  dts: true,
}, {
  entry: ['src/icons.ts'],
  name: 'icons',
  format: 'esm',
  dts: true,
}])