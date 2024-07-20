'use client'

import { useConfig, useThemeConfig } from '../../contexts'
import { LocaleSwitch } from '../locale-switch'
import { ThemeSwitch } from '../theme-switch'

export function Switchers() {
  const { hideSidebar } = useConfig()
  const { i18n, darkMode } = useThemeConfig()

  if (!hideSidebar || (!darkMode && !i18n.length)) {
    return null
  }

  return (
    <div className="_mx-auto _flex _max-w-[90rem] _gap-2 _py-2 _px-4">
      <LocaleSwitch />
      {darkMode && <ThemeSwitch />}
    </div>
  )
}
