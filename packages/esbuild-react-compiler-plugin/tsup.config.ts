import { defineConfig } from 'tsup'
import packageJson from './package.json'

export default defineConfig({
  name: packageJson.name,
  entry: ['src/**/*.ts'],
  format: 'esm',
  dts: true,
  splitting: process.env.NODE_ENV === 'production',
  bundle: false
})
