'use client'

import cn from 'clsx'
import { LocaleSwitch } from '../locale-switch'
import { ThemeSwitch } from '../theme-switch'
import { useConfig, useThemeConfig } from '../../contexts'

export function Switchers() {
  const { hideSidebar } = useConfig()
  const themeConfig = useThemeConfig()
  return (
    <div
      className={cn(
        '_mx-auto _flex _max-w-[90rem] _gap-2 _py-2 _px-4',
        hideSidebar && (themeConfig.i18n.length > 0 || themeConfig.darkMode)
          ? '_flex'
          : '_hidden'
      )}
    >
      <LocaleSwitch />
      {themeConfig.darkMode && <ThemeSwitch />}
    </div>
  )
}
