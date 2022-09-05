import React, { memo, ReactElement } from 'react'
import { useTheme } from 'next-themes'
import { Select } from './select'
import { SunIcon, MoonIcon } from 'nextra/icons'
import { useMounted } from 'nextra/hooks'
import { useConfig } from '../contexts'

export function ThemeSwitch({ lite = true }): ReactElement {
  const { theme, setTheme, systemTheme } = useTheme()
  const renderedTheme = theme === 'system' ? systemTheme : theme
  const config = useConfig()
  const mounted = useMounted()

  return (
    <Select
      position={config.i18n.length > 0 ? (lite ? 'right' : 'left') : undefined}
      onChange={option => {
        setTheme(option.key)
      }}
      selected={{
        key: theme || '',
        name: (
          <div className="flex items-center gap-2 capitalize">
            {mounted && renderedTheme === 'dark' ? (
              <MoonIcon className="h-3 w-3 [&>path]:fill-current" />
            ) : (
              <SunIcon className="h-3 w-3 [&>path]:fill-current" />
            )}
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
  )
}

export default memo(ThemeSwitch)
