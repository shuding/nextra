import { MDXRemote } from 'next-mdx-remote'
import { createContext, useContext } from 'react'
import type { Components } from './mdx'
import { useMDXComponents } from './mdx.js'

const SSGContext = createContext<Record<string, any>>({})

export const useData = (key = 'ssg') => useContext(SSGContext)[key]

// Make sure nextra/data remains functional, but we now recommend this new API.

export const DataProvider = SSGContext.Provider

export function RemoteContent({
  components: dynamicComponents
}: {
  components?: Components
}) {
  const dynamicContext = useData('__nextra_dynamic_mdx')

  if (!dynamicContext) {
    throw new Error(
      'RemoteContent must be used together with the `buildDynamicMDX` API'
    )
  }
  const components = useMDXComponents(dynamicComponents)

  return (
    // @ts-expect-error we don't care about missing `scope` and `frontmatter` props
    <MDXRemote
      compiledSource={dynamicContext}
      components={{
        ...components,
        // Unset wrapper component and pass `toc` through
        wrapper: ({ children }) => children
      }}
    />
  )
}
