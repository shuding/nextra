import fs from 'fs/promises'
import path from 'node:path'
import { defineConfig } from 'tsup'
import { CWD } from './src/server/constants.js'

export default defineConfig({
  name: 'nextra-esm',
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/types.ts'],
  target: 'es2020',
  format: 'esm',
  dts: true,
  splitting: false,
  bundle: false,
  external: ['shiki', 'webpack'],
  async onSuccess() {
    await fs.copyFile(
      path.join(CWD, 'src', 'server', '__temp__.cjs'),
      path.join(CWD, 'dist', 'server', '__temp__.cjs')
    )
    // this fixes hydration errors in client apps
    await fs.writeFile(
      path.join(CWD, 'dist', 'client', 'package.json'),
      '{"sideEffects":false}'
    )
  }
})
