import type { ReactElement, ReactNode } from 'react'
import { createContext, useContext, useRef } from 'react'
import type { DocsThemeConfig } from '../constants'
import { DEEP_OBJECT_KEYS, DEFAULT_THEME } from '../constants'

const ThemeConfigContext = createContext<DocsThemeConfig>(DEFAULT_THEME)
ThemeConfigContext.displayName = 'ThemeConfig'
export const useThemeConfig = () => useContext(ThemeConfigContext)

export function ThemeConfigProvider({
  value,
  children
}: {
  value: DocsThemeConfig
  children: ReactNode
}): ReactElement {
  const storeRef = useRef<DocsThemeConfig>()
  storeRef.current ||= {
    ...DEFAULT_THEME,
    ...(value &&
      Object.fromEntries(
        Object.entries(value).map(([key, value]) => [
          key,
          value && typeof value === 'object' && DEEP_OBJECT_KEYS.includes(key)
            ? // @ts-expect-error -- key has always object value
              { ...DEFAULT_THEME[key], ...value }
            : value
        ])
      ))
  }

  return (
    <ThemeConfigContext.Provider value={storeRef.current}>
      {children}
    </ThemeConfigContext.Provider>
  )
}
