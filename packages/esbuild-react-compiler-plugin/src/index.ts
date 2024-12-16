import fs from 'node:fs/promises'
import path from 'node:path'
import reactCompilerLoader from 'react-compiler-webpack/dist/react-compiler-loader.js'
import type { Options } from 'tsup'

const reactCompilerConfig = {
  sources(_filename: string) {
    return true
  },
  target: '18'
}

export const reactCompilerPlugin = ({
  filter
}: {
  filter: RegExp
}): NonNullable<Options['esbuildPlugins']>[number] => ({
  name: 'react-compiler',
  setup(build) {
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
          const relativePath = path.relative(process.cwd(), args.path)

          if (
            /^import \{ c as _c } from "react-compiler-runtime";/m.test(result)
          ) {
            console.info(
              '🚀 File',
              relativePath,
              'was optimized with react-compiler'
            )
          } else if (!/^'use no memo'/m.test(result)) {
            console.error(
              '❌ File',
              relativePath,
              'was not optimized with react-compiler'
            )
            console.log(result)
          }

          resolve({ contents: result, loader })
        }

        reactCompilerLoader.call(
          {
            async: () => callback,
            getOptions: () => reactCompilerConfig,
            resourcePath: args.path
          },
          contents
        )
      })
    })
  }
})
