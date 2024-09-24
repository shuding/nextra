'use client'

import { useTheme } from 'next-themes'
import { Select } from 'nextra/components'
import { useMounted } from 'nextra/hooks'
import { MoonIcon, SunIcon } from 'nextra/icons'
import type { ReactElement } from 'react'
import { useThemeConfig } from '../stores'

type ThemeSwitchProps = {
  lite?: boolean
  className?: string
}

export function ThemeSwitch({
  lite,
  className
}: ThemeSwitchProps): ReactElement | null {
  const { setTheme, resolvedTheme, theme } = useTheme()
  const mounted = useMounted()
  const config = useThemeConfig()
  if (!config.darkMode) {
    return null
  }
  const IconToUse = mounted && resolvedTheme === 'dark' ? MoonIcon : SunIcon
  const { options } = config.themeSwitch
  const id = mounted ? (theme as keyof typeof options) : 'light'
  return (
    <Select
      className={className}
      title="Change theme"
      options={[
        { id: 'light', name: options.light },
        { id: 'dark', name: options.dark },
        { id: 'system', name: options.system }
      ]}
      onChange={setTheme}
      value={id}
      selectedOption={
        <span className="_flex _items-center _gap-2 _capitalize">
          <IconToUse height="12" />
          <span className={lite ? 'md:_hidden' : ''}>{options[id]}</span>
        </span>
      }
    />
  )
}
