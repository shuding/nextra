import fs from 'fs/promises'
import path from 'node:path'
import svgr from 'esbuild-plugin-svgr'
import { defineConfig } from 'tsup'
import { CWD } from './src/server/constants.js'

export default defineConfig([
  {
    name: 'nextra-esm',
    entry: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!src/types.ts',
      '!src/client/icons/**/*'
    ],
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

      const jsxRuntimeFrom = path.join(
        CWD,
        'src',
        'client',
        'remote',
        'jsx-runtime.cjs'
      )
      const jsxRuntimeTo = path.join(
        CWD,
        'dist',
        'client',
        'remote',
        'jsx-runtime.cjs'
      )

      await fs.copyFile(jsxRuntimeFrom, jsxRuntimeTo)
    }
  },
  {
    name: 'nextra-icons',
    entry: {
      'client/icons/index': 'src/client/icons/index.ts'
    },
    esbuildPlugins: [
      svgr({
        exportType: 'named',
        typescript: true
      })
    ],
    format: 'esm',
    target: 'es2020',
    treeshake: true,
    dts: true
  }
])
