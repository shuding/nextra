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
    // Fixes hydration errors in client apps due "type": "module" in root package.json
    const clientPackageJSON = path.join(CWD, 'dist', 'client', 'package.json')
    await fs.writeFile(clientPackageJSON, '{"sideEffects":false}')
  }
})
