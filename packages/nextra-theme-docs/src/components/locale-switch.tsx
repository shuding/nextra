import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { Select } from './select'
import { DocsThemeConfig } from '../types'
import { GlobeIcon } from 'nextra/icons'

interface LocaleSwitchProps {
  options: NonNullable<DocsThemeConfig['i18n']>
}

export function LocaleSwitch({ options }: LocaleSwitchProps): ReactElement {
  const { locale, asPath } = useRouter()
  const selected = options.find(l => locale === l.locale)
  return (
    <Select
      onChange={option => {
        const date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        document.cookie = `NEXT_LOCALE=${
          option.key
        }; expires=${date.toUTCString()}; path=/`
        location.href = asPath
      }}
      selected={{
        key: selected?.locale || '',
        name: (
          <div className="flex items-center gap-2">
            <GlobeIcon />
            <span>{selected?.text}</span>
          </div>
        )
      }}
      options={options.map(l => ({
        key: l.locale,
        name: l.text
      }))}
    />
  )
}
