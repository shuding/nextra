import fs from 'fs/promises'
import path from 'node:path'
import svgr from 'esbuild-plugin-svgr'
import { defineConfig } from 'tsup'
import { CWD, IS_PRODUCTION } from './src/server/constants.js'

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
    splitting: IS_PRODUCTION,
    bundle: false,
    external: ['shiki', 'webpack'],
    async onSuccess() {
      // Fixes hydration errors in client apps due "type": "module" in root package.json
      const clientPackageJSON = path.join(CWD, 'dist', 'client', 'package.json')
      await fs.writeFile(clientPackageJSON, '{"sideEffects":false}')
    },
    plugins: [
      {
        // Strip `node:` prefix from imports because
        // Next.js only polyfills `path` and not `node:path` for browser
        name: 'strip-node-colon',
        renderChunk(code) {
          const replaced = code.replaceAll(
            / from "node:(?<moduleName>.*?)";/g,
            matched => matched.replace('node:', '')
          )
          return { code: replaced }
        }
      }
    ]
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
