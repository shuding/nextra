import { createContext, PropsWithChildren, useContext } from 'react'
import React from 'react'
const SsgContext = createContext<any>({})

export const useSSG = () => useContext(SsgContext)

export const SggProvider = ({
  children,
  ssg
}: PropsWithChildren<{ ssg: any }>) => {
  return <SsgContext.Provider value={ssg}>{children}</SsgContext.Provider>
}
