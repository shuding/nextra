import React, {
  ComponentClass,
  createContext,
  FunctionComponent,
  useContext
} from 'react'

export const SSGContext = createContext<boolean>(false)
export const useSSG = () => useContext(SSGContext)

export const withSSG = <T extends { ssg: boolean } = any>(
  Page: FunctionComponent<T> | ComponentClass<T> | string
) => {
  return (props: T) => {
    return React.createElement(
      SSGContext.Provider,
      { value: props.ssg },
      React.createElement(Page, props)
    )
  }
}
