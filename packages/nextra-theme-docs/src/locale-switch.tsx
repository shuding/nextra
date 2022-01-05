import React from 'react'
import { useRouter } from 'next/router'

import Menu from './select'
import { DocsThemeConfig } from './types'
import Globe from './icons/globe'

interface LocaleSwitchProps {
  options: NonNullable<DocsThemeConfig['i18n']>
}
export default function LocaleSwitch({ options }: LocaleSwitchProps) {
  const router = useRouter()

  const { locale, asPath } = router
  const selected = options.find(l => locale === l.locale)!

  return (
    <Menu
      onChange={option => {
        router.push(asPath, asPath, {
          locale: option.key,
          scroll: false
        })
      }}
      selected={{
        key: selected.locale,
        name: (
          <div className="flex items-center gap-2">
            <Globe />
            <span>{selected.text}</span>
          </div>
        )
      }}
      options={options.map(l => ({
        key: l.locale,
        name: l.text
      }))}
    ></Menu>
  )
}
