import React from 'react'
import { useTheme } from 'next-themes'

import Menu from './select'
import Sun from './icons/sun'
import Moon from './icons/moon'

export default function ThemeSwitch() {
  const { theme, setTheme, systemTheme } = useTheme()

  return (
    <Menu
      onChange={option => {
        setTheme(option.key)
      }}
      selected={{
        key: theme || '',
        name: theme === 'dark' || systemTheme === 'dark' ? <Moon /> : <Sun />
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
