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

  // @ts-expect-error we don't care about missing `scope` and `frontmatter` props
  return <MDXRemote compiledSource={dynamicContext} components={components} />
}
