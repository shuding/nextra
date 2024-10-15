declare module 'title' {
  export default function title(
    title: string,
    special?: {
      special: string[]
    }
  )
}

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
  import type { FC, SVGProps } from 'react'
  export const ReactComponent: FC<SVGProps<SVGElement>>
}

declare module 'next-mdx-import-source-file' {
  export { useMDXComponents } from 'nextra/mdx'
}
