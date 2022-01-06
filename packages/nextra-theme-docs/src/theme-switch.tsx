import React from 'react'
import { useTheme } from 'next-themes'

import Menu from './select'
import Sun from './icons/sun'
import Moon from './icons/moon'

export default function ThemeSwitch({ lite = true }) {
  const { theme, setTheme, systemTheme } = useTheme()

  return (
    <Menu
      onChange={option => {
        setTheme(option.key)
      }}
      selected={{
        key: theme || '',
        name: (
          <div className="flex items-center gap-2 capitalize">
            {theme === 'dark' || systemTheme === 'dark' ? <Moon /> : <Sun />}
            {lite ? '' : <span>{theme}</span>}
          </div>
        )
      }}
      options={[
        {
          key: 'light',
          name: 'Light'
        },
        {
          key: 'dark',
          name: 'Dark'
        },
        {
          key: 'system',
          name: 'System'
        }
      ]}
    ></Menu>
  )
}
