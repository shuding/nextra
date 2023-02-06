import type { ReactElement } from 'react'

import { SunIcon, MoonIcon } from 'nextra/icons'
import { useMounted } from 'nextra/hooks'
import { useTheme } from 'next-themes'
import cn from 'clsx'

import { Select } from './select'
import { useConfig } from '../contexts'
import { z } from 'zod'

type ThemeSwitchProps = {
  lite?: boolean
  className?: string
}
export const themeOptionSchema = z.object({
  key: z.enum(['light', 'dark', 'system']),
  name: z.string()
})

export type ThemeOption = z.infer<typeof themeOptionSchema>

export function ThemeSwitch({
  lite,
  className
}: ThemeSwitchProps): ReactElement {
  const { setTheme, resolvedTheme, theme = '' } = useTheme()
  const mounted = useMounted()
  const config = useConfig().themeSwitch
  const IconToUse = mounted && resolvedTheme === 'dark' ? MoonIcon : SunIcon
  const options =
    typeof config.options === 'function' ? config.options() : config.options

  return (
    <div className={cn('nx-relative', className)}>
      <Select
        title="Change theme"
        className="nx-w-full"
        options={options}
        onChange={option => {
          setTheme(option.key)
        }}
        selected={{
          key: theme,
          name: (
            <div className="nx-flex nx-items-center nx-gap-2 nx-capitalize">
              <IconToUse />
              <span className={lite ? 'md:nx-hidden' : ''}>
                {mounted ? theme : 'light'}
              </span>
            </div>
          )
        }}
      />
    </div>
  )
}
