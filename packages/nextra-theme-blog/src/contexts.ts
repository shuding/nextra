'use client'

import { useContext } from 'react'
import { ThemeConfigContext } from './theme-config'

export { ThemeProvider, useTheme } from 'next-themes'

export const useThemeConfig = () => useContext(ThemeConfigContext)
