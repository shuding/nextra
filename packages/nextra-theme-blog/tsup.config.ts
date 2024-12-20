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
  }
})
