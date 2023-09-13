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
      path.join(CWD, 'src', 'server', 'theme.json'),
      path.join(CWD, 'dist', 'server', 'theme.json')
    )
    const filePath = path.join(CWD, 'dist', 'server', 'compile.js')
    const content = await fs.readFile(filePath, 'utf8')
    await fs.writeFile(
      filePath,
      content.replace(
        'import theme from "./theme.json"',
        'import theme from "./theme.json" assert { type: "json" }'
      )
    )
    // Fixes hydration errors in client apps due "type": "module" in root package.json
    const clientPackageJSON = path.join(CWD, 'dist', 'client', 'package.json')
    await fs.writeFile(clientPackageJSON, '{"sideEffects":false}')
  }
})
