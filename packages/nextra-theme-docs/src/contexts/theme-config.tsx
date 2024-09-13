'use client'

import type { ReactElement, ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { ThemeConfigProps } from '../layout'

const ThemeConfigContext = createContext<ThemeConfigProps>(null!)
ThemeConfigContext.displayName = 'ThemeConfig'
export const useThemeConfig = () => useContext(ThemeConfigContext)

export function ThemeConfigProvider({
  value,
  children
}: {
  value: ThemeConfigProps
  children: ReactNode
}): ReactElement {
  return (
    <ThemeConfigContext.Provider value={value}>
      {children}
    </ThemeConfigContext.Provider>
  )
}
