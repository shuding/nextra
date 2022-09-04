import React from 'react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from 'nextra/icons'
import { useMounted } from 'nextra/hooks'

export default function ThemeSwitch() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const mounted = useMounted()
  const isDark = theme === 'dark' || resolvedTheme === 'dark'

  // @TODO: system theme
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const IconToUse = mounted && isDark ? MoonIcon : SunIcon

  return (
    <span
      role="button"
      aria-label="Toggle Dark Mode"
      className="cursor-pointer p-2 text-current"
      tabIndex={0}
      onClick={toggleTheme}
      onKeyDown={e => {
        if (e.key === 'Enter') toggleTheme()
      }}
    >
      <IconToUse className="w-5 h-5 [&>path]:fill-transparent" />
    </span>
  )
}
