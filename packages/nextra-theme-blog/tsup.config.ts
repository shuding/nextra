import { defineConfig } from 'tsup'
import { defaultEntry } from '../nextra-theme-docs/tsup.config'

export default defineConfig({
  name: 'nextra-theme-blog',
  entry: [...defaultEntry, 'src/style.css', '!src/types.ts'],
  format: 'esm',
  dts: true,
  outExtension: () => ({ js: '.js' }),
  bundle: false
})
