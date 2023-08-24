import { MDXRemote } from 'next-mdx-remote'
import { createContext, useContext } from 'react'
import type { Components } from './mdx'
import { useMDXComponents } from './mdx'

export const SSGContext = createContext<any>(false)
export const useSSG = (key = 'ssg') => useContext(SSGContext)?.[key]

// Make sure nextra/ssg remains functional, but we now recommend this new API.

export const DataContext = SSGContext
export const useData = useSSG

export function RemoteContent({
  components: dynamicComponents
}: {
  components?: Components
}) {
  const dynamicContext = useSSG('__nextra_dynamic_mdx')

  if (!dynamicContext) {
    throw new Error(
      'RemoteContent must be used together with the `buildDynamicMDX` API'
    )
  }
  const components = useMDXComponents(dynamicComponents)

  return <MDXRemote compiledSource={dynamicContext} components={components} />
}
