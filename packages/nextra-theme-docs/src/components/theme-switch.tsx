import React, { ReactElement } from 'react'
import { useTheme } from 'next-themes'
import { Select } from './select'
import { SunIcon, MoonIcon } from 'nextra/icons'
import { useMounted } from 'nextra/hooks'

type ThemeSwitchProps = {
  lite?: boolean
}

const OPTIONS = [
  { key: 'light', name: 'Light' },
  { key: 'dark', name: 'Dark' },
  { key: 'system', name: 'System' }
]

export function ThemeSwitch({ lite }: ThemeSwitchProps): ReactElement {
  const { setTheme, resolvedTheme, theme = '' } = useTheme()
  const mounted = useMounted()
  const IconToUse = mounted && resolvedTheme === 'dark' ? MoonIcon : SunIcon
  return (
  <div className="relative">
    <Select
      title="Change theme"
      options={OPTIONS}
      onChange={option => {
        setTheme(option.key)
      }}
      selected={{
        key: theme,
        name: (
          <div className="flex items-center gap-2 capitalize">
            <IconToUse />
            <span className={lite ? 'md:hidden' : ''}>
              {mounted ? theme : 'light'}
            </span>
          </div>
        )
      }}
    />
  </div>
  )
}
