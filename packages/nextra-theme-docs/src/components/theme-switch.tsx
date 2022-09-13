import React, { ReactElement } from 'react'
import { useTheme } from 'next-themes'
import { Select } from './select'
import { SunIcon, MoonIcon } from 'nextra/icons'
import { useMounted } from 'nextra/hooks'

type ThemeSwitchProps = {
  lite?: boolean
}

export function ThemeSwitch({ lite }: ThemeSwitchProps): ReactElement {
  const { theme, setTheme, systemTheme } = useTheme()
  const renderedTheme = theme === 'system' ? systemTheme : theme
  const mounted = useMounted()
  const IconToUse = mounted && renderedTheme === 'dark' ? MoonIcon : SunIcon
  return (
  <div className="relative">
    <Select
      title="Change theme"
      onChange={option => {
        setTheme(option.key)
      }}
      selected={{
        key: theme || '',
        name: (
          <div className="flex items-center gap-2 capitalize">
            <IconToUse />
            <span className={lite ? 'md:hidden' : ''}>
              {mounted ? theme : 'light'}
            </span>
          </div>
        )
      }}
      options={[
        { key: 'light', name: 'Light' },
        { key: 'dark', name: 'Dark' },
        { key: 'system', name: 'System' }
      ]}
    />
  </div>
  )
}
