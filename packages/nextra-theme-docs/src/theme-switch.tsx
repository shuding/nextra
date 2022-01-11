import React from 'react'
import { useTheme } from 'next-themes'

import Menu from './select'
import Sun from './icons/sun'
import Moon from './icons/moon'

export default function ThemeSwitch({ lite = true }) {
  const { theme, setTheme, systemTheme } = useTheme()
  const renderedTheme = theme === 'system' ? systemTheme : theme
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    <Menu
      onChange={option => {
        setTheme(option.key)
      }}
      selected={{
        key: theme || '',
        name: mounted ? (
          <div className="flex items-center gap-2 capitalize">
            {renderedTheme === 'dark' ? <Moon /> : <Sun />}
            {lite ? '' : <span>{theme}</span>}
          </div>
        ) : (
          ''
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
