import React, { memo, ReactElement } from 'react'
import { useTheme } from 'next-themes'
import { Select } from './select'
import { SunIcon, MoonIcon } from 'nextra/icons'
import useMounted from '../utils/use-mounted'

export function ThemeSwitch({ lite = true }): ReactElement {
  const { theme, setTheme, systemTheme } = useTheme()
  const renderedTheme = theme === 'system' ? systemTheme : theme
  const mounted = useMounted()

  return (
    <Select
      onChange={option => {
        setTheme(option.key)
      }}
      selected={{
        key: theme || '',
        name: (
          <div className="flex items-center gap-2 capitalize">
            {mounted && renderedTheme === 'dark' ? (
              <MoonIcon className="h-4 w-4 [&>path]:fill-current" />
            ) : (
              <SunIcon className="h-4 w-4 [&>path]:fill-current" />
            )}
            {lite ? '' : <span>{mounted ? theme : 'light'}</span>}
          </div>
        )
      }}
      options={[
        { key: 'light', name: 'Light' },
        { key: 'dark', name: 'Dark' },
        { key: 'system', name: 'System' }
      ]}
    />
  )
}

export default memo(ThemeSwitch)
