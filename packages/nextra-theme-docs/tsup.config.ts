import fs from 'node:fs/promises'
import path from 'node:path'
import { reactCompilerPlugin } from 'esbuild-react-compiler-plugin'
import { defineConfig } from 'tsup'
import packageJson from './package.json'

export const defaultEntry = [
  'src/**/*.{ts,tsx}',
  '!**/*.d.ts',
  '!**/__tests__',
  '!**/*.{test,spec}.{ts,tsx}'
]

export default defineConfig([
  {
    name: packageJson.name,
    entry: defaultEntry,
    format: 'esm',
    dts: true,
    outExtension: () => ({ js: '.js' }),
    bundle: false,
    esbuildPlugins: [reactCompilerPlugin({ filter: /\.tsx?$/ })]
  },
  {
    name: `${packageJson.name}/css`,
    entry: ['src/style.css'],
    async onSuccess() {
      const styleContent = await fs.readFile(
        path.resolve('dist', 'style.css'),
        'utf8'
      )
      await fs.writeFile(
        path.resolve('dist', 'style-prefixed.css'),
        styleContent
          .replaceAll('@layer utilities', '@layer v4-utilities')
          .replaceAll('@layer base', '@layer v4-base')
          .replace(
            '@layer theme, base, components, utilities',
            '@layer theme, v4-base, components, v4-utilities'
          )
      )
      console.log('✅ `dist/style-prefixed.css` successfully created')
    }
  }
])
