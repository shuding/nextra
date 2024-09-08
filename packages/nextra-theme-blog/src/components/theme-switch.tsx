'use client'

import { useTheme } from 'next-themes'
import { useMounted } from 'nextra/hooks'
import { MoonIcon, SunIcon } from 'nextra/icons'

export function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useTheme()
  const mounted = useMounted()
  const isDark = resolvedTheme === 'dark'

  // TODO: system theme
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const IconToUse = mounted && isDark ? MoonIcon : SunIcon

  return (
    <button
      aria-label="Toggle Dark Mode"
      className="_p-2"
      tabIndex={0}
      onClick={toggleTheme}
      onKeyDown={e => {
        if (e.key === 'Enter') toggleTheme()
      }}
    >
      <IconToUse height="14" />
    </button>
  )
}
