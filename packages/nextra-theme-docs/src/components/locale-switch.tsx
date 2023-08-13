import { addBasePath } from 'next/dist/client/add-base-path'
import { useRouter } from 'next/router'
import { GlobeIcon } from 'nextra/icons'
import type { ReactElement } from 'react'
import { useConfig } from '../contexts'
import { Select } from './select'

interface LocaleSwitchProps {
  lite?: boolean
  className?: string
}

export function LocaleSwitch({
  lite,
  className
}: LocaleSwitchProps): ReactElement | null {
  const config = useConfig()
  const { locale, asPath } = useRouter()

  const options = config.i18n
  if (!options.length) return null

  const selected = options.find(l => locale === l.locale)
  return (
    <Select
      title="Change language"
      className={className}
      onChange={option => {
        const date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        document.cookie = `NEXT_LOCALE=${
          option.key
        }; expires=${date.toUTCString()}; path=/`
        location.href = addBasePath(asPath)
      }}
      selected={{
        key: selected?.locale || '',
        name: (
          <span className="nx-flex nx-items-center nx-gap-2">
            <GlobeIcon />
            <span className={lite ? 'nx-hidden' : ''}>{selected?.text}</span>
          </span>
        )
      }}
      options={options.map(l => ({
        key: l.locale,
        name: l.text
      }))}
    />
  )
}
