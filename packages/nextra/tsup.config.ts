import fs from 'node:fs/promises'
import path from 'node:path'
import svgr from 'esbuild-plugin-svgr'
import { reactCompilerPlugin } from 'esbuild-react-compiler-plugin'
import { defineConfig } from 'tsup'
import { defaultEntry } from './default-entry.js'
import packageJson from './package.json'
import { IS_PRODUCTION } from './src/server/constants.js'

const SEP = path.sep === '/' ? '/' : '\\\\'

export default defineConfig({
  name: packageJson.name,
  entry: [...defaultEntry, '!src/icon.ts', 'src/**/*.svg'],
  format: 'esm',
  dts: true,
  splitting: IS_PRODUCTION,
  clean: IS_PRODUCTION,
  bundle: false,
  external: ['shiki', 'webpack'],
  async onSuccess() {
    // Fixes hydration errors in client apps due "type": "module" in root package.json
    const clientPackageJSON = path.resolve('dist', 'client', 'package.json')
    await fs.writeFile(clientPackageJSON, '{"sideEffects":false}')
  },
  esbuildPlugins: [
    svgr({
      exportType: 'named',
      typescript: true,
      svgoConfig: {
        plugins: ['removeXMLNS']
      },
      plugins: ['@svgr/plugin-svgo']
    }),
    reactCompilerPlugin({
      filter: new RegExp(
        String.raw`/nextra/src/client/.+$`.replaceAll('/', SEP)
      )
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
    }
  ]
})
