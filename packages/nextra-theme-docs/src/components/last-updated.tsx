'use client'

import { usePathname } from 'next/navigation'
import type { FC, ReactNode } from 'react'
import { useThemeConfig } from '../stores'

export const LastUpdated: FC<{
  date?: Date
  children?: ReactNode
  locale?: string
}> = ({ date, children = 'Last updated on', locale = 'en' }) => {
  const { i18n } = useThemeConfig()
  const pathname = usePathname()

  if (!date) {
    return null
  }

  const dateLocale = i18n.length ? pathname.split('/', 2)[1] : locale
  return (
    <>
      {children}{' '}
      <time
        dateTime={date.toISOString()}
        // Can provoke React 418 error https://react.dev/errors/418
        suppressHydrationWarning
      >
        {date.toLocaleDateString(dateLocale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </time>
    </>
  )
}
