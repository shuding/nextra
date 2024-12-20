import fs from 'node:fs/promises'
import path from 'node:path'
import reactCompilerLoader from 'react-compiler-webpack/dist/react-compiler-loader.js'
import type { Options } from 'tsup'

const DEFAULT_REACT_COMPILER_CONFIG = {
  sources(filename: string) {
    return !filename.includes('node_modules')
  },
  // panicThreshold: 'all_errors',
  target: '18',
  logger: {
    logEvent(
      filename: string,
      result: { kind: 'CompileError' | 'CompileSuccess' }
    ) {
      if (result.kind === 'CompileSuccess') {
        console.info('🚀 File', filename, 'was optimized with react-compiler')
        return
      }
      console.error(
        '❌ File',
        filename,
        'was not optimized with react-compiler'
      )
      console.error(result)
      if (process.env.NODE_ENV === 'production') {
        process.exit(1)
      }
    }
  }
}

export const reactCompilerPlugin = ({
  filter,
  config
}: {
  filter: RegExp
  config?: object
}): NonNullable<Options['esbuildPlugins']>[number] => ({
  name: 'react-compiler',
  setup(build) {
    config = {
      ...DEFAULT_REACT_COMPILER_CONFIG,
      ...config
    }

    build.onLoad({ filter }, async args => {
      const {
        contents = await fs.readFile(args.path),
        loader = path.extname(args.path).slice(1) as 'ts' | 'tsx'
      } = args.pluginData ?? {}
      return new Promise<{
        contents: string
        loader: 'ts' | 'tsx'
      }>((resolve, reject) => {
        function callback(error: Error | null, result?: string) {
          if (!result) {
            reject(error)
            return
          }
          resolve({ contents: result, loader })
        }

        reactCompilerLoader.call(
          {
            async: () => callback,
            getOptions: () => config,
            resourcePath: args.path
          },
          contents
        )
      })
    })
  }
})
