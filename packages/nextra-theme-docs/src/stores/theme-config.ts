import { create } from 'zustand'
import type { DocsThemeConfig } from '../constants'
import { DEEP_OBJECT_KEYS, DEFAULT_THEME } from '../constants'

type ThemeConfigState = {
  themeConfig: DocsThemeConfig
}

export const useThemeConfigStore = create<ThemeConfigState>(() => ({
  themeConfig: DEFAULT_THEME
}))

export const setThemeConfig = (themeConfig: ThemeConfigState['themeConfig']) =>
  useThemeConfigStore.setState(({ themeConfig: prevThemeConfig }) => ({
    themeConfig: {
      ...prevThemeConfig,
      ...(themeConfig &&
        Object.fromEntries(
          Object.entries(themeConfig).map(([key, value]) => [
            key,
            value && typeof value === 'object' && DEEP_OBJECT_KEYS.includes(key)
              ? // @ts-expect-error -- key has always object value
                { ...prevThemeConfig[key], ...value }
              : value
          ])
        ))
    }
  }))
