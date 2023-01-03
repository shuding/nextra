import { createContext, useContext } from 'react'

export const SSGContext = createContext<any>(false)
export const useSSG = (key = 'ssg') => useContext(SSGContext)?.[key]

// Make sure nextra/ssg remains functional, but we now recommend this new API.

export const DataContext = SSGContext
export const useData = useSSG

export const getDynamicMeta = async () => {
  if ((globalThis as any).__nextra_resolvePageMap__) {
    return {
      __nextra_pageMap: await (globalThis as any).__nextra_resolvePageMap__()
    }
  }
  return {}
}
