import { createContext, useContext } from 'react'

const SSGContext = createContext<Record<string, any>>({})

export const useData = (key = 'ssg') => useContext(SSGContext)[key]

// Make sure nextra/hooks remains functional, but we now recommend this new API.

export const DataProvider = SSGContext.Provider
SSGContext.displayName = 'SSG'
