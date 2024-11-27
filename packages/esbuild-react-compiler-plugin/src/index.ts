import fs from 'node:fs/promises'
import path from 'node:path'
// @ts-expect-error
import reactCompilerLoader from 'react-compiler-webpack/dist/react-compiler-loader.js'
import type { Options } from 'tsup'

const reactCompilerConfig = {
  sources(_filename: string) {
    return true
  },
  target: '18'
}

export const reactCompilerPlugin = (
  filter: RegExp
): NonNullable<Options['esbuildPlugins']>[number] => ({
  name: 'react-compiler',
  setup(build) {
    build.onLoad({ filter }, async args => {
      // Read the file content
      const code = await fs.readFile(args.path)
      return new Promise<{
        contents: string
        loader: 'ts' | 'tsx'
      }>((resolve, reject) => {
        reactCompilerLoader.call(
          {
            async: () =>
              function callback(error: Error | null, result?: string) {
                if (error) {
                  reject(error)
                } else {
                  const loader = path.extname(args.path).slice(1) as
                    | 'ts'
                    | 'tsx'
                  const relativePath = path.relative(process.cwd(), args.path)

                  if (
                    /^import \{ c as _c } from "react-compiler-runtime";/m.test(
                      result!
                    )
                  ) {
                    console.info(
                      '🚀 File',
                      relativePath,
                      'was optimized with react-compiler'
                    )
                  } else if (!/^'use no memo'/m.test(result!)) {
                    console.error(
                      '❌ File',
                      relativePath,
                      'was not optimized with react-compiler'
                    )
                    // console.log(result)
                    // process.exit(1)
                  }

                  resolve({
                    contents: result!,
                    loader // Mark the file as a JSX file
                  })
                }
              },
            getOptions: () => reactCompilerConfig,
            resourcePath: args.path
          },
          code
        )
      })
    })
  }
})
