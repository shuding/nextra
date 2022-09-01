import React, { memo, ReactElement } from 'react'
import { useTheme } from 'next-themes'
import { Select } from './select'
import { SunIcon, MoonIcon } from 'nextra/icons'
import { useMounted } from '../utils'

type ThemeSwitchProps = {
  lite?: boolean
}

export function ThemeSwitch({ lite = false }: ThemeSwitchProps): ReactElement {
  const { theme, setTheme, systemTheme } = useTheme()
  const renderedTheme = theme === 'system' ? systemTheme : theme
  const mounted = useMounted()
  const IconToUse = mounted && renderedTheme === 'dark' ? MoonIcon : SunIcon
  return (
  <div className="relative">
    <Select
      position={lite ? 'right' : 'left'}
      onChange={option => {
        setTheme(option.key)
      }}
      selected={{
        key: theme || '',
        name: (
          <div className="flex items-center gap-2 capitalize">
            <IconToUse className="h-4 w-4 [&>path]:fill-current" />
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

export default memo(ThemeSwitch)
