import { defineConfig } from 'tsup'
import { defaultEntry } from '../nextra/default-entry.js'
import { IS_PRODUCTION } from '../nextra/src/server/constants.js'
import packageJson from './package.json'

export default defineConfig({
  name: packageJson.name,
  format: 'esm',
  dts: true,
  bundle: false,
  entry: defaultEntry,
  splitting: IS_PRODUCTION,
  clean: IS_PRODUCTION
})
