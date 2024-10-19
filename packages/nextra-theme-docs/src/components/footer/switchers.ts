'use client'

import type { ReactNode } from 'react'
import { useConfig, useThemeConfig } from '../../stores'

export function Switchers({ children }: { children: ReactNode }) {
  const { hideSidebar } = useConfig()
  const { i18n, darkMode } = useThemeConfig()

  if (hideSidebar && (darkMode || i18n.length)) {
    return children
  }
  return null
}
