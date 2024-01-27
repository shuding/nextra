'use client'

import { createContext, createElement } from 'react'
import type { NextraBlogTheme } from './types'

export const ThemeConfigContext = createContext<NextraBlogTheme>({})

export const ThemeConfigProvider = (props: any) => createElement(ThemeConfigContext.Provider, props)
