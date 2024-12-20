import fs from 'node:fs/promises'
import path from 'node:path'
import { reactCompilerPlugin } from 'esbuild-react-compiler-plugin'
import { defineConfig } from 'tsup'
import packageJson from './package.json'
import 'zx/globals'

export const defaultEntry = [
  'src/**/*.{ts,tsx}',
  '!**/*.d.ts',
  '!**/__tests__',
  '!**/*.{test,spec}.{ts,tsx}'
]

export default defineConfig({
  name: packageJson.name,
  entry: defaultEntry,
  format: 'esm',
  dts: true,
  outExtension: () => ({ js: '.js' }),
  bundle: false,
  esbuildPlugins: [reactCompilerPlugin({ filter: /\.tsx?$/ })],
  async onSuccess() {
    await $`npx @tailwindcss/cli -i src/style.css -o dist/style.css`
    const styleContent = await fs.readFile(
      path.resolve('dist', 'style.css'),
      'utf8'
    )
    await fs.writeFile(
      path.resolve('dist', 'style-prefixed.css'),
      styleContent
        .replaceAll('@layer utilities', '@layer v4-utilities')
        .replaceAll('@layer base', '@layer v4-base')
    )
    console.log('✅ `dist/style-prefixed.css` successfully created')
  }
})
