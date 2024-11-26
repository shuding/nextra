declare namespace globalThis {
  var pagefind: {
    search: <T>(query: string) => Promise<{
      results: {
        data: () => Promise<T>
        id: string
      }[]
    }>
    options: (opts: Record<string, unknown>) => Promise<void>
  }
}

declare module '*.svg' {
  export { ReactComponent } from './icon.js'
}

declare module 'next-mdx-import-source-file' {
  export { useMDXComponents } from 'nextra/mdx-components'
}

declare module 'react-compiler-webpack/dist/react-compiler-loader.js' {
  export default function reactCompilerLoader(
    source: string | Buffer
  ): Promise<void>
}
