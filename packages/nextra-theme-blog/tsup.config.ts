import { reactCompilerPlugin } from 'esbuild-react-compiler-plugin'
import { defineConfig } from 'tsup'
import { defaultEntry } from '../nextra-theme-docs/tsup.config'
import packageJson from './package.json'

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
    entry: ['src/style.css']
  }
])
