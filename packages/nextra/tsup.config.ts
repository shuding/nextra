import fs from 'node:fs/promises'
import path from 'node:path'
import svgr from 'esbuild-plugin-svgr'
import { reactCompilerPlugin } from 'esbuild-react-compiler-plugin'
import { defineConfig } from 'tsup'
import { defaultEntry } from '../nextra-theme-docs/tsup.config.js'
import packageJson from './package.json'
import { CWD, IS_PRODUCTION } from './src/server/constants.js'

const SEP = path.sep === '/' ? '/' : '\\\\'

const CLIENT_FILE_RE = new RegExp(
  String.raw`/nextra/src/client/.+$`.replaceAll('/', SEP)
)

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
      svgoConfig: {
        plugins: ['removeXMLNS']
      },
      plugins: ['@svgr/plugin-svgo'],
      jsx: {
        babelConfig: {
          plugins: [babelTransformImplicitReturnPlugin]
        }
      }
    }),
    reactCompilerPlugin(CLIENT_FILE_RE),
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

// Currently react-compiler does not support implicit return in arrow functions
// This plugin can be removed in the future when react-compiler supports it
function babelTransformImplicitReturnPlugin({ types: t }) {
  return {
    visitor: {
      ArrowFunctionExpression({ node }) {
        // Check if the function body is a single expression (i.e., implicit return)
        if (node.body.type === 'BlockStatement') return
        // Transform the body to a BlockStatement and wrap the expression with a return
        node.body = t.blockStatement([t.returnStatement(node.body)])
      }
    }
  }
}
