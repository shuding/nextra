import { reactCompilerPlugin } from 'esbuild-react-compiler-plugin'
import { defineConfig } from 'tsup'
import { defaultEntry } from '../nextra-theme-docs/tsup.config'
import packageJson from './package.json'
import 'zx/globals'

export default defineConfig(
  {
    name: packageJson.name,
    entry: defaultEntry,
    format: 'esm',
    dts: true,
    outExtension: () => ({ js: '.js' }),
    bundle: false,
    esbuildPlugins: [reactCompilerPlugin({ filter: /\.tsx?$/ })],
    async onSuccess() {
      // Use zx because css processing by tsup produce different result than tailwindcss cli
      await $`npx @tailwindcss/cli -i src/style.css -o dist/style.css`
    }
  },
)
