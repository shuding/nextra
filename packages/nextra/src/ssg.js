import React, { createContext, useContext } from 'react'

export const SSGContext = createContext({})
export const useSSG = () => useContext(SSGContext)

export const withSSG = Page => {
  return props => {
    return React.createElement(
      SSGContext.Provider,
      { value: props.ssg },
      React.createElement(Page, props)
    )
  }
}
