import { reactCompilerPlugin } from 'esbuild-react-compiler-plugin'
import { defineConfig } from 'tsup'
import { defaultEntry } from '../nextra-theme-docs/tsup.config'
import packageJson from './package.json'
import 'zx/globals'

export default defineConfig({
  name: packageJson.name,
  entry: defaultEntry,
  format: 'esm',
  dts: true,
  outExtension: () => ({ js: '.js' }),
  bundle: false,
  esbuildPlugins: [reactCompilerPlugin({ filter: /\.tsx?$/ })],
  async onSuccess() {
    // Use Tailwind CSS CLI because css processing by tsup produce different result
    await $`npx @tailwindcss/cli -i src/style.css -o dist/style.css`
  }
})
