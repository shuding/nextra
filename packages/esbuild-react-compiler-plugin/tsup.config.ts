import { defineConfig } from 'tsup'
import { defaultEntry } from '../nextra-theme-docs/tsup.config.js'
import packageJson from './package.json'

export default defineConfig({
  name: packageJson.name,
  entry: defaultEntry,
  format: 'esm',
  dts: true,
  splitting: process.env.NODE_ENV === 'production',
  bundle: false
})
