'use client'

import type { ComponentProps } from 'react'
import { createContext, createElement, useContext } from 'react'
import type { ThemeConfigProps } from '../layout'

const ThemeConfigContext = createContext<ThemeConfigProps>(null!)

export const useThemeConfig = () => useContext(ThemeConfigContext)

export const ThemeConfigProvider = (
  props: ComponentProps<typeof ThemeConfigContext.Provider>
) => createElement(ThemeConfigContext.Provider, props)
