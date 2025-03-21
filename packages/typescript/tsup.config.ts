import { defineConfig } from 'tsup'
import { defaultEntry } from '../nextra/default-entry.js'
import packageJson from './package.json'

export default defineConfig({
  name: packageJson.name,
  format: 'esm',
  dts: true,
  bundle: false,
  entry: defaultEntry
})
