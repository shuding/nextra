import { createContext, useContext, useRef } from 'react'
import type { Components } from './mdx'
import { MDXProvider, useMDXComponents } from './mdx.js'
import { jsxRuntime } from './remote/jsx-runtime.cjs'

const SSGContext = createContext<Record<string, any>>({})

export const useData = (key = 'ssg') => useContext(SSGContext)[key]

// Make sure nextra/data remains functional, but we now recommend this new API.

export const DataProvider = SSGContext.Provider

export function RemoteContent({
  components: dynamicComponents
}: {
  /**
   * An object mapping names to React components.
   * The key used will be the name accessible to MDX.
   *
   * For example: `{ ComponentName: Component }` will be accessible in the MDX as `<ComponentName/>`.
   */
  components?: Components
}) {
  const dynamicContext = useData('__nextra_dynamic_mdx')
  const resulRef = useRef()

  if (!dynamicContext) {
    throw new Error(
      'RemoteContent must be used together with the `buildDynamicMDX` API'
    )
  }

  if (!resulRef.current) {
    const hydrateFn = Reflect.construct(Function, [dynamicContext])
    resulRef.current = hydrateFn({ useMDXComponents, ...jsxRuntime })
  }

  const { default: MDXContent, frontMatter, useTOC } = resulRef.current as any
  const components = useMDXComponents(dynamicComponents)

  console.log(55, { frontMatter, toc: useTOC() })

  // wrapping the content with MDXProvider will allow us to customize the standard
  // markdown components (such as "h1" or "a") with the "components" object
  return (
    <MDXProvider
      components={{
        ...components,
        // Unset wrapper component and pass `toc` through
        // @ts-ignore
        wrapper: ({ children }) => children
      }}
    >
      <MDXContent />
    </MDXProvider>
  )
}
