import {
  createContext,
  useContext,
  ComponentClass, 
  FunctionComponent,
  createElement
} from 'react'
export const SSGContext = createContext<any>(false)
export const useSSG = (key = 'ssg') => useContext(SSGContext)?.[key]

export const withSSG = <T extends { ssg: boolean } = any>(
  Page: FunctionComponent<T> | ComponentClass<T>
) => {
  function WithSSG(props: T) {
    return createElement(
      SSGContext.Provider,
      { value: props },
      createElement(Page, props)
    )
  }
  WithSSG.getLayout = (Page as any).getLayout
  return WithSSG
}

// Make sure nextra/ssg remains functional, but we now recommend this new API.

export const DataContext = SSGContext
export const useData = useSSG
export const withData = withSSG
