import fs from 'node:fs/promises'
import path from 'node:path'
import type { PluginOptions as ReactCompilerConfig } from 'babel-plugin-react-compiler'
import reactCompilerLoader from 'react-compiler-webpack/dist/react-compiler-loader.js'
import type { Options } from 'tsup'

const DEFAULT_REACT_COMPILER_CONFIG: Partial<ReactCompilerConfig> = {
  sources(filename: string) {
    return !filename.includes('node_modules')
  },
  // panicThreshold: 'all_errors',
  target: '18',
  logger: {
    logEvent(filename, result) {
      if (!filename) {
        throw new Error('Missing filename')
      }
      const relativeFilePath = path.relative(process.cwd(), filename)
      if (result.kind === 'CompileSuccess') {
        console.info(
          '🚀 File',
          relativeFilePath,
          'was optimized with react-compiler'
        )
        return
      }
      console.error(
        '❌ File',
        relativeFilePath,
        'was not optimized with react-compiler'
      )
      console.error(result)
      if (process.env.NODE_ENV === 'production') {
        // eslint-disable-next-line unicorn/no-process-exit
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
