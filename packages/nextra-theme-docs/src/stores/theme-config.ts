import { create } from 'zustand'
import type { DocsThemeConfig } from '../constants'
import { DEEP_OBJECT_KEYS, DEFAULT_THEME } from '../constants'

type ThemeConfigState = {
  themeConfig: DocsThemeConfig
  setThemeConfig: (themeConfig: ThemeConfigState['themeConfig']) => void
}

export const useThemeConfigStore = create<ThemeConfigState>(set => ({
  themeConfig: DEFAULT_THEME,
  setThemeConfig: themeConfig =>
    set(({ themeConfig: prevThemeConfig }) => ({
      themeConfig: {
        ...prevThemeConfig,
        ...(themeConfig &&
          Object.fromEntries(
            Object.entries(themeConfig).map(([key, value]) => [
              key,
              value &&
              typeof value === 'object' &&
              DEEP_OBJECT_KEYS.includes(key)
                ? // @ts-expect-error -- key has always object value
                  { ...prevThemeConfig[key], ...value }
                : value
            ])
          ))
      }
    }))
}))
