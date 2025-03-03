'use client'

import { createContext, useContext } from 'react'
import type { ThemeConfigProps } from '../layout'

const ThemeConfigContext = createContext<
  Omit<
    ThemeConfigProps,
    | 'footer'
    //
    | 'navbar'
    | 'pageMap'
    | 'nextThemes'
    | 'banner'
  >
>(null!)

export const useThemeConfig = () => useContext(ThemeConfigContext)

export const ThemeConfigProvider = ThemeConfigContext.Provider
