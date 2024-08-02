import fs from 'fs/promises'
import path from 'node:path'
import svgr from 'esbuild-plugin-svgr'
import { defineConfig } from 'tsup'
import { CWD } from './src/server/constants.js'

export default defineConfig([
  {
    name: 'nextra',
    entry: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!src/types.ts',
      '!src/client/icons',
      '!**/__tests__',
      '!**/*.{test,spec}.{ts,tsx}'
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

      const jsxRuntimeFrom = path.join(CWD, 'src', 'client', 'jsx-runtime.cjs')
      const jsxRuntimeTo = path.join(CWD, 'dist', 'client', 'jsx-runtime.cjs')

      await fs.copyFile(jsxRuntimeFrom, jsxRuntimeTo)
    }
  },
  {
    name: 'nextra/icons',
    entry: {
      'client/icons/index': 'src/client/icons/index.ts'
    },
    esbuildPlugins: [
      svgr({
        exportType: 'named',
        typescript: true,
        jsx: {
          // svgo's removeXMLNS plugin doesn't work for some reason...
          babelConfig: {
            plugins: [
              [
                '@svgr/babel-plugin-remove-jsx-attribute',
                { elements: ['svg'], attributes: ['xmlns'] }
              ]
            ]
          }
        }
      })
    ],
    format: 'esm',
    target: 'es2020',
    treeshake: true,
    dts: true
  }
])
