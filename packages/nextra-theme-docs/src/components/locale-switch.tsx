'use client'

import cn from 'clsx'
import { addBasePath } from 'next/dist/client/add-base-path'
import { usePathname } from 'next/navigation'
import { Select } from 'nextra/components'
import { GlobeIcon } from 'nextra/icons'
import type { FC } from 'react'
import { useThemeConfig } from '../stores'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

interface LocaleSwitchProps {
  lite?: boolean
  className?: string
}

export const LocaleSwitch: FC<LocaleSwitchProps> = ({ lite, className }) => {
  const { i18n } = useThemeConfig()
  const pathname = usePathname()
  if (!i18n.length) return null

  const [, locale] = pathname.split('/', 2)
  return (
    <Select
      title="Change language"
      className={cn('x:flex x:items-center x:gap-2', className)}
      onChange={lang => {
        const date = new Date(Date.now() + ONE_YEAR)
        document.cookie = `NEXT_LOCALE=${lang}; expires=${date.toUTCString()}; path=/`
        location.href = addBasePath(pathname.replace(`/${locale}`, `/${lang}`))
      }}
      value={locale!}
      selectedOption={
        <>
          <GlobeIcon height="12" />
          {!lite && i18n.find(l => locale === l.locale)?.name}
        </>
      }
      options={i18n.map(l => ({
        id: l.locale,
        name: l.name
      }))}
    />
  )
}
