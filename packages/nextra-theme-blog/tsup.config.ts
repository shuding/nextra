import { defineConfig } from 'tsup'
import { defaultEntry } from '../nextra-theme-docs/tsup.config'
import packageJson from './package.json'

export default defineConfig([
  {
    name: packageJson.name,
    entry: [...defaultEntry, '!src/types.ts'],
    format: 'esm',
    dts: true,
    outExtension: () => ({ js: '.js' }),
    bundle: false
  },
  {
    name: `${packageJson.name}/css`,
    entry: ['src/style.css']
  }
])
