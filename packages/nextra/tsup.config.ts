import fs from 'node:fs/promises'
import path from 'node:path'
import svgr from 'esbuild-plugin-svgr'
import reactCompilerLoader from 'react-compiler-webpack/dist/react-compiler-loader.js'
import { defineConfig } from 'tsup'
import { defaultEntry } from '../nextra-theme-docs/tsup.config.js'
import packageJson from './package.json'
import { CWD, IS_PRODUCTION } from './src/server/constants.js'

export default defineConfig({
  name: packageJson.name,
  entry: [...defaultEntry, '!src/icon.ts', 'src/**/*.svg'],
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
  plugins: [
    {
      // Strip `node:` prefix from imports
      // Next.js only polyfills `path` and not `node:path` for browser
      name: 'strip-node-colon',
      renderChunk(code) {
        // (?<= from ")
        // Positive lookbehind asserts that the pattern we're trying to match is preceded by
        // ` from "`, but does not include ` from "` in the actual match.
        //
        // (?=";)
        // Positive lookahead asserts that the pattern is followed by `";`, but does not include
        // `";` in the match.
        const replaced = code.replaceAll(/(?<= from ")node:(.+)(?=";)/g, '$1')
        return { code: replaced }
      }
    },
    {
      // Strip `.svg` suffix from imports
      name: 'strip-dot-svg',
      renderChunk(code) {
        const replaced = code.replaceAll(/(?<= from ")(.+)\.svg(?=";)/g, '$1')
        return { code: replaced }
      }
    },
    {
      name: 'babel-transform',
      renderChunk(code, { path: resourcePath }) {
        const { resolve, promise, reject } = Promise.withResolvers<{
          code: string
        }>()

        reactCompilerLoader.call(
          {
            async: () =>
              function callback(error: Error | null, result?: string) {
                if (error) {
                  reject(error)
                } else {
                  resolve({ code: result! })
                }
              },
            getOptions: () => reactCompilerConfig,
            resourcePath
          },
          code
        )

        return promise
      }
    }
  ]
})

const ALLOWED_REACT_COMPILER_PATH = path.join(
  'nextra',
  'packages',
  'nextra',
  'dist',
  'client'
)

const reactCompilerConfig = {
  sources(filename: string) {
    return filename.includes(ALLOWED_REACT_COMPILER_PATH)
  },
  target: packageJson.devDependencies.react.slice(0, 2)
}
