declare namespace globalThis {
  import type { PagefindSearchOptions } from './types.js'
  var pagefind:
    | {
        // https://github.com/CloudCannon/pagefind/blob/2a0aa90cfb78bb8551645ac9127a1cd49cf54add/pagefind_web_js/lib/coupled_search.ts#L600
        debouncedSearch: <T>(
          term: string,
          options?: PagefindSearchOptions,
          debounceTimeoutMs?: number
        ) => Promise<{
          results: {
            data: () => Promise<T>
            id: string
          }[]
        } | null>
        options: (opts: Record<string, unknown>) => Promise<void>
      }
    | undefined
}

declare module '*.svg' {
  export { ReactComponent } from './icon.js'
}

declare module 'next-mdx-import-source-file' {
  // eslint-disable-next-line import/extensions -- false positive, should be without extension
  export { useMDXComponents } from 'nextra/mdx-components'
}
