'use client'

import type { FC, ReactNode } from 'react'
import { useConfig, useThemeConfig } from '../../stores'

export const Switchers: FC<{ children: ReactNode }> = ({ children }) => {
  const { hideSidebar } = useConfig()
  const { i18n, darkMode } = useThemeConfig()

  if (hideSidebar && (darkMode || i18n.length)) {
    return children
  }
  return null
}
