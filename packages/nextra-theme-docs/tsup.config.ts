import fs from 'node:fs/promises'
import path from 'node:path'
import { reactCompilerPlugin } from 'esbuild-react-compiler-plugin'
import { defineConfig } from 'tsup'
import { $ } from 'zx'
import { defaultEntry } from '../nextra/default-entry.js'
import packageJson from './package.json'

export default defineConfig({
  name: packageJson.name,
  entry: defaultEntry,
  format: 'esm',
  dts: true,
  outExtension: () => ({ js: '.js' }),
  bundle: false,
  esbuildPlugins: [reactCompilerPlugin({ filter: /\.tsx?$/ })],
  async onSuccess() {
    // Use Tailwind CSS CLI because CSS processing by tsup produce different result
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
        .replace(
          '@layer theme, base, components, utilities',
          '@layer theme, v4-base, components, v4-utilities'
        )
    )
    console.log('✅ `dist/style-prefixed.css` successfully created')
  }
})
