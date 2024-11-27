import { defineConfig } from 'tsup'
import { defaultEntry } from '../nextra-theme-docs/tsup.config'
import packageJson from './package.json'
import { reactCompilerPlugin } from 'esbuild-react-compiler-plugin'

export default defineConfig([
  {
    name: packageJson.name,
    entry: defaultEntry,
    format: 'esm',
    dts: true,
    outExtension: () => ({ js: '.js' }),
    bundle: false,
    esbuildPlugins: [reactCompilerPlugin(/\.tsx?$/)]
  },
  {
    name: `${packageJson.name}/css`,
    entry: ['src/style.css']
  }
])
